import React, { useContext } from 'react';
import { formatNumber } from '../../../../../utils';
import { Separator, Text, ListItem, Left, Right } from 'native-base';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';

interface DiscountBreakdownProps {
  discountBreakdown: any;
  readonly: boolean;
  onSelect: (billDiscountId: string) => void;
}
export const DiscountsBreakdown: React.FC<DiscountBreakdownProps> = ({ discountBreakdown, readonly, onSelect }) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  if (!discountBreakdown || !discountBreakdown.length) {
    return null;
  }

  const discountText = discount =>
    discount.isPercent
      ? `Discount: ${discount.name} ${discount.amount}%`
      : `Discount: ${discount.name} ${formatNumber(discount.amount, currency)}`;

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
              <Text>{`${formatNumber(breakdown.calculatedDiscount, currency)}`}</Text>
            </Right>
          </ListItem>
        );
      })}
    </>
  );
};
