import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React from 'react';
import { ScrollView } from 'react-native';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Body, CheckBox, Form, Icon, Input, ListItem, Picker, Text } from '../../../../core';
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
  receivesBillCalls: Yup.boolean(),
});

export const ModalPrinterDetails: React.FC<ModalPrinterDetailsOuterProps> = ({
  printer,
  onClose,
  onSave,
  isLoading,
}) => {
  const { name, address, macAddress, emulation, printWidth, receivesBillCalls } = printer;

  const initialValues = {
    name: name || '',
    address: address || '',
    printWidth: printWidth || 80,
    emulation,
    macAddress: macAddress || '',
    receivesBillCalls: receivesBillCalls || false,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={printerDetailsSchema} onSubmit={onSave}>
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { name, address, macAddress, printWidth, emulation, receivesBillCalls } = values;

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
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>
                <ItemField label="Address" touched={touched.address} name="address" errors={errors.address}>
                  <Input onChangeText={handleChange('address')} onBlur={handleBlur('address')} value={address} />
                </ItemField>
                <ItemField
                  label="MAC Address"
                  touched={touched.macAddress}
                  name="macAddress"
                  errors={errors.macAddress}
                >
                  <Input
                    onChangeText={handleChange('macAddress')}
                    onBlur={handleBlur('macAddress')}
                    value={macAddress}
                  />
                </ItemField>
                <ItemField
                  label="Print Width"
                  touched={touched.printWidth}
                  name="printWidth"
                  errors={errors.printWidth}
                >
                  <Input
                    onChangeText={handleChange('printWidth')}
                    onBlur={handleBlur('printWidth')}
                    value={printWidth.toString()}
                  />
                </ItemField>

                <ItemField
                  picker
                  label="Emulation"
                  touched={touched.emulation}
                  name="emulation"
                  errors={errors.emulation}
                  style={{
                    alignItems: 'flex-start',
                  }}
                >
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="chevron-down-outline" />}
                    placeholder="Select emulation"
                    selectedValue={emulation}
                    onValueChange={handleChange('emulation')}
                  >
                    {Object.keys(Emulations).map(emulation => (
                      <Picker.Item key={emulation} label={emulation} value={emulation} />
                    ))}
                  </Picker>
                </ItemField>

                <ListItem>
                  <CheckBox
                    checked={receivesBillCalls}
                    onPress={() => setFieldValue('receivesBillCalls', !receivesBillCalls)}
                    onBlur={handleBlur('isPrepTimeRequired')}
                  />
                  <Body>
                    <Text>Will this printer receive bill calls?</Text>
                  </Body>
                </ListItem>
              </Form>
            </ScrollView>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
