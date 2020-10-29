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
  ActionSheet,
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, Printer } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../../components/Loading/Loading';
import { capitalize } from 'lodash';
import { PrinterDetails } from './PrinterDetails';
import { portDiscovery } from '../../../services/printer/printer';
import { Printers, Printer as StarPrinterProps } from 'react-native-star-prnt';
import Modal from 'react-native-modal';
import { PrinterRow } from './PrinterRow';
import { Emulations, PrinterProps } from '../../../models/Printer';
import { ModalContentButton } from '../../../components/Modal/ModalContentButton';

interface PrintersTabOuterProps {
  database: Database;
}

interface PrintersTabInnerProps {
  printers: Printer[];
}

const PrintersTabInner: React.FC<PrintersTabOuterProps & PrintersTabInnerProps> = ({ printers, database }) => {
  const [selectedPrinter, setSelectedPrinter] = useState<Partial<Printer>>();
  const [discoveredPrinters, setDiscoveredPrinters] = useState<Printers>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onCancelHandler = () => {
    setSelectedPrinter(null);
  };

  const updatePrinter = async ({ macAddress, modelName, portName }: StarPrinterProps) => {
    const savedPrinter = printers.find(p => p.macAddress === macAddress);
    await database.action(() =>
      savedPrinter.update(printerRecord => {
        printerRecord.macAddress = macAddress;
        printerRecord.name = modelName;
        printerRecord.address = portName;
      }),
    );
  };

  const addPrinter = async (printer: StarPrinterProps) => {
    const { macAddress, modelName, portName } = printer;
    const selectedPrinterDetails = {
      macAddress: macAddress,
      name: modelName,
      address: portName,
    };
    setSelectedPrinter(selectedPrinterDetails);
    // await database.action(async () => {
    //   const collection = database.collections.get<Printer>(tableNames.printers);
    //   await collection.create(printerRecord => {
    //     Object.assign(printerRecord, {
    //       macAddress: macAddress,
    //       name: modelName,
    //       address: portName,
    //     });
    //   });
    // });
  };

  const onSave = async (values: PrinterProps) => {
    // TODO: type vaalues
    setIsSaving(true);

    console.log('SAVING', values);
    if (selectedPrinter.id) {
      await database.action(() =>
        selectedPrinter.update(printerRecord => {
          printerRecord.macAddress = values.macAddress;
          printerRecord.name = values.name;
          printerRecord.address = values.address;
          printerRecord.printWidth = parseInt(values.printWidth);
          printerRecord.emulation = Emulations[values.emulation];
        }),
      );
    } else {
      await database.action(async () => {
        const collection = database.collections.get<Printer>(tableNames.printers);
        await collection.create(printerRecord => {
          Object.assign(printerRecord, {
            macAddress: values.macAddress,
            name: values.name,
            address: values.address,
            printWidth: parseInt(values.printWidth),
            emulation: Emulations[values.emulation],
          });
        });
      });
    }
    setIsSaving(false);
    onCancelHandler();
  };

  const onDelete = async (printer: Printer) => {
    await printer.removeWithChildrenSync();
  };

  const areYouSure = (fn, p: Printer) => {
    const options = ['Yes', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length,
        title:
          'This will permanently remove this printer and remove it from all printer groups you have defined. Are you sure?',
      },
      index => {
        index === 0 && fn(p);
      },
    );
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
      <Button small onPress={() => addPrinter({ modelName: 'test', macAddress: 'mac', portName: 'port' })}>
        <Text>Add</Text>
      </Button>
      <Content>
        <Grid>
          <Row>
            <Col>
              <List>
                <ListItem itemDivider>
                  <Text>Installed Printers</Text>
                </ListItem>
                {printers.map(p => (
                  <PrinterRow
                    key={p.id}
                    isSelected={p === selectedPrinter}
                    printer={p}
                    onSelect={setSelectedPrinter}
                    onDelete={() => areYouSure(onDelete, p)}
                  />
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
            {selectedPrinter && (
              <PrinterDetails
                printer={selectedPrinter}
                onSave={onSave}
                onClose={onCancelHandler}
                isLoading={isSaving}
              />
            )}
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
