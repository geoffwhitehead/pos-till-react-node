import { Text, Content, List, ListItem, Left, Right, Icon, Separator } from '../../../../core';
import { realm } from '../../../../services/Realm';
import { discountBreakdown, formatNumber } from '../../../../utils';
import React from 'react';

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
  activeBill: any; /// TODO
  readonly: boolean;
}

export const ReceiptItems: React.FC<ReceiptItemsProps> = ({ activeBill, readonly }) => {
  const containsPayments = activeBill.payments.length > 0;
  const containsDiscounts = activeBill.discounts.length > 0;

  return (
    <Content>
      <List>
        <Separator bordered>
          <Text>Items</Text>
        </Separator>
        {activeBill.items.map(item => {
          return (
            <ListItem key={item._id}>
              <Left>
                {!readonly && <Icon name="ios-close" onPress={voidItem(item)} />}
                <Content>
                  <Text>{`${item.name}`}</Text>
                  {item.mods.map(m => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))}
                </Content>
              </Left>
              <Right>
                <Text>{`${formatNumber(item.price, currencySymbol)}`}</Text>
                {item.mods.map(m => (
                  <Text key={`${m._id}price`}>{formatNumber(m.price, currencySymbol)}</Text>
                ))}
              </Right>
            </ListItem>
          );
        })}

        {containsDiscounts && (
          <Separator bordered>
            <Text>Discounts</Text>
          </Separator>
        )}
        {discountBreakdown(activeBill).map(discount => {
          return (
            <ListItem key={discount._id}>
              <Left>
                <Icon name="ios-close" onPress={voidDiscount(discount)} />
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
        {containsPayments && (
          <Separator bordered>
            <Text>Payments</Text>
          </Separator>
        )}
        {activeBill.payments.map(payment => {
          return (
            <ListItem key={payment._id}>
              <Left>
                <Icon name="ios-close" onPress={voidPayment(payment)} />
                <Content>
                  <Text>{`Payment: ${payment.paymentType}`}</Text>
                </Content>
              </Left>
              <Right>
                <Text>{`${formatNumber(payment.amount, currencySymbol)}`}</Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};
