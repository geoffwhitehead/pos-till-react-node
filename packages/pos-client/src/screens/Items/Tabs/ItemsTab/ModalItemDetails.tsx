import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { FieldArray, Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { Loading } from '../../../../components/Loading/Loading';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ActionSheet, Col, Form, Grid, H2, Icon, Input, List, ListItem, Picker, Row, Text } from '../../../../core';
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

const generateItemSchema = (shortNameLength: number) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .required('Required'),
    shortName: Yup.string()
      .min(2, 'Too Short')
      .max(shortNameLength, 'Too Long')
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
  const { organization } = useContext(OrganizationContext);

  const itemSchema = generateItemSchema(organization.shortNameLength);
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
    <Formik initialValues={initialValues} validationSchema={itemSchema} onSubmit={values => updateItem(values)}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name, shortName, prices, categoryId, printerGroupId } = values;

        const title = item ? `${capitalize(item.name)}` : 'New Item';

        console.log('touched', touched);
        console.log('errors', errors);
        console.log('values', values);
        return (
          <ModalContentButton
            title={title}
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
                      <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                        <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                      </ItemField>

                      <Text style={styles.text} note>
                        A shortname will be used on printers where space is restricted.
                      </Text>
                      <ItemField
                        label="Short Name"
                        touched={touched.shortName}
                        name="shortName"
                        errors={errors.shortName}
                      >
                        <Input
                          onChangeText={handleChange('shortName')}
                          onBlur={handleBlur('shortName')}
                          value={shortName}
                        />
                      </ItemField>

                      <ItemField
                        picker
                        label="Category"
                        touched={touched.categoryId}
                        name="categoryId"
                        errors={errors.categoryId}
                      >
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
                      </ItemField>

                      <Text style={styles.text} note>
                        On storing a bill, this item will be sent to all printers associated with this printer group.
                      </Text>

                      <ItemField
                        picker
                        label="Printer Group"
                        touched={touched.printerGroupId}
                        name="printerGroupId"
                        errors={errors.printerGroupId}
                      >
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
                      </ItemField>
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
                          return priceGroups.map((priceGroup, index) => {
                            return (
                              <ItemField
                                label={capitalize(priceGroup.name)}
                                touched={touched.prices && touched.prices[index]?.price}
                                name={`prices[${index}].price`}
                                errors={errors.prices && errors.prices[index]}
                              >
                                <Input
                                  onChangeText={handleChange(`prices[${index}].price`)}
                                  onBlur={handleBlur(`prices[${index}]`)}
                                  value={prices[index].price}
                                />
                              </ItemField>
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
