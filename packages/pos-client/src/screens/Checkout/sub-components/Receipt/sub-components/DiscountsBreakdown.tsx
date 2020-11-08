import { capitalize } from 'lodash';
import { Left, ListItem, Right, Separator, Text } from 'native-base';
import React, { useContext } from 'react';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { BillDiscount } from '../../../../../models';
import { DiscountBreakdownProps as DiscountsBreakdownCalculationProps, formatNumber } from '../../../../../utils';

interface DiscountBreakdownProps {
  discountBreakdown: DiscountsBreakdownCalculationProps[];
  readonly: boolean;
  billDiscounts: BillDiscount[];
  onSelect: (billDiscount: BillDiscount) => void;
}
export const DiscountsBreakdown: React.FC<DiscountBreakdownProps> = ({
  discountBreakdown,
  readonly,
  onSelect,
  billDiscounts,
}) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  if (!discountBreakdown || !discountBreakdown.length) {
    return null;
  }

  const discountText = discount =>
    discount.isPercent ? `${capitalize(discount.name)} ${discount.amount}%` : `${capitalize(discount.name)}`;

  return (
    <>
      <Separator bordered>
        <Text>Discounts</Text>
      </Separator>
      {discountBreakdown.map(breakdown => {
        const billDiscount = billDiscounts.find(({ id }) => id === breakdown.billDiscountId);
        return (
          <ListItem key={breakdown.billDiscountId} onPress={() => !readonly && onSelect(billDiscount)}>
            <Left>
              <Text>{discountText(breakdown)}</Text>
            </Left>
            <Right>
              <Text>{`-${formatNumber(breakdown.calculatedDiscount, currency)}`}</Text>
            </Right>
          </ListItem>
        );
      })}
    </>
  );
};
