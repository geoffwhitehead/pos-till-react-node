import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { FieldArray, Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { Loading } from '../../../../components/Loading/Loading';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import {
  ActionSheet,
  Col,
  Form,
  Grid,
  H2,
  Icon,
  Input,
  Item,
  Label,
  List,
  ListItem,
  Picker,
  Row,
  Text,
} from '../../../../core';
import {
  Category,
  Item as ItemModel,
  ItemModifier,
  ItemPrice,
  Modifier,
  PriceGroup,
  PrinterGroup,
  tableNames,
} from '../../../../models';
import { styles } from '../../../../styles';
import { SHORT_NAME_LENGTH } from '../../../../utils/consts';
import { ModifierRow } from './ModifierRow';

interface ItemDetailsOuterProps {
  item?: ItemModel;
  onClose: () => void;
  database: Database;
  categories: Category[];
}

interface ItemDetailsInnerProps {
  item?: ItemModel;
  categories: Category[];
  printerGroups: PrinterGroup[];
  itemPrices: ItemPrice[];
  modifiers: Modifier[];
  itemModifiers: Modifier[];
  priceGroups: PriceGroup[];
}

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  shortName: Yup.string()
    .min(2, 'Too Short')
    .max(SHORT_NAME_LENGTH, 'Too Long')
    .required('Required'),
  categoryId: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  printerGroupId: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long'),
  prices: Yup.array().of(
    Yup.object().shape({
      priceGroup: Yup.object(),
      price: Yup.string(),
    }),
  ),
});

const ItemDetailsInner: React.FC<ItemDetailsOuterProps & ItemDetailsInnerProps> = ({
  item,
  onClose,
  categories,
  printerGroups,
  itemPrices = [],
  priceGroups,
  modifiers = [],
  itemModifiers,
  database,
}) => {
  if (!priceGroups) {
    return <Loading />;
  }
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(false);

  const keyedItemPricesByPriceGroup = keyBy(itemPrices, itemPrice => itemPrice.priceGroupId);

  useEffect(() => {
    itemModifiers && setSelectedModifiers(itemModifiers);
  }, [itemModifiers]);

  const setAssignedModifiers = (modifier: Modifier) => {
    const alreadyAssigned = selectedModifiers.includes(modifier);

    if (alreadyAssigned) {
      setSelectedModifiers(selectedModifiers.filter(m => m !== modifier));
    } else {
      setSelectedModifiers([...selectedModifiers, modifier]);
    }
  };

  const areYouSure = (fn, item: ItemModel) => {
    const options = ['Remove', 'Cancel'];

    ActionSheet.show(
      {
        options,
        destructiveButtonIndex: 0,
        title: 'Remove this item. Are you sure?',
      },
      index => {
        index === 0 && fn(item);
      },
    );
  };

  const updateItem = async ({ prices, ...values }: FormValues) => {
    setLoading(true);

    if (item) {
      const reMappedPrices = prices.map(({ priceGroup, price }) => {
        const nullOrPrice = price === '' ? null : parseInt(price);

        return {
          itemPrice: keyedItemPricesByPriceGroup[priceGroup.id],
          price: nullOrPrice,
        };
      });
      await database.action(() => item.updateItem({ ...values, prices: reMappedPrices, selectedModifiers }));
      onClose();
    } else {
      const itemCollection = database.collections.get<ItemModel>(tableNames.items);
      const itemModifierCollection = database.collections.get<ItemModifier>(tableNames.itemModifiers);
      const itemPriceCollection = database.collections.get<ItemPrice>(tableNames.itemPrices);
      const itemToCreate = itemCollection.prepareCreate(newItem => {
        Object.assign(newItem, {
          name: values.name,
          shortName: values.shortName,
          categoryId: values.categoryId,
          printerGroupId: values.printerGroupId,
        });
      });

      const itemModifersToCreate = selectedModifiers.map(modifier =>
        itemModifierCollection.prepareCreate(newItemModifier => {
          newItemModifier.item.set(itemToCreate);
          newItemModifier.modifier.set(modifier);
        }),
      );

      const pricesToCreate = prices.map(({ price, priceGroup }) => {
        const nullOrPrice = price === '' ? null : parseInt(price);

        return itemPriceCollection.prepareCreate(record => {
          record.priceGroup.set(priceGroup);
          record.item.set(itemToCreate);
          Object.assign(record, {
            price: nullOrPrice,
          });
        });
      });

      const toCreate = [itemToCreate, ...itemModifersToCreate, ...pricesToCreate];
      await database.action(() => database.batch(...toCreate));
    }
    setLoading(false);
    onClose();
  };

  const handleDelete = async (item: ItemModel) => {
    await database.action(() => item.remove());
    onClose();
  };

  const initialValues = {
    name: item?.name || '',
    shortName: item?.shortName || '',
    categoryId: item?.categoryId || '',
    printerGroupId: item?.printerGroupId || '',
    prices: priceGroups.map(priceGroup => {
      /**
       * the 2 null checks here cover 2 scenarios:
       * - the item price doesnt exist because this is the "create" modal.
       * - the price exists but has been set to null to prevent the item being selected for this price group.
       */
      const priceOrEmptyString = keyedItemPricesByPriceGroup[priceGroup.id]?.price?.toString() || '';
      return { priceGroup: priceGroup, price: priceOrEmptyString };
    }),
  };

  type FormValues = {
    name: string;
    shortName: string;
    categoryId: string;
    printerGroupId: string;
    prices: { priceGroup: PriceGroup; price: string }[];
  };

  return (
    <Formik initialValues={initialValues} validationSchema={ItemSchema} onSubmit={values => updateItem(values)}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name, shortName, prices, categoryId, printerGroupId } = values;
        const err = {
          name: !!(touched.name && errors.name),
          prices: !!(touched.prices && errors.prices),
          categoryId: !!(touched.categoryId && errors.categoryId),
          printerGroupId: !!(touched.printerGroupId && errors.printerGroupId),
          shortName: !!(touched.shortName && errors.shortName),
        };

        const title = item ? `${capitalize(item.name)}` : 'New Item';

        return (
          <ModalContentButton
            title="Item details"
            onPressPrimaryButton={handleSubmit}
            primaryButtonText="Save"
            isPrimaryDisabled={loading}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            onPressDelete={() => areYouSure(handleDelete, item)}
            size="medium"
          >
            <ScrollView>
              <Grid>
                <Row>
                  <Col style={styles.columnLeft}>
                    <Form>
                      <Item stackedLabel error={err.name}>
                        <Label>Name</Label>
                        <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                      </Item>
                      <Text style={styles.text} note>
                        A shortname will be used on printers where space is restricted.
                      </Text>
                      <Item stackedLabel error={err.shortName}>
                        <Label>ShortName</Label>
                        <Input
                          onChangeText={handleChange('shortName')}
                          onBlur={handleBlur('shortName')}
                          value={shortName}
                        />
                      </Item>
                      <Item picker stackedLabel>
                        <Label>Category</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ width: undefined }}
                          placeholder="Select category"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          selectedValue={categoryId}
                          onValueChange={handleChange('categoryId')}
                        >
                          {categories.map(({ id, name }) => (
                            <Picker.Item key={id} label={name} value={id} />
                          ))}
                        </Picker>
                      </Item>
                      <Text style={styles.text} note>
                        On storing a bill, this item will be sent to all printers associated with this printer group.
                      </Text>
                      <Item picker stackedLabel>
                        <Label>Printer Group</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ width: undefined }}
                          placeholder="Select printer group"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          selectedValue={printerGroupId}
                          onValueChange={handleChange('printerGroupId')}
                        >
                          {[...printerGroups, { id: '', name: 'None' }].map(({ id, name }) => (
                            <Picker.Item key={id} label={name} value={id} />
                          ))}
                        </Picker>
                      </Item>
                    </Form>
                  </Col>
                  <Col style={styles.columnRight}>
                    <Form>
                      <H2>Price Groups</H2>
                      <Text style={styles.text} note>
                        Note: If you leave a price group blank, the item won't exist within that price group.
                      </Text>
                      <FieldArray
                        name="prices"
                        render={() => {
                          return priceGroups.map((priceGroup, i) => {
                            return (
                              <Item key={priceGroup.id} stackedLabel error={err?.prices[i]?.price}>
                                <Label>{priceGroup.name}</Label>
                                <Input
                                  onChangeText={handleChange(`prices[${i}].price`)}
                                  onBlur={handleBlur(`prices[${i}]`)}
                                  value={prices[i].price}
                                />
                              </Item>
                            );
                          });
                        }}
                      />
                    </Form>
                  </Col>
                </Row>

                <Row style={styles.row}>
                  <H2 style={{ paddingTop: 20, ...styles.heading }}>Modifiers</H2>
                </Row>
                <Row style={styles.row}>
                  <Col>
                    <List>
                      <ListItem itemDivider>
                        <Text>Assigned</Text>
                      </ListItem>
                      {selectedModifiers.map(m => (
                        <ModifierRow isLeft key={m.id} modifier={m} onSelect={m => setAssignedModifiers(m)} />
                      ))}
                    </List>
                  </Col>
                  <Col>
                    <List>
                      <ListItem itemDivider>
                        <Text>Available</Text>
                      </ListItem>
                      {modifiers
                        .filter(m => !selectedModifiers.includes(m))
                        .map(m => (
                          <ModifierRow
                            key={m.id}
                            modifier={m}
                            onSelect={m => setSelectedModifiers([...selectedModifiers, m])}
                          />
                        ))}
                    </List>
                  </Col>
                </Row>
              </Grid>
            </ScrollView>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<ItemDetailsOuterProps, ItemDetailsInnerProps>(['item'], ({ item, database }) => {
      if (item) {
        return {
          item,
          printerGroups: database.collections.get<PrinterGroup>(tableNames.printerGroups).query(),
          itemPrices: item.prices,
          itemModifiers: item.modifiers,
          modifiers: database.collections.get<Modifier>(tableNames.modifiers).query(),
          priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
        };
      } else {
        return {
          printerGroups: database.collections.get<PrinterGroup>(tableNames.printerGroups).query(),
          modifiers: database.collections.get<Modifier>(tableNames.modifiers).query(),
          priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
        };
      }
    })(c),
  );

export const ItemDetails = enhance(ItemDetailsInner);
