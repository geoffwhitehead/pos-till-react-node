import { Text, Content, List, ListItem, Left, Right, Icon, Separator } from '../../../../core';
import { realm } from '../../../../services/Realm';
import { discountBreakdown, formatNumber } from '../../../../utils';
import React, { useState, useEffect, Fragment } from 'react';
import { BillProps, BillItemProps } from '../../../../services/schemas';
import { capitalize, groupBy } from 'lodash';
import { Payments } from '../Payment/Payment';
import { Discounts } from '../../tests/Discounts';
import { View } from 'react-native';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

const voidItem = item => () => {
  realm.write(() => {
    item.mods.map(m => realm.delete(m));
    realm.delete(item);
  });
};

const voidPayment = payment => () => {
  realm.write(() => {
    realm.delete(payment);
  });
};

const voidDiscount = discount => () => {
  realm.write(() => {
    realm.delete(discount);
  });
};

interface ReceiptItemsProps {
  bill: BillProps;
  readonly: boolean;
  payments: any;
  discounts: any;
  discountsBreakdown: any;
  items: any;
}

export const ReceiptItems: React.FC<ReceiptItemsProps> = ({ bill, readonly, items, discounts, payments }) => {
  return (
    <Content>
      <List>
        <ItemsBreakdown items={items} readonly={readonly} />
        <DiscountsBreakdown discounts={discounts} readonly={readonly} />
        <PaymentsBreakdown payments={payments} readonly={readonly} />
      </List>
    </Content>
  );
};
const ItemsBreakdown: React.FC<{ items: any; readonly: boolean }> = ({ items, readonly }) => {
  if (!items) {
    return null;
  }

  const billItemGroups = groupBy(items, item => item.priceGroupId);

  return (
    <>
      <Separator bordered>
        <Text>Items</Text>
      </Separator>
      {Object.values(billItemGroups).map(itemGroup => {
        return [
          <ListItem itemHeader first>
            <Text>{capitalize(itemGroup[0].priceGroupName)}</Text>
          </ListItem>,
          ...itemGroup.map(item => {
            return (
              <ListItem noIndent key={item.id}>
                <Left>
                  {!readonly && <Icon name="ios-close" onPress={voidItem(item)} />}
                  <Content>
                      <Text>{`${capitalize(item.itemName)}`}</Text>
                      {/* {item.mods.map(m => (
                        <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                      ))} */}
                    </Content>
                </Left>
                <Right>
                  <Text>{`${formatNumber(item.itemPrice, currencySymbol)}`}</Text>
                  {/* {item.mods.map(m => (
                      <Text key={`${m._id}price`}>{formatNumber(m.price, currencySymbol)}</Text>
                    ))} */}
                </Right>
              </ListItem>
            );
          }),
        ];
      })}
    </>
  );
};

const DiscountsBreakdown: React.FC<{ discounts: any; readonly: boolean }> = ({ discounts, readonly }) => {
  if (!discounts || !discounts.length) {
    return null;
  }
  return (
    <>
      <Separator bordered>
        <Text>Discounts</Text>
      </Separator>
      {discounts.map(discount => {
        return (
          <ListItem key={discount.id}>
            <Left>
              {!readonly && <Icon name="ios-close" onPress={voidDiscount(discount)} />}
              <Content>
                {discount.isPercent ? (
                  <Text>{`Discount: ${discount.name} ${discount.amount}%`}</Text>
                ) : (
                  <Text>{`Discount: ${discount.name} ${formatNumber(discount.amount, currencySymbol)}`}</Text>
                )}
              </Content>
            </Left>
            <Right>
              <Text>{`${formatNumber(discount.calculatedDiscount, currencySymbol)}`}</Text>
            </Right>
          </ListItem>
        );
      })}
    </>
  );
};

const PaymentsBreakdown: React.FC<{ payments: any; readonly: boolean }> = ({ payments, readonly }) => {
  if (!payments || !payments.length) {
    return null;
  }

  return (
    <>
      <Separator bordered>
        <Text>Payments</Text>
      </Separator>
      {payments
        .filter(payment => !payment.isChange)
        .map(payment => {
          return (
            <>
              <ListItem key={payment._id}>
                <Left>
                  {!readonly && <Icon name="ios-close" onPress={voidPayment(payment)} />}
                  <Content>
                    <Text>{`Payment: ${capitalize(payment.paymentType)}`}</Text>
                  </Content>
                </Left>
                <Right>
                  <Text>{`${formatNumber(payment.amount, currencySymbol)}`}</Text>
                </Right>
              </ListItem>
            </>
          );
        })}
    </>
  );
};
