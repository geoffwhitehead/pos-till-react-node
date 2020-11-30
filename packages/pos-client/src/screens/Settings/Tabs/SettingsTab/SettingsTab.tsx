import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { HeaderButtonBar } from '../../../../components/HeaderButtonBar/HeaderButtonBar';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { Loading } from '../../../../components/Loading/Loading';
import { AuthContext } from '../../../../contexts/AuthContext';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import { Button, Container, Content, Footer, Form, Grid, Icon, Input, Picker, Text, View } from '../../../../core';
import { Bill, BillPeriod, PriceGroup, Printer, tableNames } from '../../../../models';
import { areYouSure } from '../../../../utils/helpers';
import { moderateScale } from '../../../../utils/scaling';
import { commonStyles } from '../styles';

interface SettingsTabOuterProps {
  database: Database;
  billPeriod: BillPeriod;
}

interface SettingsTabInnerProps {
  printers: Printer[];
  priceGroups: PriceGroup[];
  openBills: Bill[];
}

const settingsSchema = Yup.object().shape({
  defaultPriceGroupId: Yup.string()
    .min(1, 'Too Short')
    .max(40, 'Too Long')
    .required('Required'),
  receiptPrinterId: Yup.string()
    .min(1, 'Too Short')
    .max(40, 'Too Long')
    .required('Required'),
  currency: Yup.string().required('Required'),
  maxBills: Yup.number()
    .min(1, 'Too Low')
    .max(100, 'Too High')
    .required('Required'),
});

const currencies = [
  {
    id: 'gbp',
    name: 'GBP',
  },
  {
    id: 'eur',
    name: 'EUR',
  },
];

const SettingsTabInner: React.FC<SettingsTabOuterProps & SettingsTabInnerProps> = ({
  printers,
  openBills,
  priceGroups,
}) => {
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { setReceiptPrinter } = useContext(ReceiptPrinterContext);
  const [loading, setLoading] = useState(false);
  const database = useDatabase();
  const { signOut, unlink } = useContext(AuthContext);

  if (!printers || !openBills) {
    return <Loading />;
  }

  const initialValues = {
    defaultPriceGroupId: organization.defaultPriceGroupId,
    receiptPrinterId: organization.receiptPrinterId,
    currency: organization.currency,
    maxBills: organization.maxBills,
  };

  const updateOrganization = async values => {
    setLoading(true);
    const priceGroup = priceGroups.find(pG => pG.id === values.defaultPriceGroupId);
    const receiptPrinter = printers.find(p => p.id === values.receiptPrinterId);
    if (!priceGroup || !receiptPrinter) {
      console.error('Failed to update organization');
    }

    setReceiptPrinter(receiptPrinter);

    await database.action(() =>
      organization.update(org => {
        org.defaultPriceGroup.set(priceGroup);
        org.receiptPrinter.set(receiptPrinter);
        org.currency = values.currency;
        org.maxBills = parseInt(values.maxBills);
      }),
    );

    setLoading(false);
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={settingsSchema}
        onSubmit={values => updateOrganization(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
          const { defaultPriceGroupId, receiptPrinterId, currency, maxBills } = values;

          const hasOpenBills = openBills.length > 0;

          return (
            <Container>
              <HeaderButtonBar onPressPrimary={handleSubmit} primaryText="Save Changes"></HeaderButtonBar>
              <Content style={commonStyles.content}>
                <Grid>
                  <Form>
                    <ItemField
                      picker
                      label="Receipt Printer"
                      touched={touched.receiptPrinterId}
                      name="receiptPrinterId"
                      errors={errors.receiptPrinterId}
                    >
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select receipt printer"
                        placeholderStyle={{ color: '#bfc6ea' }}
                        placeholderIconColor="#007aff"
                        selectedValue={receiptPrinterId}
                        onValueChange={handleChange('receiptPrinterId')}
                      >
                        {printers.map(printer => (
                          <Picker.Item key={printer.id} label={printer.name} value={printer.id} />
                        ))}
                      </Picker>
                    </ItemField>

                    <ItemField
                      picker
                      label="Default Price Group"
                      touched={touched.defaultPriceGroupId}
                      name="defaultPriceGroupId"
                      errors={errors.defaultPriceGroupId}
                    >
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select default price group"
                        placeholderStyle={{ color: '#bfc6ea' }}
                        placeholderIconColor="#007aff"
                        selectedValue={defaultPriceGroupId}
                        onValueChange={handleChange('defaultPriceGroupId')}
                      >
                        {priceGroups.map(priceGroup => (
                          <Picker.Item key={priceGroup.id} label={priceGroup.name} value={priceGroup.id} />
                        ))}
                      </Picker>
                    </ItemField>

                    <View style={styles.noEditFields}>
                      <Text style={{ color: 'grey', paddingBottom: 10 }}>
                        Note: Can only be changed when there are no active bills
                      </Text>

                      <ItemField
                        label="Max open bills"
                        touched={touched.maxBills}
                        name="maxBills"
                        errors={errors.maxBills}
                        disabled={hasOpenBills}
                      >
                        <Input
                          onChangeText={handleChange('maxBills')}
                          onBlur={handleBlur('maxBills')}
                          value={maxBills.toString()}
                          disabled={hasOpenBills}
                        />
                      </ItemField>

                      <ItemField
                        picker
                        label="Currency"
                        touched={touched.currency}
                        name="currency"
                        errors={errors.currency}
                      >
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          placeholder="Select currency"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          selectedValue={currency}
                          onValueChange={handleChange('currency')}
                          enabled={!hasOpenBills}
                        >
                          {currencies.map(currency => (
                            <Picker.Item key={currency.id} label={currency.name} value={currency.id} />
                          ))}
                        </Picker>
                      </ItemField>
                    </View>
                  </Form>
                </Grid>
              </Content>
              <Footer>
                <View style={{ display: 'flex', flexDirection: 'row', padding: 5 }}>
                  <Button style={{ marginRight: 10 }} onPress={() => areYouSure(signOut)}>
                    <Text>Sign out</Text>
                  </Button>
                  <Button danger bordered onPress={() => areYouSure(unlink)}>
                    <Text>Delete local account</Text>
                  </Button>
                </View>
              </Footer>
            </Container>
          );
        }}
      </Formik>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<SettingsTabOuterProps, SettingsTabInnerProps>([], ({ database, billPeriod }) => ({
      billPeriod,
      openBills: billPeriod.openBills,
      printers: database.collections.get<Printer>(tableNames.printers).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const SettingsTab = enhance(SettingsTabInner);

const styles = StyleSheet.create({
  errorLabel: {
    color: 'red',
  },
  row: {
    padding: 5,
  },
  noEditFields: {
    marginLeft: moderateScale(15),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
    padding: moderateScale(10),
    paddingLeft: moderateScale(30),
    borderLeftWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgrey',
  },
});
