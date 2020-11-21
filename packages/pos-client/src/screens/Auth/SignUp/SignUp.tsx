import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../components/ItemField/ItemField';
import { AuthContext } from '../../../contexts/AuthContext';
import { Button, Container, Content, Form, Header, Input, Text } from '../../../core';

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
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

interface SignUpProps {}

export const SignUp: React.FC<SignUpProps> = () => {
  const { signUp } = React.useContext(AuthContext);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={({ passwordConfirmation, ...values }) => signUp(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { firstName, lastName, password, passwordConfirmation, email } = values;

        return (
          <Container>
            <Header />
            <Content>
              <Form>
                <ItemField label="First Name" touched={touched.firstName} name="firstName" errors={errors.firstName}>
                  <Input onChangeText={handleChange('firstName')} onBlur={handleBlur('firstName')} value={firstName} />
                </ItemField>
                <ItemField label="Last Name" touched={touched.lastName} name="lastName" errors={errors.lastName}>
                  <Input onChangeText={handleChange('lastName')} onBlur={handleBlur('lastName')} value={lastName} />
                </ItemField>
                <ItemField label="Email" touched={touched.email} name="email" errors={errors.email}>
                  <Input onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={email} />
                </ItemField>
                <ItemField label="Password" touched={touched.password} name="password" errors={errors.password}>
                  <Input
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={password}
                    secureTextEntry
                  />
                </ItemField>
                <ItemField
                  label="Confirm Password"
                  touched={touched.passwordConfirmation}
                  name="passwordConfirmation"
                  errors={errors.passwordConfirmation}
                >
                  <Input
                    onChangeText={handleChange('passwordConfirmation')}
                    onBlur={handleBlur('passwordConfirmation')}
                    value={passwordConfirmation}
                    secureTextEntry
                  />
                </ItemField>

                <Button onPress={handleSubmit}>
                  <Text>Sign Up</Text>
                </Button>
              </Form>
            </Content>
          </Container>
        );
      }}
    </Formik>
  );
};
