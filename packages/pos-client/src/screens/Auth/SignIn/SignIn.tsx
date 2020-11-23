import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useContext, useRef, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Button, Container, Form, Input, Item, Label, Text } from '../../../core';
import { AuthStackParamList } from '../../../navigators/AuthNavigator';
import { colors } from '../../../theme';

interface SignInProps {
  navigation: StackNavigationProp<AuthStackParamList, 'SignIn'>;
  route: RouteProp<AuthStackParamList, 'SignIn'>;
}

export const SignIn: React.FC<SignInProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params.organization?.email || 'geoff1012@gmail.com');
  const [password, setPassword] = useState('geoff');
  const organization = route.params.organization;
  const animation = useRef();

  const { signIn } = useContext(AuthContext);

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.signin}>
        <LottieView
          style={{ height: 300, width: 300 }}
          source={require('../../../animations/9788-add-new.json')}
          autoPlay={true}
          loop={false}
          ref={animation}
        />
        <Form style={styles.form}>
          <Item stackedLabel>
            <Label style={styles.text}>Email</Label>
            {organization ? (
              <Label style={styles.text}>{organization.name}</Label>
            ) : (
              <Input style={styles.text} autoCapitalize="none" onChangeText={setEmail} value={email} />
            )}
          </Item>
          <Item stackedLabel>
            <Label style={styles.text}>Password</Label>

            <Input style={styles.text} value={password} onChangeText={setPassword} secureTextEntry />
          </Item>
          <Button info full style={styles.button} onPress={() => signIn({ email, password })}>
            <Text>Sign in</Text>
          </Button>
          <Button
            full
            style={{ ...styles.button, backgroundColor: 'white' }}
            disabled={!!organization}
            light
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text>Register</Text>
          </Button>
          {organization && (
            <Text style={{ padding: 20 }} note>
              * This terminal is currently linked with {organization.name}.
            </Text>
          )}
        </Form>
      </View>
    </Container>
  );
};

const styles = {
  container: {
    backgroundColor: colors.darkBlue,
  },
  form: {
    width: 300,
  },
  signin: {
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
