import { capitalize } from 'lodash';
import { Left, ListItem, Right, Separator, Text } from 'native-base';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { BillDiscount } from '../../../../../models';
import { DiscountBreakdownProps as DiscountsBreakdownCalculationProps, formatNumber } from '../../../../../utils';
import { ITEM_SPACING } from '../../../../../utils/consts';

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
          <ListItem
            key={breakdown.billDiscountId}
            onPress={() => !readonly && onSelect(billDiscount)}
            style={styles.listItem}
          >
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

const styles = StyleSheet.create({
  listItem: {
    paddingTop: ITEM_SPACING,
    paddingBottom: ITEM_SPACING,
  },
});
