import React, { useContext, useState } from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Text,
  Grid,
  Col,
  Row,
  Picker,
  Icon,
  Button,
  View,
  ActionSheet,
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, Printer, PriceGroup, BillPeriod, Bill } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Loading } from '../../../components/Loading/Loading';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { AuthContext } from '../../../contexts/AuthContext';
import { sync } from '../../../services/sync';
import { ReceiptPrinterContext } from '../../../contexts/ReceiptPrinterContext';
import { HeaderButtonBar } from '../../../components/HeaderButtonBar/HeaderButtonBar';

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

const areYouSure = fn => {
  const options = ['Yes', 'Cancel'];
  ActionSheet.show(
    {
      options,
      cancelButtonIndex: options.length - 1,
      title: 'Are you sure?',
    },
    index => {
      index === 0 && fn();
    },
  );
};

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

    // debug remove
    await sync(database);
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
          const err = {
            defaultPriceGroupId: !!(touched.defaultPriceGroupId && errors.defaultPriceGroupId),
            receiptPrinterId: !!(touched.receiptPrinterId && errors.receiptPrinterId),
            currency: !!(touched.currency && errors.currency),
            maxBills: !!(touched.maxBills && errors.maxBills),
          };

          const hasOpenBills = openBills.length > 0;

          return (
            <>
              <HeaderButtonBar onPressPrimary={handleSubmit} primaryText="Save Changes"></HeaderButtonBar>
              <Content style={styles.content}>
                <Grid>
                  <Form>
                    <Item picker stackedLabel>
                      <Label style={err.receiptPrinterId ? styles.errorLabel : {}}>Receipt Printer</Label>
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
                    </Item>
                    <Item picker stackedLabel>
                      <Label style={err.defaultPriceGroupId ? styles.errorLabel : {}}>Default Price Group</Label>
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
                    </Item>
                    <View
                      style={{
                        marginLeft: 15,
                        marginTop: 20,
                        marginBottom: 20,
                        padding: 10,
                        paddingLeft: 30,
                        borderLeftWidth: 1,
                        borderRadius: 5,
                        borderColor: 'lightgrey',
                      }}
                    >
                      <Text style={{ color: 'grey', paddingBottom: 10 }}>
                        Note: Can only be changed when there are no active bills
                      </Text>

                      <Item disabled={hasOpenBills} stackedLabel error={err.maxBills}>
                        <Label>Max open bills</Label>
                        <Input
                          onChangeText={handleChange('maxBills')}
                          onBlur={handleBlur('maxBills')}
                          value={maxBills.toString()}
                          disabled={hasOpenBills}
                        />
                      </Item>
                      <Item picker stackedLabel error={err.currency}>
                        <Label>Currency</Label>
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
                      </Item>
                    </View>
                  </Form>
                  <Row style={styles.row}>
                    <Button bordered onPress={() => areYouSure(signOut)}>
                      <Text>Sign out</Text>
                    </Button>
                  </Row>
                  <Row style={styles.row}>
                    <Button danger bordered onPress={() => areYouSure(unlink)}>
                      <Text>Delete account</Text>
                    </Button>
                  </Row>
                </Grid>
              </Content>
            </>
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

const styles = {
  errorLabel: {
    color: 'red',
  },
  row: {
    padding: 5,
  },
  content: { padding: 15, width: 500 },
};
