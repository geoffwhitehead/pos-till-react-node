import React from "react";
import { formatNumber } from "../../../../../utils";
import { Separator, Text, ListItem, Left, Right } from "native-base";

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

interface DiscountBreakdownProps {
  discountBreakdown: any;
  readonly: boolean;
  // selected: boolean;
  onSelect: (billDiscountId: string) => void;
}
export const DiscountsBreakdown: React.FC<DiscountBreakdownProps> = ({ discountBreakdown, readonly, onSelect }) => {
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
              // selected={selected} // TODO: check this
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