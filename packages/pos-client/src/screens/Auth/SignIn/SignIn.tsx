import React, { useState, useContext } from 'react';
import { Container, Input, Button, Header, Content, Item, Text, Label, Form } from '../../../core';
import { AuthContext } from '../../../contexts/AuthContext';
import { AuthStackParamList } from '../../../navigators/AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Organization } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import { View } from 'native-base';
import { alignCenter } from '../../../services/printer/helpers';

interface SignInProps {
  navigation: StackNavigationProp<AuthStackParamList, 'SignIn'>;
  organization: Organization;
  route: RouteProp<AuthStackParamList, 'SignIn'>;
}

export const SignIn: React.FC<SignInProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params.organization ? route.params.organization.email : '');
  const [password, setPassword] = useState('');
  const organization = route.params.organization;

  const { signIn } = useContext(AuthContext);

  console.log('email', email);
  return (
    <Container>
      <Content>
        <View style={styles.signin}>
          <Form style={styles.form}>
            <Item stackedLabel>
              <Label>Email</Label>
              {organization ? <Label>{organization.name}</Label> : <Input onChangeText={setEmail} value={email} />}
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>

              <Input value={password} onChangeText={setPassword} secureTextEntry />
            </Item>
              <Button style={styles.button} onPress={() => signIn({ email, password })}>
                <Text>Sign in</Text>
              </Button>
            {!organization && (
              <Button style={styles.button} light onPress={() => navigation.navigate('SignUp')}>
                <Text>Register</Text>
              </Button>
            )}
          </Form>
        </View>
      </Content>
    </Container>
  );
};

const styles = {
  form: {
    width: 300,
  },
  signin: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 100
  },
  button: {
    margin: 20
  }
};
