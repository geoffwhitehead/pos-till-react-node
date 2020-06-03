import { formatNumber } from "../../../../../utils";
import { Separator, Text, ListItem, Left, Right } from "native-base";
import React from "react";

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

export const DiscountsBreakdown: React.FC<{
    discountBreakdown: any;
    readonly: boolean;
    selected: any;
    onSelect: (item) => void;
  }> = ({ discountBreakdown, readonly, selected, onSelect }) => {
    if (!discountBreakdown || !discountBreakdown.length) {
      return null;
    }
  
    const discountText = discount =>
      discount.isPercent
        ? `Discount: ${discount.name} ${discount.amount}%`
        : `Discount: ${discount.name} ${formatNumber(discount.amount, currencySymbol)}`;
  
    return (
      <>
        <Separator bordered>
          <Text>Discounts</Text>
        </Separator>
        {discountBreakdown.map(breakdown => {
          return (
            <ListItem
              key={breakdown.billDiscountId}
              selected={selected}
              onPress={() => !readonly && onSelect(breakdown.billDiscountId)}
            >
              <Left>
                <Text>{discountText(breakdown)}</Text>
              </Left>
              <Right>
                <Text>{`${formatNumber(breakdown.calculatedDiscount, currencySymbol)}`}</Text>
              </Right>
            </ListItem>
          );
        })}
      </>
    );
  };