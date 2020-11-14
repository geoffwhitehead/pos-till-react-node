import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { Modal } from '../../../../components/Modal/Modal';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ActionSheet, Body, Button, Icon, Left, List, ListItem, Right, Spinner, Text, View } from '../../../../core';
import { Discount, tableNames } from '../../../../models';
import { formatNumber } from '../../../../utils';
import { MAX_DISCOUNTS } from '../../../../utils/consts';
import { resolveButtonState } from '../../../../utils/helpers';
import { commonStyles } from '../styles';
import { ModalDiscountDetails } from './ModalDiscountDetails';

interface DiscountTabOuterProps {
  database: Database;
}

interface DiscountTabInnerProps {
  discounts: Discount[];
}

const DiscountTabInner: React.FC<DiscountTabOuterProps & DiscountTabInnerProps> = ({ database, discounts }) => {
  const { organization } = useContext(OrganizationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>();

  const onDelete = async (discount: Discount) => {
    await database.action(() => discount.markAsDeleted());
  };

  const onCancelHandler = () => {
    setSelectedDiscount(null);
    setIsModalOpen(false);
  };

  const areYouSure = (fn, discount: Discount) => {
    const options = ['Yes', 'Cancel'];
    ActionSheet.show(
      {
        options,
        title: 'Are you sure?',
      },
      index => {
        index === 0 && fn(discount);
      },
    );
  };

  if (!discounts) {
    return <Spinner />;
  }

  const isCreateDisabled = discounts.length >= MAX_DISCOUNTS;

  return (
    <View>
      <List>
        <ListItem itemDivider>
          <Left>
            <Text>Discount</Text>
          </Left>
          <Right>
            <Button
              {...resolveButtonState(isCreateDisabled, 'success')}
              iconLeft
              small
              onPress={() => setIsModalOpen(true)}
            >
              <Icon name="ios-add-circle-outline" />
              <Text>Create</Text>
            </Button>
          </Right>
        </ListItem>
        <ScrollView>
          {discounts.map(discount => {
            const isSelected = selectedDiscount === discount;
            const amountString = discount.isPercent
              ? `${discount.amount}%`
              : formatNumber(discount.amount / 100, organization.currency);

            return (
              <ListItem key={discount.id} noIndent style={isSelected ? commonStyles.selectedRow : {}}>
                <Left style={styles.rowText}>
                  <Text style={styles.text}>{discount.name}</Text>
                  <Text style={styles.text} note>
                    {amountString}
                  </Text>
                </Left>
                <Body></Body>

                <Button
                  style={{ marginRight: 10 }}
                  bordered
                  danger
                  small
                  disabled={discounts.length === 1}
                  onPress={() => areYouSure(onDelete, discount)}
                >
                  <Text>Delete</Text>
                </Button>
              </ListItem>
            );
          })}
          {isCreateDisabled && <Text>Max discounts reached</Text>}
        </ScrollView>
      </List>
      <Modal isOpen={isModalOpen} onClose={onCancelHandler} style={{ maxWidth: 600 }}>
        <ModalDiscountDetails discount={selectedDiscount} onClose={onCancelHandler} />
      </Modal>
    </View>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<DiscountTabOuterProps, DiscountTabInnerProps>([], ({ database }) => ({
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
    }))(c),
  );

export const DiscountsTab = enhance(DiscountTabInner);

const styles = {
  rowText: { flexDirection: 'column' },
  text: { alignSelf: 'flex-start' },
} as const;
