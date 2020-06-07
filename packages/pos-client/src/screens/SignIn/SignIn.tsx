import React, { useState, useContext } from 'react';
import { Container, Input, Button, Header, Content, Item, Text } from '../../core';
import { AuthContext } from '../../contexts/AuthContext';

export const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  return (
    <Container>
      <Header />
      <Content>
        <Item>
          <Input placeholder="Email" onChangeText={setEmail} value={email} />
        </Item>
        <Item>
          <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        </Item>
        <Item>
          <Button onPress={() => signIn({ email, password })}>
            <Text>Sign in</Text>
          </Button>
        </Item>
        <Item>
          <Button light onPress={() => navigation.navigate('SignUp')}>
            <Text>Register</Text>
          </Button>
        </Item>
      </Content>
    </Container>
  );
};