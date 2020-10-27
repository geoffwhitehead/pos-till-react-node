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
} from '../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, Printer, PriceGroup } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { H1, H2, ActionSheet } from 'native-base';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Loading } from '../../../components/Loading/Loading';
import { styles } from './styles';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { AuthContext } from '../../../contexts/AuthContext';
import { sync } from '../../../services/sync';
import { clockRunning } from 'react-native-reanimated';

interface SettingsTabOuterProps {
  database: Database;
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

interface SettingsTabInnerProps {
  printers: any[];
  priceGroups: any[];
}
const SettingsTabInner: React.FC<SettingsTabOuterProps & SettingsTabInnerProps> = ({ printers, priceGroups }) => {
  const { organization } = useContext(OrganizationContext);
  const [loading, setLoading] = useState(false);
  const database = useDatabase();
  const { signOut, unlink } = useContext(AuthContext);

  const initialValues = {
    defaultPriceGroupId: organization.defaultPriceGroupId,
    receiptPrinterId: organization.receiptPrinterId,
    currency: organization.currency,
    maxBills: organization.maxBills,
  };

  const updateOrganization = async values => {
    console.log('values', values);
    setLoading(true);
    const priceGroup = priceGroups.find(pG => pG.id === values.defaultPriceGroupId);
    const receiptPrinter = printers.find(p => p.id === values.receiptPrinterId);
    if (!priceGroup || !receiptPrinter) {
      console.error('Failed to update organization');
    }
    await database.action(() =>
      organization.update(org => {
        org.defaultPriceGroup.set(priceGroup);
        org.receiptPrinter.set(receiptPrinter);
        org.currency = values.currency;
        org.maxBills = parseInt(values.maxBills);
      }),
    );

    await sync(database);

    setLoading(false);
  };

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

  if (!printers) {
    return <Loading />;
  }

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

          return (
            <Content style={styles.container}>
              <Grid>
                <Col style={styles.column}>
                  <H1 style={styles.heading}>Settings</H1>
                </Col>
                <Row>
                  <Col style={styles.column}>
                    <Form>
                      <Item picker stackedLabel>
                        <Label>Receipt Printer</Label>
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
                        <Label>Default Price Group</Label>
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
                    </Form>
                  </Col>
                  <Col style={styles.column}>
                    <Form>
                      <Item stackedLabel error={err.maxBills}>
                        <Label>Max open bills</Label>
                        <Input
                          onChangeText={handleChange('maxBills')}
                          onBlur={handleBlur('maxBills')}
                          value={maxBills.toString()}
                        />
                      </Item>
                      <Item stackedLabel error={err.currency}>
                        <Label>Currency</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          placeholder="Select currency"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          selectedValue={currency}
                          onValueChange={handleChange('currency')}
                        >
                          {currencies.map(currency => (
                            <Picker.Item key={currency.id} label={currency.name} value={currency.id} />
                          ))}
                        </Picker>
                      </Item>
                    </Form>
                  </Col>
                </Row>
                <Row style={styles.row}>
                  <Button disabled={loading} onPress={handleSubmit}>
                    <Text>Save</Text>
                  </Button>
                </Row>
                <Row style={styles.row}>
                  <Button style={styles.button} onPress={() => areYouSure(signOut)}>
                    <Text>Sign out</Text>
                  </Button>
                </Row>
                <Row style={styles.row}>
                  <Button danger style={styles.button} onPress={() => areYouSure(unlink)}>
                    <Text>Delete account</Text>
                  </Button>
                </Row>
              </Grid>
            </Content>
          );
        }}
      </Formik>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<SettingsTabOuterProps, SettingsTabInnerProps>([], ({ database }) => ({
      printers: database.collections.get<Printer>(tableNames.printers).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const SettingsTab = enhance(SettingsTabInner);
