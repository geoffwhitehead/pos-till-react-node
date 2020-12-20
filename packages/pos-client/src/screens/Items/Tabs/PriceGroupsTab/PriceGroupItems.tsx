import withObservables from '@nozbe/with-observables';
import { FieldArray, Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import { Button, Form, Icon, Input, Left, List, ListItem, Right, Text } from 'native-base';
import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { Item, ItemPrice, PriceGroup } from '../../../../models';
import { commonStyles } from '../../../Settings/Tabs/styles';

type PriceGroupItemsOuterProps = {
  priceGroup: PriceGroup;
  sortedItems: Item[];
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

export const PriceGroupItemsInner: React.FC<PriceGroupItemsOuterProps & PriceGroupItemsInnerProps> = ({
  sortedItems,
  itemPrices,
  priceGroup,
}) => {
  // if (!priceGroup) {
  //   return (
  //     <>
  //       <ListItem itemDivider>
  //         <Left>
  //           <Text>Price Groups</Text>
  //         </Left>
  //         <Right />
  //       </ListItem>
  //       <Text note style={{ padding: 15 }}>
  //         Select a price group to bulk edit item prices...
  //       </Text>
  //     </>
  //   );
  // }

  const keyedItemPrices = useMemo(() => {
    if (!priceGroup) {
      return {};
    }
    const filteredItemPrices = itemPrices.filter(itemPrice => itemPrice.priceGroupId === priceGroup.id);
    return keyBy(filteredItemPrices, itemPrice => itemPrice.itemId);
  }, [itemPrices, priceGroup]);

  const initialValues = {
    sortedItemPrices: priceGroup
      ? sortedItems.map(item => {
          const itemPrice = keyedItemPrices[item.id];
          return {
            item,
            itemPrice,
            price: itemPrice.price.toString() || '',
          };
        })
      : [],
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={values => {}} enableReinitialize={true}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values, isValid }) => {
        const { sortedItemPrices } = values;

        return (
          <>
            <ListItem itemDivider>
              <Left>
                <Text>Price Groups</Text>
              </Left>
              <Right>
                <Button iconLeft success small onPress={() => {}}>
                  <Icon name="ios-add-circle-outline" />
                  <Text>Save</Text>
                </Button>
              </Right>
            </ListItem>
            {!priceGroup && (
              <Text note style={{ padding: 15 }}>
                Select a price group to bulk edit item prices...
              </Text>
            )}

            {priceGroup && (
              <Form style={commonStyles.form}>
                <List>
                  <FieldArray
                    name="prices"
                    render={() => {
                      return sortedItemPrices.map(({ item, itemPrice, price }, index) => {
                        return (
                          <ListItem key={itemPrice.id}>
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
                            {/* <Left>
                          <Text>{index}</Text>
                        </Left>
                        <Right>

                        </Right> */}
                          </ListItem>
                        );
                      });
                    }}
                  />
                </List>
              </Form>
            )}
          </>
        );
      }}
    </Formik>
  );
};

const enhance = c =>
  withObservables<PriceGroupItemsOuterProps, PriceGroupItemsInnerProps>(['priceGroup'], ({ priceGroup }) => ({
    itemPrices: priceGroup ? priceGroup.itemPrices : [],
  }))(c);

export const PriceGroupItems = enhance(PriceGroupItemsInner);
