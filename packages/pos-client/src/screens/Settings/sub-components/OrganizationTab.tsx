import React, { useContext, useState } from 'react';
import { Container, Content, Form, Item, Label, Input, Text, Grid, Col, Row, Button, H2 } from '../../../core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { commonStyles } from './styles';
import { HeaderButtonBar } from '../../../components/HeaderButtonBar/HeaderButtonBar';

interface OrganizationTabProps {}

const organizationTabSchema = Yup.object().shape({
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
});

export const OrganizationTab: React.FC<OrganizationTabProps> = () => {
  const { organization } = useContext(OrganizationContext);
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

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
  };

  const updateOrganization = async values => {
    setLoading(true);
    await database.action(() =>
      organization.update(org => {
        org.name = values.name;
        org.phone = values.phone;
        org.vat = values.vat;
        org.addressLine1 = values.addressLine1;
        org.addressLine2 = values.addressLine2;
        org.addressCity = values.addressCity;
        org.addressCounty = values.addressCounty;
        org.addressPostcode = values.addressPostcode;
      }),
    );
    setLoading(false);
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={organizationTabSchema}
        onSubmit={values => updateOrganization(values)}
      >
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
          } = values;
          const err = {
            name: !!(touched.name && errors.name),
            phone: !!(touched.phone && errors.phone),
            vat: !!(touched.vat && errors.vat),
            addressLine1: !!(touched.addressLine1 && errors.addressLine1),
            addressLine2: !!(touched.addressLine2 && errors.addressLine2),
            addressCity: !!(touched.addressCity && errors.addressCity),
            addressCounty: !!(touched.addressCounty && errors.addressCounty),
            addressPostcode: !!(touched.addressPostcode && errors.addressPostcode),
          };

          return (
            <>
              <HeaderButtonBar onPressPrimary={handleSubmit} primaryText="Save Changes"></HeaderButtonBar>

              <Content style={commonStyles.content}>
                <Form>
                  <Text style={commonStyles.text} note>
                    * This information will also be printed on receipt and report headers
                  </Text>
                  <Text style={commonStyles.text} note>
                    General company details.
                  </Text>
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
                  {/* <H2 style={styles.heading}>Address</H2> */}
                  <Text style={commonStyles.text} note>
                    Address
                  </Text>
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
              </Content>
            </>
          );
        }}
      </Formik>
    </Container>
  );
};
