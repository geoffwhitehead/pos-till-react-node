import withObservables from '@nozbe/with-observables';
import { FieldArray, Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Form, Icon, Input, Label, List, ListItem, Picker, Text, View } from '../../../../core';
import { database } from '../../../../database';
import { Category, Item, ItemPrice, PriceGroup } from '../../../../models';
import { commonStyles } from '../../../Settings/Tabs/styles';

type PriceGroupItemsOuterProps = {
  onClose: () => void;
  priceGroup: PriceGroup;
  sortedItems: Item[];
  categories: Category[];
};

type PriceGroupItemsInnerProps = { itemPrices: ItemPrice[] };

const schema = Yup.object().shape({
  sortedItemPrices: Yup.array()
    .of(
      Yup.object().shape({
        item: Yup.object(),
        itemPrice: Yup.object(),
        price: Yup.string(),
      }),
    )
    .required(),
});

type FormValues = {
  sortedItemPrices: {
    item: Item;
    itemPrice: ItemPrice;
    price: string;
  }[];
};

export const PriceGroupItemsModalInner: React.FC<PriceGroupItemsInnerProps & PriceGroupItemsOuterProps> = ({
  priceGroup,
  onClose,
  sortedItems,
  itemPrices,
  categories,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0] || null);

  const updatePrices = async (values: FormValues) => {
    setLoading(true);
    const toUpdate = values.sortedItemPrices.filter(({ itemPrice, price }) => itemPrice.price !== parseInt(price));

    const batched = toUpdate.map(update =>
      update.itemPrice.prepareUpdate(record => {
        const price = update.price ? parseInt(update.price) : null;
        record.price = price;
      }),
    );

    await database.action(() => database.batch(...batched));
    setLoading(false);
  };

  const keyedItemPrices = useMemo(() => {
    const filteredItemPrices = itemPrices.filter(itemPrice => itemPrice.priceGroupId === priceGroup.id);
    return keyBy(filteredItemPrices, itemPrice => itemPrice.itemId);
  }, [itemPrices, priceGroup]);

  const initialValues = useMemo(
    () => ({
      sortedItemPrices: sortedItems
        .filter(item => item.categoryId === selectedCategory.id)
        .map(item => {
          const itemPrice = keyedItemPrices[item.id];
          return {
            item,
            itemPrice,
            price: itemPrice.price == null ? '' : itemPrice.price.toString(),
          };
        }),
    }),
    [sortedItems, selectedCategory, keyedItemPrices],
  );

  const title = `${capitalize(priceGroup.name)}: Edit Prices`;

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={updatePrices} enableReinitialize={true}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { sortedItemPrices } = values;

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            isPrimaryDisabled={loading}
            size="small"
          >
            <>
              <ListItem itemDivider style={styles.categoryPickerItem}>
                <Label>
                  <Text style={styles.categoryPickerText}>Category: </Text>
                </Label>
                <Picker
                  mode="dropdown"
                  iosHeader="Select a category"
                  iosIcon={<Icon name="chevron-down-outline" />}
                  placeholder="Select a category"
                  selectedValue={selectedCategory}
                  onValueChange={c => setSelectedCategory(c)}
                >
                  {categories.map(category => {
                    return <Picker.Item key={category.id} label={category.name} value={category} />;
                  })}
                </Picker>
              </ListItem>
              {!selectedCategory && <Text>Select a category to show items...</Text>}
              {selectedCategory && (
                <ScrollView>
                  <Form style={commonStyles.form}>
                    <List>
                      <FieldArray
                        name="prices"
                        render={() => {
                          return sortedItemPrices.map(({ item, itemPrice, price }, index) => {
                            return (
                              <ListItem key={itemPrice.id}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Text style={{ paddingRight: 20 }}>{index + 1}</Text>
                                  <ItemField
                                    label={capitalize(item.name)}
                                    touched={touched.sortedItemPrices && touched.sortedItemPrices[index]?.price}
                                    name={`sortedItemPrices[${index}].price`}
                                    errors={errors.sortedItemPrices && errors.sortedItemPrices[index]}
                                    type="fixedLabel"
                                    style={{
                                      borderBottomWidth: 0,
                                    }}
                                  >
                                    <Input
                                      onChangeText={handleChange(`sortedItemPrices[${index}].price`)}
                                      onBlur={handleBlur(`sortedItemPrices[${index}].price`)}
                                      value={price}
                                    />
                                  </ItemField>
                                </View>
                              </ListItem>
                            );
                          });
                        }}
                      />
                    </List>
                  </Form>
                </ScrollView>
              )}
            </>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  categoryPickerItem: { paddingLeft: 15 },
  categoryPickerText: { color: 'grey' },
});

const enhance = c =>
  withObservables<PriceGroupItemsOuterProps, PriceGroupItemsInnerProps>(['priceGroup'], ({ priceGroup }) => ({
    itemPrices: priceGroup.itemPrices,
  }))(c);

export const PriceGroupItemsModal = enhance(PriceGroupItemsModalInner);
