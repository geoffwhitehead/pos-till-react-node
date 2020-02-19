import React from 'react'
import { Container, Input, Button, Header, Content, Item, Text, Form, Label } from '../../core'
import { StyleSheet } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import { Formik } from 'formik'
import * as Yup from 'yup'

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
})

export const SignUp = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext)

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={({ passwordConfirmation, ...values }) => signUp(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { firstName, lastName, password, passwordConfirmation, email } = values
        const err = {
          firstName: !!(touched.firstName && errors.firstName),
          lastName: !!(touched.lastName && errors.lastName),
          email: !!(touched.email && errors.email),
          password: !!(touched.password && errors.password),
          passwordConfirmation: !!(touched.passwordConfirmation && errors.passwordConfirmation),
        }
        return (
          <Container>
            <Header />
            <Content>
              <Form>
                <Item stackedLabel error={err.firstName}>
                  <Label>First Name</Label>
                  <Input
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={firstName}
                  />
                </Item>
                <Item stackedLabel error={err.lastName}>
                  <Label>Last Name</Label>
                  <Input
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={lastName}
                  />
                </Item>
                <Item stackedLabel error={err.email}>
                  <Label>Email</Label>
                  <Input
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={email}
                  />
                </Item>
                <Item stackedLabel error={err.password}>
                  <Label>Password</Label>
                  <Input
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={password}
                    secureTextEntry
                  />
                </Item>
                <Item stackedLabel error={err.passwordConfirmation}>
                  <Label>Confim Password</Label>
                  <Input
                    onChangeText={handleChange('passwordConfirmation')}
                    onBlur={handleBlur('passwordConfirmation')}
                    value={passwordConfirmation}
                    secureTextEntry
                  />
                </Item>
                <Button onPress={handleSubmit}>
                  <Text>Sign Up</Text>
                </Button>
              </Form>
            </Content>
          </Container>
        )
      }}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
