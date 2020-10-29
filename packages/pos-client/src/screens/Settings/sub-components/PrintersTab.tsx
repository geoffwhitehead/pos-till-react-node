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
  Spinner,
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, Printer } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../../components/Loading/Loading';
import { capitalize } from 'lodash';
import { PrinterDetails } from './PrinterDetails';
import { portDiscovery } from '../../../services/printer/printer';
import { Printers, Printer as PrinterProps } from 'react-native-star-prnt';
import Modal from 'react-native-modal';
import { PrinterRow } from './PrinterRow';
import { Emulations } from '../../../models/Printer';
import { ModalContentButton } from '../../../components/Modal/ModalContentButton';

interface PrintersTabOuterProps {
  database: Database;
}

interface PrintersTabInnerProps {
  printers: Printer[];
}

const PrintersTabInner: React.FC<PrintersTabOuterProps & PrintersTabInnerProps> = ({ printers, database }) => {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer>();
  const [discoveredPrinters, setDiscoveredPrinters] = useState<Printers>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onCancelHandler = () => {
    setSelectedPrinter(null);
  };

  const updatePrinter = async ({ macAddress, modelName, portName }: PrinterProps) => {
    const savedPrinter = printers.find(p => p.macAddress === macAddress);
    await database.action(() =>
      savedPrinter.update(printerRecord => {
        printerRecord.macAddress = macAddress;
        printerRecord.name = modelName;
        printerRecord.address = portName;
      }),
    );
  };

  const addPrinter = async (printer: PrinterProps) => {
    const { macAddress, modelName, portName } = printer;
    await database.action(async () => {
      const collection = database.collections.get<Printer>(tableNames.printers);
      const p = await collection.create(printerRecord => {
        Object.assign(printerRecord, {
          macAddress: macAddress,
          name: modelName,
          address: portName,
        });
      });
    });
  };

  const discoverPrinters = async () => {
    setIsLoading(true);
    const printers = await portDiscovery();
    if (printers) {
      setDiscoveredPrinters(printers);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <Content>
        <Grid>
          <Row>
            <Col>
              <List>
                <ListItem itemDivider>
                  <Text>Installed Printers</Text>
                </ListItem>
                {printers.map(p => (
                  <PrinterRow isSelected={p === selectedPrinter} printer={p} onSelect={setSelectedPrinter} />
                ))}
              </List>
            </Col>
          </Row>
          <Row>
            <Col>
              <List>
                <ListItem itemDivider>
                  <Left>
                    <Text>Discover Printers</Text>
                  </Left>
                  <Right>
                    <Button small disabled={isLoading} onPress={() => discoverPrinters()}>
                      <Text>Discover Printers</Text>
                    </Button>
                  </Right>
                </ListItem>
                {isLoading ? (
                  <Spinner />
                ) : discoveredPrinters.length === 0 ? (
                  <Text style={{ padding: 10 }}> No printers found</Text>
                ) : (
                  discoveredPrinters.map(discoveredPrinter => {
                    const isInstalled = printers.find(printer => printer.macAddress === discoveredPrinter.macAddress);

                    return (
                      <ListItem key={discoveredPrinter.macAddress}>
                        <Left>
                          <Text>{discoveredPrinter.modelName}</Text>
                        </Left>
                        <Body>
                          <Text note>{capitalize(discoveredPrinter.portName)}</Text>
                          <Text note>{discoveredPrinter.macAddress}</Text>
                        </Body>
                        <Right>
                          {isInstalled ? (
                            <Button small onPress={() => updatePrinter(discoveredPrinter)}>
                              <Text>Update</Text>
                            </Button>
                          ) : (
                            <Button small onPress={() => addPrinter(discoveredPrinter)}>
                              <Text>Add</Text>
                            </Button>
                          )}
                        </Right>
                      </ListItem>
                    );
                  })
                )}
              </List>
            </Col>
          </Row>

          <Modal
            propagateSwipe
            isVisible={!!selectedPrinter}
            onBackButtonPress={onCancelHandler}
            onBackdropPress={onCancelHandler}
            animationInTiming={50}
            animationOutTiming={50}
            hideModalContentWhileAnimating={true}
            backdropTransitionInTiming={50}
            backdropTransitionOutTiming={50}
            style={{ width: 600 }}
          >
            {selectedPrinter && <PrinterDetails printer={selectedPrinter} onClose={onCancelHandler} />}
          </Modal>
        </Grid>
      </Content>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<PrintersTabOuterProps, PrintersTabInnerProps>([], ({ database }) => ({
      printers: database.collections.get<Printer>(tableNames.printers).query(),
    }))(c),
  );

export const PrintersTab = enhance(PrintersTabInner);
