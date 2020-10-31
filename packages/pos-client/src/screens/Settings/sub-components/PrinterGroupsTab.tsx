import React, { useState } from 'react';
import {
  Container,
  Content,
  Text,
  Body,
  Grid,
  Col,
  Row,
  Button,
  List,
  ListItem,
  Left,
  Right,
  ActionSheet,
  Icon,
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, PrinterGroup } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../../components/Loading/Loading';
import { PrinterGroupRow } from './PrinterGroupRow';
import { PrinterGroupDetails } from './PrinterGroupDetails';
import { Modal } from '../../../components/Modal/Modal';

interface PrinterGroupsTabOuterProps {
  database: Database;
}

interface PrinterGroupsTabInnerProps {
  printerGroups: PrinterGroup[];
}

const PrinterGroupsTabInner: React.FC<PrinterGroupsTabOuterProps & PrinterGroupsTabInnerProps> = ({
  printerGroups,
}) => {
  const [selectedPrinterGroup, setSelectedPrinterGroup] = useState<PrinterGroup>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCancelHandler = () => {
    setSelectedPrinterGroup(null);
    setIsModalOpen(false);
  };

  const onSelect = (printerGroup: PrinterGroup) => {
    setSelectedPrinterGroup(printerGroup);
    setIsModalOpen(true);
  };

  const onDelete = async (printerGroup: PrinterGroup) => {
    await printerGroup.remove();
  };

  const areYouSure = (fn, printerGroup: PrinterGroup) => {
    const options = ['Yes', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length,
        title:
          'This will permanently remove this printer group and remove this group from any items its assigned to. Are you sure?',
      },
      index => {
        index === 0 && fn(printerGroup);
      },
    );
  };

  if (!printerGroups) {
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
                    <Text>Printer Groups</Text>
                  </Left>
                  <Right>
                    <Button iconLeft success small onPress={() => setIsModalOpen(true)}>
                      <Icon name="ios-add-circle-outline" />
                      <Text>Create</Text>
                    </Button>
                  </Right>
                </ListItem>
                {printerGroups.map(printerGroup => (
                  <PrinterGroupRow
                    key={printerGroup.id}
                    isSelected={printerGroup === selectedPrinterGroup}
                    printerGroup={printerGroup}
                    onSelect={onSelect}
                    onDelete={() => areYouSure(onDelete, printerGroup)}
                  />
                ))}
              </List>
            </Col>
          </Row>
          <Modal isOpen={isModalOpen} onClose={onCancelHandler} style={{ maxWidth: 800 }}>
            <PrinterGroupDetails printerGroup={selectedPrinterGroup} onClose={onCancelHandler} />
          </Modal>
        </Grid>
      </Content>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<PrinterGroupsTabOuterProps, PrinterGroupsTabInnerProps>([], ({ database }) => ({
      printerGroups: database.collections.get<PrinterGroup>(tableNames.printerGroups).query(),
    }))(c),
  );

export const PrinterGroupsTab = enhance(PrinterGroupsTabInner);
