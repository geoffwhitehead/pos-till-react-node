import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import * as Yup from 'yup';
import { HeaderButtonBar } from '../../../../components/HeaderButtonBar/HeaderButtonBar';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Container, Form, Input, Text } from '../../../../core';
import { commonStyles } from '../styles';

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

          return (
            <>
              <HeaderButtonBar onPressPrimary={handleSubmit} primaryText="Save Changes"></HeaderButtonBar>

              <ScrollView style={commonStyles.content}>
                <Form>
                  <Text style={commonStyles.text} note>
                    * This information will also be printed on receipt and report headers
                  </Text>
                  <Text style={commonStyles.text} note>
                    General company details.
                  </Text>
                  <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                    <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                  </ItemField>

                  <ItemField label="Email" touched={touched.email} name="email" errors={errors.email}>
                    <Input onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={email} />
                  </ItemField>

                  <ItemField label="Phone" touched={touched.phone} name="phone" errors={errors.phone}>
                    <Input onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} value={phone} />
                  </ItemField>

                  <ItemField label="VAT" touched={touched.vat} name="vat" errors={errors.vat}>
                    <Input onChangeText={handleChange('vat')} onBlur={handleBlur('vat')} value={vat} />
                  </ItemField>

                  <Text style={commonStyles.text} note>
                    Address
                  </Text>

                  <ItemField
                    label="Line 1"
                    touched={touched.addressLine1}
                    name="addressLine1"
                    errors={errors.addressLine1}
                  >
                    <Input
                      onChangeText={handleChange('addressLine1')}
                      onBlur={handleBlur('addressLine1')}
                      value={addressLine1}
                    />
                  </ItemField>

                  <ItemField
                    label="Line 2"
                    touched={touched.addressLine2}
                    name="addressLine2"
                    errors={errors.addressLine2}
                  >
                    <Input
                      onChangeText={handleChange('addressLine2')}
                      onBlur={handleBlur('addressLine2')}
                      value={addressLine2}
                    />
                  </ItemField>
                  <ItemField label="City" touched={touched.addressCity} name="addressCity" errors={errors.addressCity}>
                    <Input
                      onChangeText={handleChange('addressCity')}
                      onBlur={handleBlur('addressCity')}
                      value={addressCity}
                    />
                  </ItemField>
                  <ItemField
                    label="County"
                    touched={touched.addressCounty}
                    name="addressCounty"
                    errors={errors.addressCounty}
                  >
                    <Input
                      onChangeText={handleChange('addressCounty')}
                      onBlur={handleBlur('addressCounty')}
                      value={addressCounty}
                    />
                  </ItemField>
                  <ItemField
                    label="Post Code"
                    touched={touched.addressPostcode}
                    name="addressPostcode"
                    errors={errors.addressPostcode}
                  >
                    <Input
                      onChangeText={handleChange('addressPostcode')}
                      onBlur={handleBlur('addressPostcode')}
                      value={addressPostcode}
                    />
                  </ItemField>
                </Form>
              </ScrollView>
            </>
          );
        }}
      </Formik>
    </Container>
  );
};
