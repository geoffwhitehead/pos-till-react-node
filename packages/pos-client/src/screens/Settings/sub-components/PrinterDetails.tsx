import React, { Fragment, useState } from 'react';
import withObservables from '@nozbe/with-observables';
import { Printer } from '../../../models';
import { Form, Label, H2, Input, Item, Button, Text, Col, Grid, Row, Picker, Icon, Content } from '../../../core';
import { styles } from './styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Emulations } from '../../../models/Printer';

interface PrinterDetailsOuterProps {
  onClose: () => void;
  printer: Printer;
}

const printerDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  type: Yup.string()
    .min(2, 'Too Short')
    .max(16, 'Too Long')
    .required('Required'),
  address: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  macAddress: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  printWidth: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  emulation: Yup.mixed()
    .oneOf(Object.values(Emulations))
    .required('Required'),
});

const PrinterDetailsInner: React.FC<PrinterDetailsOuterProps> = ({ printer, onClose }) => {
  const database = useDatabase();
  const { name, type, address, macAddress, emulation, printWidth } = printer;
  const [loading, setLoading] = useState(false);

  const update = async (v: any, printer: Printer) => {
    // TODO: type vaalues
    setLoading(true);

    await database.action(() =>
      printer.update(printerRecord => {
        printerRecord.macAddress = v.macAddress;
        printerRecord.name = v.name;
        printerRecord.address = v.address;
        printerRecord.printWidth = parseInt(v.printWidth);
        printerRecord.emulation = Emulations[v.emulation];
      }),
    );
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name,
    type,
    address,
    printWidth,
    emulation,
    macAddress,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={printerDetailsSchema}
      onSubmit={values => update(values, printer)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name, type, address, macAddress, printWidth, emulation } = values;
        const err = {
          name: !!(touched.name && errors.name),
          type: !!(touched.type && errors.type),
          address: !!(touched.address && errors.address),
          printWidth: !!(touched.printWidth && errors.printWidth),
          emulation: !!(touched.emulation && errors.emulation),
          macAddress: !!(touched.macAddress && errors.macAddress),
        };

        return (
          <Content style={styles.modal}>
            <Row>
              <H2 style={{ ...styles.heading, ...styles.indent }}>Printer details</H2>
            </Row>
            <Row>
              <Col>
                <Form style={styles.form}>
                  <Item stackedLabel error={err.name}>
                    <Label>Name</Label>
                    <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                  </Item>
                  <Item stackedLabel error={err.type}>
                    <Label>Type</Label>
                    <Input onChangeText={handleChange('type')} onBlur={handleBlur('type')} value={type} />
                  </Item>
                  <Item stackedLabel error={err.address}>
                    <Label>Address</Label>
                    <Input onChangeText={handleChange('address')} onBlur={handleBlur('vat')} value={address} />
                  </Item>
                </Form>
              </Col>
              <Col>
                <Form style={styles.form}>
                  <Item stackedLabel error={err.macAddress}>
                    <Label>MAC Address</Label>
                    <Input
                      onChangeText={handleChange('macAddress')}
                      onBlur={handleBlur('macAddress')}
                      value={macAddress}
                    />
                  </Item>
                  <Item stackedLabel error={err.printWidth}>
                    <Label>Print Width</Label>
                    <Input
                      onChangeText={handleChange('printWidth')}
                      onBlur={handleBlur('printWidth')}
                      value={printWidth.toString()}
                    />
                  </Item>
                  <Item picker stackedLabel>
                    <Label>Emulation</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select emulation"
                      placeholderStyle={{ color: '#bfc6ea' }}
                      placeholderIconColor="#007aff"
                      selectedValue={emulation}
                      onValueChange={handleChange('emulation')}
                    >
                      {Object.keys(Emulations).map(emulation => (
                        <Picker.Item key={emulation} label={emulation} value={emulation} />
                      ))}
                    </Picker>
                  </Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Button style={styles.indent} onPress={handleSubmit}>
                <Text>Save</Text>
              </Button>
            </Row>
          </Content>
        );
      }}
    </Formik>
  );
};

const enhance = withObservables(['printer'], ({ printer }) => ({
  printer,
}));

export const PrinterDetails = enhance(PrinterDetailsInner);
