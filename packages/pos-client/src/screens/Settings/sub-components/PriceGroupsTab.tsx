import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useContext, useState } from 'react';
import { Loading } from '../../../components/Loading/Loading';
import { Modal } from '../../../components/Modal/Modal';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import {
  ActionSheet,
  Body,
  Button,
  Col,
  Container,
  Content,
  Grid,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Row,
  Text,
} from '../../../core';
import { PriceGroup, tableNames } from '../../../models';
import { PriceGroupDetails } from './PriceGroupDetails';
import { commonStyles } from './styles';

interface PriceGroupsTabOuterProps {
  database: Database;
}

interface PriceGroupsTabInnerProps {
  priceGroups: PriceGroup[];
}

const PriceGroupsTabInner: React.FC<PriceGroupsTabOuterProps & PriceGroupsTabInnerProps> = ({
  database,
  priceGroups,
}) => {
  const [selectedPriceGroup, setSelectedPriceGroup] = useState<PriceGroup>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { organization } = useContext(OrganizationContext);

  const onCancelHandler = () => {
    setSelectedPriceGroup(null);
    setIsModalOpen(false);
  };

  const onDelete = async (priceGroup: PriceGroup) => {
    await database.action(() => priceGroup.remove(organization));
  };

  const areYouSure = (fn, priceGroup: PriceGroup) => {
    const options = ['Yes', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length,
        title: 'This will permanently remove this price group and remove its prices for all items. Are you sure?',
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
  if (!priceGroups) {
    return <Loading />;
  }
  return (
    <Container>
      <Content>
        <Grid>
          <Row>
            <Col>
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
                {priceGroups.map(priceGroup => {
                  const isSelected = priceGroup === selectedPriceGroup;
                  return (
                    <ListItem key={priceGroup.id} noIndent style={isSelected ? commonStyles.selectedRow : {}}>
                      <Left>
                        <Text>{priceGroup.name}</Text>
                      </Left>
                      <Body></Body>

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
                        <Text>View</Text>
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            </Col>
          </Row>
          <Modal isOpen={isModalOpen} onClose={onCancelHandler} style={{ maxWidth: 800 }}>
            <PriceGroupDetails priceGroup={selectedPriceGroup} onClose={onCancelHandler} />
          </Modal>
        </Grid>
      </Content>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<PriceGroupsTabOuterProps, PriceGroupsTabInnerProps>([], ({ database }) => ({
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const PriceGroupsTab = enhance(PriceGroupsTabInner);
