import React, { useContext } from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Text,
  Card,
  Body,
  CardItem,
  Grid,
  Col,
  Row,
  Picker,
  Icon,
} from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, PaymentType, Printer, Organization, PriceGroup } from '../../models';
import { Database } from '@nozbe/watermelondb';
import { Formik } from 'formik';
import { signUp } from '../../api/auth';
import * as Yup from 'yup';
import { Loading } from '../../components/Loading/Loading';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { H1 } from 'native-base';

interface SettingsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Settings'>;
  database: Database;
}

const SettingsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  phone: Yup.string()
    .min(2, 'Too Short')
    .max(16, 'Too Long')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  addressLine1: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  addressLine2: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long'),
  addressCity: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  addressCounty: Yup.string()
    .min(1, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  addressPostcode: Yup.string()
    .min(1, 'Too Short')
    .max(10, 'Too Long')
    .required('Required'),
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

interface SettingsInnerProps {
  printers: any[];
  priceGroups: any[];
}
const SettingsInner: React.FC<SettingsOuterProps & SettingsInnerProps> = ({ navigation, printers, priceGroups }) => {
  const { organization } = useContext(OrganizationContext);

  const initialValues = {
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    vat: organization.vat,
    addressLine1: organization.addressLine1,
    addressLine2: organization.addressLine2,
    addressCity: organization.addressCity,
    addressCounty: organization.addressCounty,
    addressPostcode: organization.addressPostcode,
    defaultPriceGroupId: organization.defaultPriceGroupId,
    receiptPrinterId: organization.receiptPrinterId,
    currency: organization.currency,
    maxBills: organization.maxBills,
  };

  const update = (values: any) => {};

  console.log('printers', printers);
  if (!printers) {
    return <Loading />;
  }
  return (
    <Container>
      <SidebarHeader title="Settings" onOpen={() => navigation.openDrawer()} />
      <Formik initialValues={initialValues} validationSchema={SettingsSchema} onSubmit={values => update(values)}>
        {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
          const {
            name,
            email,
            phone,
            vat,
            addressLine1,
            addressLine2,
            addressCity,
            addressCounty,
            addressPostcode,
            defaultPriceGroupId,
            receiptPrinterId,
            currency,
            maxBills,
          } = values;
          const err = {
            name: !!(touched.name && errors.name),
            email: !!(touched.email && errors.email),
            phone: !!(touched.phone && errors.phone),
            vat: !!(touched.vat && errors.vat),
            addressLine1: !!(touched.addressLine1 && errors.addressLine1),
            addressLine2: !!(touched.addressLine2 && errors.addressLine2),
            addressCity: !!(touched.addressCity && errors.addressCity),
            addressCounty: !!(touched.addressCounty && errors.addressCounty),
            addressPostcode: !!(touched.addressPostcode && errors.addressPostcode),
            defaultPriceGroupId: !!(touched.defaultPriceGroupId && errors.defaultPriceGroupId),
            receiptPrinterId: !!(touched.receiptPrinterId && errors.receiptPrinterId),
            currency: !!(touched.currency && errors.currency),
            maxBills: !!(touched.maxBills && errors.maxBills),
          };

          const styles = {
              h1: {
                  margin: 10,
                  marginTop: 30
              }
          }
          return (
            <Content>
              <Grid>
                <Row>
                  <Col>
                    <Form style={{ width: 300 }}>
                    <H1 style={styles.h1}>Organization</H1>
                      <Item stackedLabel error={err.name}>
                        <Label>Name</Label>
                        <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                      </Item>
                      <Item stackedLabel>
                        <Label>Email</Label>
                        <Label>{email}</Label>
                      </Item>
                      <Item stackedLabel error={err.phone}>
                        <Label>Phone</Label>
                        <Input onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} value={phone} />
                      </Item>
                      <Item stackedLabel error={err.vat}>
                        <Label>VAT</Label>
                        <Input onChangeText={handleChange('vat')} onBlur={handleBlur('vat')} value={vat} />
                      </Item>
                    </Form>
                  </Col>
                  <Col>
                    <Form style={{ width: 300 }}>
                    <H1 style={styles.h1}>Address</H1>

                      <Item stackedLabel error={err.addressLine1}>
                        <Label>Line 1</Label>
                        <Input
                          onChangeText={handleChange('addressLine1')}
                          onBlur={handleBlur('addressLine1')}
                          value={addressLine1}
                        />
                      </Item>
                      <Item stackedLabel error={err.addressLine2}>
                        <Label>Line 2</Label>
                        <Input
                          onChangeText={handleChange('addressLine2')}
                          onBlur={handleBlur('addressLine2')}
                          value={addressLine2}
                        />
                      </Item>
                      <Item stackedLabel error={err.addressCity}>
                        <Label>City</Label>
                        <Input
                          onChangeText={handleChange('addressCity')}
                          onBlur={handleBlur('addressCity')}
                          value={addressCity}
                        />
                      </Item>
                      <Item stackedLabel error={err.addressCounty}>
                        <Label>County</Label>
                        <Input
                          onChangeText={handleChange('addressCounty')}
                          onBlur={handleBlur('addressCounty')}
                          value={addressCounty}
                        />
                      </Item>
                      <Item stackedLabel error={err.addressPostcode}>
                        <Label>Postcode</Label>
                        <Input
                          onChangeText={handleChange('addressPostcode')}
                          onBlur={handleBlur('addressPostcode')}
                          value={addressPostcode}
                        />
                      </Item>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form style={{ width: 300 }}>
                    <H1 style={styles.h1}>Settings</H1>

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
                  <Col>
                  <Form style={{ width: 300 }}>
                      <H1/>
                  <Item stackedLabel error={err.currency}>
                        <Label>Currency Symbol</Label>
                        <Input
                          onChangeText={handleChange('currency')}
                          onBlur={handleBlur('currency')}
                          value={currency}
                        />
                      </Item>
                      <Item stackedLabel error={err.maxBills}>
                        <Label>Bills Range</Label>
                        <Input
                          onChangeText={handleChange('maxBills')}
                          onBlur={handleBlur('maxBills')}
                          value={maxBills.toString()}
                        />
                      </Item>
                  </Form>
                  </Col>
                </Row>
              </Grid>

              {/* <Item stackedLabel error={err.name}>
                        <Label>Name</Label>
                        <Input
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          value={firstName}
                        />
                      </Item> */}
            </Content>
          );
        }}
      </Formik>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<SettingsOuterProps, SettingsInnerProps>([], ({ database }) => ({
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      printers: database.collections.get<Printer>(tableNames.printers).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const Settings = enhance(SettingsInner);
