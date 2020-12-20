import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { sortBy } from 'lodash';
import React, { useContext, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Loading } from '../../../../components/Loading/Loading';
import { Modal } from '../../../../components/Modal/Modal';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ActionSheet, Button, Container, Icon, Left, List, ListItem, Right, Text } from '../../../../core';
import { Category, Item, PriceGroup, tableNames } from '../../../../models';
import { commonStyles } from '../../../Settings/Tabs/styles';
import { PriceGroupDetails } from './PriceGroupDetails';
import { PriceGroupItemsModal } from './PriceGroupItemsModal';

interface PriceGroupsTabOuterProps {
  database: Database;
}

interface PriceGroupsTabInnerProps {
  priceGroups: PriceGroup[];
  items: Item[];
  categories: Category[];
}

const PriceGroupsTabInner: React.FC<PriceGroupsTabOuterProps & PriceGroupsTabInnerProps> = ({
  database,
  priceGroups,
  items,
  categories,
}) => {
  const [selectedPriceGroup, setSelectedPriceGroup] = useState<PriceGroup>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);
  const { organization } = useContext(OrganizationContext);

  const onCancelHandler = () => {
    setSelectedPriceGroup(null);
    setIsModalOpen(false);
  };

  const onCancelPricesHandler = () => {
    setSelectedPriceGroup(null);
    setIsPricesModalOpen(false);
  };

  const sortedItems = useMemo(() => {
    return sortBy(items, item => item.name.toLowerCase());
  }, [items]);

  const onDelete = async (priceGroup: PriceGroup) => {
    await database.action(() => priceGroup.remove(organization));
  };

  const areYouSure = (fn, priceGroup: PriceGroup) => {
    const options = ['Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        title: 'Permanently remove this price group and remove its prices for all items?',
      },
      index => {
        index === 0 && fn(priceGroup);
      },
    );
  };

  const onSelect = priceGroup => {
    setSelectedPriceGroup(priceGroup);
    setIsModalOpen(true);
  };

  const onSelectPrices = priceGroup => {
    setSelectedPriceGroup(priceGroup);
    setIsPricesModalOpen(true);
  };

  if (!priceGroups) {
    return <Loading />;
  }

  return (
    <Container>
      <List>
        <ListItem itemDivider>
          <Left>
            <Text>Price Groups</Text>
          </Left>
          <Right>
            <Button iconLeft success small onPress={() => setIsModalOpen(true)}>
              <Icon name="ios-add-circle-outline" />
              <Text>Create</Text>
            </Button>
          </Right>
        </ListItem>
        <ScrollView>
          {priceGroups.map(priceGroup => {
            const isSelected = priceGroup === selectedPriceGroup;
            return (
              <ListItem
                key={priceGroup.id}
                onPress={() => setSelectedPriceGroup(priceGroup)}
                noIndent
                style={isSelected ? commonStyles.selectedRow : {}}
              >
                <Left>
                  <Text>{priceGroup.name}</Text>
                </Left>

                <Button style={{ marginRight: 10 }} bordered info small onPress={() => onSelectPrices(priceGroup)}>
                  <Text>Bulk Edit Prices</Text>
                </Button>

                <Button
                  style={{ marginRight: 10 }}
                  bordered
                  danger
                  small
                  disabled={priceGroups.length === 1}
                  onPress={() => areYouSure(onDelete, priceGroup)}
                >
                  <Text>Delete</Text>
                </Button>
                <Button bordered info small onPress={() => onSelect(priceGroup)}>
                  <Text>Edit</Text>
                </Button>
              </ListItem>
            );
          })}
        </ScrollView>
      </List>

      <Modal isOpen={isModalOpen} onClose={onCancelHandler}>
        <PriceGroupDetails priceGroup={selectedPriceGroup} onClose={onCancelHandler} />
      </Modal>

      <Modal isOpen={isPricesModalOpen} onClose={onCancelPricesHandler}>
        {selectedPriceGroup && (
          <PriceGroupItemsModal
            categories={categories}
            priceGroup={selectedPriceGroup}
            onClose={onCancelPricesHandler}
            sortedItems={sortedItems}
          />
        )}
      </Modal>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<PriceGroupsTabOuterProps, PriceGroupsTabInnerProps>([], ({ database }) => ({
      priceGroups: database.collections
        .get<PriceGroup>(tableNames.priceGroups)
        .query()
        .observeWithColumns(['name']),
      categories: database.collections
        .get<Category>(tableNames.categories)
        .query()
        .observeWithColumns(['name']),
      items: database.collections
        .get<Item>(tableNames.items)
        .query()
        .observeWithColumns(['name']),
    }))(c),
  );

export const PriceGroupsTab = enhance(PriceGroupsTabInner);
