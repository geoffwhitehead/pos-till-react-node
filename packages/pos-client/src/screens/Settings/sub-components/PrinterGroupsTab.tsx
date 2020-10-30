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
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, PrinterGroup } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../../components/Loading/Loading';
import Modal from 'react-native-modal';
import { PrinterGroupRow } from './PrinterGroupRow';
import { PrinterGroupDetails } from './PrinterGroupDetails';

interface PrinterGroupsTabOuterProps {
  database: Database;
}

interface PrinterGroupsTabInnerProps {
  printerGroups: PrinterGroup[];
}

const PrinterGroupsTabInner: React.FC<PrinterGroupsTabOuterProps & PrinterGroupsTabInnerProps> = ({
  database,
  printerGroups,
}) => {
  const [selectedPrinterGroup, setSelectedPrinterGroup] = useState<PrinterGroup>();
  const [loading, setLoading] = useState(false);

  const onCancelHandler = () => {
    setSelectedPrinterGroup(null);
  };

  const addPrinterGroup = async () => {
    setLoading(true);
    await database.action(() =>
      database.collections.get<PrinterGroup>(tableNames.printerGroups).create(printerGroupRecord => {
        printerGroupRecord.name = '';
      }),
    );
    setLoading(false);
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
                    <Button small disabled={loading} onPress={() => addPrinterGroup()}>
                      <Text>Create</Text>
                    </Button>
                  </Right>
                </ListItem>
                {printerGroups.map(printerGroup => (
                  <PrinterGroupRow
                    isSelected={printerGroup === selectedPrinterGroup}
                    printerGroup={printerGroup}
                    onSelect={setSelectedPrinterGroup}
                    onDelete={() => areYouSure(onDelete, printerGroup)}
                  />
                ))}
              </List>
            </Col>
          </Row>
          <Modal
            propagateSwipe
            isVisible={!!selectedPrinterGroup}
            onBackButtonPress={onCancelHandler}
            onBackdropPress={onCancelHandler}
            animationInTiming={50}
            animationOutTiming={50}
            hideModalContentWhileAnimating={true}
            backdropTransitionInTiming={50}
            backdropTransitionOutTiming={50}
          >
            {selectedPrinterGroup && (
              <PrinterGroupDetails printerGroup={selectedPrinterGroup} onClose={onCancelHandler} />
            )}
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
