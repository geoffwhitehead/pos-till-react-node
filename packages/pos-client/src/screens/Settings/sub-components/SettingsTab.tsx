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
import { H1 } from 'native-base';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Loading } from '../../../components/Loading/Loading';
import { styles } from './styles';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface SettingsTabOuterProps {
  database: Database;
}

const SettingsSchema = Yup.object().shape({
  defaultPriceGroupId: Yup.string()
    .min(1, 'Too Short')
    .max(40, 'Too Long')
    .required('Required'),
  receiptPrinterId: Yup.string()
    .min(1, 'Too Short')
    .max(40, 'Too Long')
    .required('Required'),
  currency: Yup.string()
    .min(1, 'Too Short')
    .max(2, 'Too Long')
    .required('Required'),
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

  console.log('printers', printers);
  if (!printers) {
    return <Loading />;
  }
  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={SettingsSchema}
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
            <Content>
              <Grid>
                <H1 style={{ ...styles.heading, ...styles.indent }}>Settings</H1>
                <Row>
                  <Col>
                    <Form style={styles.form}>
                      <Text style={styles.text} note>
                        Select a thermal printer used to print standard customer receipts.
                      </Text>
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
                      <Text style={styles.text} note>
                        Which price group will be activated by default when opening a new bill.
                      </Text>
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
                  <Col>
                    <Form style={styles.form}>
                      <Text style={styles.text} note>
                        This is the maximum number of simultaneous bills you can have open and the range of bill
                        references.
                      </Text>
                      <Item stackedLabel error={err.maxBills}>
                        <Label>Bills Range</Label>
                        <Input
                          onChangeText={handleChange('maxBills')}
                          onBlur={handleBlur('maxBills')}
                          value={maxBills.toString()}
                        />
                      </Item>
                      <Item stackedLabel error={err.currency}>
                        <Label>Currency Symbol</Label>
                        <Input
                          onChangeText={handleChange('currency')}
                          onBlur={handleBlur('currency')}
                          value={currency}
                        />
                      </Item>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Button style={styles.indent} disabled={loading} onPress={handleSubmit}>
                    <Text>Save</Text>
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
