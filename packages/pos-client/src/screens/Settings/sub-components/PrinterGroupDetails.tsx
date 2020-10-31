import React, { useState, useEffect } from 'react';
import withObservables from '@nozbe/with-observables';
import { PrinterGroup, PrinterGroupPrinter, tableNames } from '../../../models';
import { Form, Label, H2, Input, Item, Button, Text, Col, Row, Content, List, ListItem } from '../../../core';
import { styles } from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Printer } from '../../../models/Printer';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Database } from '@nozbe/watermelondb';
import { PrinterRowChoice } from './PrinterRowChoice';
import { Loading } from '../../../components/Loading/Loading';
import { ModalContentButton } from '../../../components/Modal/ModalContentButton';

interface PrinterGroupDetailsOuterProps {
  onClose: () => void;
  printerGroup?: PrinterGroup;
  database: Database;
}

interface PrinterGroupDetailsInnerProps {
  printers: Printer[];
  assignedPrinters?: Printer[];
}

const printerGroupDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
});

type FormValues = {
  name: string;
};

const PrinterGroupDetailsInner: React.FC<PrinterGroupDetailsOuterProps & PrinterGroupDetailsInnerProps> = ({
  printerGroup,
  onClose,
  assignedPrinters,
  printers,
  database,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPrinters, setSelectedPrinters] = useState<Printer[]>([]);

  const update = async (values: FormValues, printerGroup: PrinterGroup) => {
    setLoading(true);
    if (printerGroup) {
      await printerGroup.updateGroup({ ...values, printers: selectedPrinters });
    } else {
      const printerGroupRefsCollection = database.collections.get<PrinterGroupPrinter>(
        tableNames.printerGroupsPrinters,
      );
      const printerGroupCollection = database.collections.get<PrinterGroup>(tableNames.printerGroups);

      const pGToCreate = printerGroupCollection.prepareCreate(printerGroupRecord => {
        printerGroupRecord.name = values.name;
      });

      const pGRefsToCreate = selectedPrinters.map(printer =>
        printerGroupRefsCollection.prepareCreate(refRecord => {
          refRecord.printerGroup.set(pGToCreate);
          refRecord.printer.set(printer);
        }),
      );

      const toCreate = [pGToCreate, ...pGRefsToCreate];

      await database.action(async () => await database.batch(...toCreate));
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: printerGroup?.name || '',
  };

  if (!printers || (printerGroup && !assignedPrinters)) {
    return <Loading />;
  }

  useEffect(() => {
    assignedPrinters && setSelectedPrinters(assignedPrinters);
  }, [assignedPrinters]);

  const togglePrinter = (printer: Printer) => {
    const alreadyAssigned = selectedPrinters.includes(printer);
    if (alreadyAssigned) {
      setSelectedPrinters(selectedPrinters.filter(sP => sP !== printer));
    } else {
      setSelectedPrinters([...selectedPrinters, printer]);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={printerGroupDetailsSchema}
      onSubmit={values => update(values, printerGroup)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name } = values;
        const err = {
          name: !!(touched.name && errors.name),
        };

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title="Printer Group Details"
            isPrimaryDisabled={loading}
          >
            <Content>
              <Row>
                <Col>
                  <Form style={styles.form}>
                    <Item stackedLabel error={err.name}>
                      <Label>Name</Label>
                      <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                    </Item>
                  </Form>
                </Col>
                <Col />
              </Row>
              <Row>
                <Col style={s.pl}>
                  <List>
                    <ListItem itemDivider>
                      <Text>Assigned</Text>
                    </ListItem>
                    {selectedPrinters.map(p => (
                      <PrinterRowChoice arrowDir="right" printer={p} onSelect={() => togglePrinter(p)} />
                    ))}
                  </List>
                </Col>
                <Col style={s.pr}>
                  <List>
                    <ListItem itemDivider>
                      <Text>Available</Text>
                    </ListItem>
                    {printers
                      .filter(p => !selectedPrinters.includes(p))
                      .map(p => (
                        <PrinterRowChoice arrowDir="left" printer={p} onSelect={() => togglePrinter(p)} />
                      ))}
                  </List>
                </Col>
              </Row>
              <Row></Row>
            </Content>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<PrinterGroupDetailsOuterProps, PrinterGroupDetailsInnerProps>(
      ['printerGroup'],
      ({ printerGroup, database }) => {
        if (printerGroup) {
          return {
            printerGroup,
            printers: database.collections.get<Printer>(tableNames.printers).query(),
            assignedPrinters: printerGroup.printers,
          };
        }
        return {
          printers: database.collections.get<Printer>(tableNames.printers).query(),
        };
      },
    )(c),
  );

export const PrinterGroupDetails = enhance(PrinterGroupDetailsInner);

const s = {
  pl: {
    margin: 5,
    marginRight: 0,
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    // borderRadius: 2,
    // borderRight: 'none'
  },
  pr: {
    margin: 5,
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    // borderRadius: 2,
    // marginLeft: 0,
    // borderLeft: 'none'
  },
};
