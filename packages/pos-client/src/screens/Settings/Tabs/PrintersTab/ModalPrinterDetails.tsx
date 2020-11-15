import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React from 'react';
import { ScrollView } from 'react-native';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Form, Icon, Input, Item, Label, Picker } from '../../../../core';
import { Printer } from '../../../../models';
import { Emulations, PrinterProps } from '../../../../models/Printer';

interface ModalPrinterDetailsOuterProps {
  onClose: () => void;
  printer: Partial<Printer>;
  onSave: (values: PrinterProps) => void;
  isLoading: boolean;
}

const printerDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
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

export const ModalPrinterDetails: React.FC<ModalPrinterDetailsOuterProps> = ({
  printer,
  onClose,
  onSave,
  isLoading,
}) => {
  const { name, address, macAddress, emulation, printWidth } = printer;

  const initialValues = {
    name: name || '',
    address: address || '',
    printWidth: printWidth || 80,
    emulation,
    macAddress: macAddress || '',
  };

  return (
    <Formik initialValues={initialValues} validationSchema={printerDetailsSchema} onSubmit={onSave}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name, address, macAddress, printWidth, emulation } = values;
        const err = {
          name: !!(touched.name && errors.name),
          address: !!(touched.address && errors.address),
          printWidth: !!(touched.printWidth && errors.printWidth),
          emulation: !!(touched.emulation && errors.emulation),
          macAddress: !!(touched.macAddress && errors.macAddress),
        };

        const title = printer ? `${capitalize(printer.name)}` : 'New Printer';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            isPrimaryDisabled={isLoading}
            size="small"
          >
            <ScrollView>
              <Form>
                <Item stackedLabel error={err.name}>
                  <Label>Name</Label>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </Item>
                <Item stackedLabel error={err.address}>
                  <Label>Address</Label>
                  <Input onChangeText={handleChange('address')} onBlur={handleBlur('vat')} value={address} />
                </Item>
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
            </ScrollView>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
