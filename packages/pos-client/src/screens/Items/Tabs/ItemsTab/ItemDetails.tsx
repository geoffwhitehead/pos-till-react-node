import { ListItem, Item, Text, Icon, Grid, Row, Col, Form, Label, Input, H2, Picker, List } from '../../../../core';
import React, { useState, useEffect } from 'react';
import withObservables from '@nozbe/with-observables';
import {
  Item as ItemModel,
  Category,
  tableNames,
  PrinterGroup,
  Modifier,
  PriceGroup,
  ItemPrice,
} from '../../../../models';
import { styles } from '../../../../styles';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../../../components/Loading/Loading';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { ModifierRow } from './ModifierRow';

interface ItemDetailsOuterProps {
  item: ItemModel;
  onClose: () => void;
  database: Database;
}

interface ItemDetailsInnerProps {
  item: ItemModel;
  categories: Category[];
  printerGroups: PrinterGroup[];
  prices: ItemPrice[];
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
    .max(10, 'Too Long')
    .required('Required'),
  categoryId: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  printerGroupId: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  prices: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('Required'),
      priceGroupId: Yup.string().required('Required'),
      price: Yup.number(),
    }),
  ),
});

// TODO: really need to refaactor some of these components and styles.

const ItemDetailsInner: React.FC<ItemDetailsOuterProps & ItemDetailsInnerProps> = ({
  item,
  onClose,
  categories,
  printerGroups,
  prices,
  priceGroups,
  modifiers,
  itemModifiers,
}) => {
  if (!categories || !item || !prices) {
    return <Loading />;
  }
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedModifiers(itemModifiers);
  }, [itemModifiers]);

  const setAssignedModifiers = (modifier: Modifier) => {
    const alreadyAssigned = selectedModifiers.includes(modifier);

    if (alreadyAssigned) {
      setSelectedModifiers(selectedModifiers.filter(m => m !== modifier));
    } else {
      setSelectedModifiers([...selectedModifiers, modifier]);
    }
  };

  const updateItem = async values => {
    setLoading(true);
    await item.updateItem({ ...values, modifiers: selectedModifiers });
    setLoading(false);
    onClose();
  };

  const resolvePrice = (priceGroup: PriceGroup, prices: ItemPrice[]): string => {
    const found = prices.find(price => price.priceGroupId === priceGroup.id);
    return found ? found.price.toString() : '';
  };

  const initialValues = {
    name: item.name,
    shortName: item.shortName,
    categoryId: item.categoryId,
    printerGroupId: item.printerGroupId,
    prices: priceGroups.map(pG => {
      return { id: pG.id, priceGroupId: pG.id, price: resolvePrice(pG, prices) };
    }),
  };

  const resolvePriceGroup = id => priceGroups.find(pg => pg.id === id);

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

        return (
          <ModalContentButton
            title="Item details"
            onPressPrimaryButton={handleSubmit}
            primaryButtonText="Save"
            isPrimaryDisabled={loading}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
          >
            <Grid>
              <Row>
                <Col style={styles.column}>
                  <Form>
                    <Item stackedLabel error={err.name}>
                      <Label>Name</Label>
                      <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                    </Item>
                    <Text style={styles.text} note>
                      A shortname will be used on printers where space is restricted
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
                      On storing a bill, this item will be printed to all printers assigned to the selected printer
                      group. You can edit printer groups in the settings page.
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
                        {printerGroups.map(({ id, name }) => (
                          <Picker.Item key={id} label={name} value={id} />
                        ))}
                      </Picker>
                    </Item>
                  </Form>
                </Col>
                <Col style={styles.column}>
                  <Form>
                    <H2 style={styles.heading}>Price Groups</H2>
                    <Text style={styles.text} note>
                      You can specify a price for all available price groups. If you leave a price group blank, the item
                      won't exist within that price group.
                    </Text>
                    <FieldArray
                      name="prices"
                      render={arrayHelpers => {
                        return (
                          prices?.length > 0 &&
                          prices.map((price, i) => (
                            <Item key={price.id} stackedLabel error={err?.prices[i]?.price}>
                              <Label>{resolvePriceGroup(price.priceGroupId).name}</Label>
                              <Input
                                onChangeText={handleChange(`prices[${i}].price`)}
                                onBlur={handleBlur(`prices[${i}]`)}
                                value={price.price.toString()}
                              />
                            </Item>
                          ))
                        );
                      }}
                    />
                  </Form>
                </Col>
              </Row>
              <H2 style={{ ...styles.indent, paddingTop: 30 }}>Modifiers</H2>

              <Row style={styles.row}>
                <Col style={s.pl}>
                  <List>
                    <ListItem itemDivider>
                      <Text>Assigned</Text>
                    </ListItem>
                    {selectedModifiers.map(m => (
                      <ModifierRow isLeft key={m.id} modifier={m} onSelect={m => setAssignedModifiers(m)} />
                    ))}
                  </List>
                </Col>
                <Col style={s.pr}>
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
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<ItemDetailsOuterProps, ItemDetailsInnerProps>(['item'], ({ item, database }) => ({
      item,
      categories: database.collections.get<Category>(tableNames.categories).query(),
      printerGroups: database.collections.get<PrinterGroup>(tableNames.printerGroups).query(),
      prices: item.prices,
      itemModifiers: item.modifiers,
      modifiers: database.collections.get<Modifier>(tableNames.modifiers).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const ItemDetails = enhance(ItemDetailsInner);

const s = {
  pl: {
    margin: 5,
    marginRight: 0,
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    // borderRadius: 2,
    // borderRight: 'none'
  },
  pr: {
    margin: 5,
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    // borderRadius: 2,
    // marginLeft: 0,
    // borderLeft: 'none'
  },
};
