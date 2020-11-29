import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Bar } from 'react-native-progress';
import * as Yup from 'yup';
import { ItemField } from '../../../components/ItemField/ItemField';
import { AuthContext } from '../../../contexts/AuthContext';
import { Button, Container, Form, Icon, Input, Text, View } from '../../../core';
import { AuthStackParamList } from '../../../navigators/AuthNavigator';
import { colors } from '../../../theme';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  phone: Yup.string()
    .min(2, 'Too Short')
    .max(16, 'Too Long')
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
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

interface SignUpProps {
  navigation: StackNavigationProp<AuthStackParamList, 'SignUp'>;
  route: RouteProp<AuthStackParamList, 'SignUp'>;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressCounty: string;
  addressPostcode: string;
};

export const SignUp: React.FC<SignUpProps> = ({ navigation, route }) => {
  const { signUp } = React.useContext(AuthContext);
  const [page, setPage] = useState(1);

  const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressCounty: '',
    addressPostcode: '',
  };

  const handleNext = () => setPage(page + 1);
  const handlePrevious = () => setPage(page - 1);

  const handleSubmit = async (values: FormValues) => {
    const {
      firstName,
      lastName,
      email,
      password,
      name,
      phone,
      addressLine1,
      addressLine2,
      addressCity,
      addressCounty,
      addressPostcode,
    } = values;

    const apiValues = {
      firstName,
      lastName,
      email,
      password,
      name,
      phone,
      address: {
        line1: addressLine1,
        line2: addressLine2,
        city: addressCity,
        county: addressCounty,
        postcode: addressPostcode,
      },
    };
    const { success } = await signUp(apiValues);

    if (success) {
      navigation.navigate('SignIn');
    }
  };
  return (
    <Formik initialValues={initialValues} validationSchema={SignupSchema} onSubmit={handleSubmit}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const {
          firstName,
          lastName,
          password,
          passwordConfirmation,
          name,
          email,
          phone,
          addressLine1,
          addressLine2,
          addressCity,
          addressCounty,
          addressPostcode,
        } = values;

        return (
          <Container style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.bgGreyBlue} />

            <ScrollView style={{ padding: 20 }}>
              <Bar progress={page === 1 ? 0.3 : page === 2 ? 0.6 : 1} width={300} color="white" />
              <View style={styles.content}>
                <Form style={styles.form}>
                  {page === 1 && (
                    <>
                      <ItemField
                        styleLabel={styles.text}
                        label="First Name"
                        touched={touched.firstName}
                        name="firstName"
                        errors={errors.firstName}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          value={firstName}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Last Name"
                        touched={touched.lastName}
                        name="lastName"
                        errors={errors.lastName}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          value={lastName}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Email"
                        touched={touched.email}
                        name="email"
                        errors={errors.email}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={email}
                          autoCapitalize="none"
                        />
                      </ItemField>
                    </>
                  )}

                  {page === 2 && (
                    <>
                      <ItemField
                        styleLabel={styles.text}
                        label="Company Name"
                        touched={touched.name}
                        name="name"
                        errors={errors.name}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={name}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Phone"
                        touched={touched.phone}
                        name="phone"
                        errors={errors.phone}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          value={phone}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Address Line 1"
                        touched={touched.addressLine1}
                        name="addressLine1"
                        errors={errors.addressLine1}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('addressLine1')}
                          onBlur={handleBlur('addressLine1')}
                          value={addressLine1}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Address Line 2"
                        touched={touched.addressLine2}
                        name="addressLine2"
                        errors={errors.addressLine2}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('addressLine2')}
                          onBlur={handleBlur('addressLine2')}
                          value={addressLine2}
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Address City"
                        touched={touched.addressCity}
                        name="addressCity"
                        errors={errors.addressCity}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('addressCity')}
                          onBlur={handleBlur('addressCity')}
                          value={addressCity}
                        />
                      </ItemField>

                      <ItemField
                        styleLabel={styles.text}
                        label="Address County"
                        touched={touched.addressCounty}
                        name="addressCounty"
                        errors={errors.addressCounty}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('addressCounty')}
                          onBlur={handleBlur('addressCounty')}
                          value={addressCounty}
                        />
                      </ItemField>

                      <ItemField
                        styleLabel={styles.text}
                        label="Address Postcode"
                        touched={touched.addressPostcode}
                        name="addressPostcode"
                        errors={errors.addressPostcode}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('addressPostcode')}
                          onBlur={handleBlur('addressPostcode')}
                          value={addressPostcode}
                        />
                      </ItemField>
                    </>
                  )}
                  {page === 3 && (
                    <Form>
                      <ItemField
                        styleLabel={styles.text}
                        label="Password"
                        touched={touched.password}
                        name="password"
                        errors={errors.password}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={password}
                          secureTextEntry
                        />
                      </ItemField>
                      <ItemField
                        styleLabel={styles.text}
                        label="Confirm Password"
                        touched={touched.passwordConfirmation}
                        name="passwordConfirmation"
                        errors={errors.passwordConfirmation}
                      >
                        <Input
                          style={styles.text}
                          onChangeText={handleChange('passwordConfirmation')}
                          onBlur={handleBlur('passwordConfirmation')}
                          value={passwordConfirmation}
                          secureTextEntry
                        />
                      </ItemField>
                    </Form>
                  )}
                </Form>
                <View style={styles.navButtons}>
                  {page > 1 && (
                    <Button full info onPress={handlePrevious} style={{ flexGrow: 1 }}>
                      <Icon name="arrow-back-outline" />
                    </Button>
                  )}
                  {page !== 3 && (
                    <Button full info onPress={handleNext} style={{ flexGrow: 3, marginLeft: 5 }}>
                      <Text>Continue</Text>
                    </Button>
                  )}
                  {page === 3 && (
                    <Button full info onPress={handleSubmit} style={{ flexGrow: 3, marginLeft: 5 }}>
                      <Text>Sign Up</Text>
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </Container>
        );
      }}
    </Formik>
  );
};

const styles = {
  content: {
    width: 300,
  },
  form: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  navButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  container: {
    backgroundColor: colors.darkBlue,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',

    marginTop: 50,
  },
  button: {
    marginLeft: 15,
    marginTop: 10,
  },
  text: {
    color: 'white',
  },
} as const;
