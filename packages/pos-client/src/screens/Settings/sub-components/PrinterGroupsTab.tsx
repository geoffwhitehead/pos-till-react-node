import React, { useContext, useState } from 'react';
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
  Item,
  Label,
  Input,
  Picker,
  Icon,
  Form,
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, Printer, PrinterGroup } from '../../../models';
import { Database, Query } from '@nozbe/watermelondb';
import { Loading } from '../../../components/Loading/Loading';
import { capitalize } from 'lodash';
import { PrinterDetails } from './PrinterDetails';
import { portDiscovery } from '../../../services/printer/printer';
import { Printers, Printer as IPrinter } from 'react-native-star-prnt';
import Modal from 'react-native-modal';
import { PrinterRow } from './PrinterRow';
import { styles } from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
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

  // const updatePrinter = async ({ macAddress, modelName, portName }: IPrinter) => {
  //   const savedPrinter = printers.find(p => p.macAddress === macAddress);
  //   await database.action(() =>
  //     savedPrinter.update(printerRecord => {
  //       printerRecord.macAddress = macAddress;
  //       printerRecord.name = modelName;
  //       printerRecord.address = portName;
  //     }),
  //   );
  // };

  const addPrinterGroup = async () => {
    await database.action(() =>
      database.collections.get<PrinterGroup>(tableNames.printerGroups).create(printerGroupRecord => {
        printerGroupRecord.name = '';
      }),
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
            {selectedPrinterGroup && <PrinterGroupDetails printerGroup={selectedPrinterGroup} onClose={onCancelHandler} />}
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
