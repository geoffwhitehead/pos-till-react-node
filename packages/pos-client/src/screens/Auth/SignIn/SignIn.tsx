import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, StatusBar, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../../contexts/AuthContext';
import { Button, Container, Form, Input, Item, Label, Text } from '../../../core';
import { Organization, tableNames } from '../../../models';
import { AuthStackParamList } from '../../../navigators/AuthNavigator';
import { colors } from '../../../theme';
import { areYouSure } from '../../../utils/helpers';
import { moderateScale } from '../../../utils/scaling';

interface SignInOuterProps {
  navigation: StackNavigationProp<AuthStackParamList, 'SignIn'>;
  route: RouteProp<AuthStackParamList, 'SignIn'>;
  database: Database;
}

interface SignInInnerProps {
  organizations: Organization[];
}

export const SignInInner: React.FC<SignInOuterProps & SignInInnerProps> = ({ navigation, route, organizations }) => {
  const [organization, setOrganization] = useState<Organization | null>();
  const [email, setEmail] = useState('geoff1012@gmail.com');
  const [password, setPassword] = useState('geoffgeoff');
  const animation = useRef();

  useEffect(() => {
    const org = organizations?.[0];
    if (org) {
      setOrganization(org);
      setEmail(org.email);
    } else {
      setOrganization(null);
      setEmail(null);
    }
  }, [organizations]);

  const { signIn, unlink } = useContext(AuthContext);

  const handleUnlink = () => {
    unlink();
    navigation.navigate('SignIn');
  };
  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <KeyboardAvoidingView style={styles.signin}>
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
            {!organization && (
              <Button
                full
                style={{ ...styles.button, backgroundColor: 'white' }}
                light
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text>Register</Text>
              </Button>
            )}
            {organization && (
              <Button
                full
                style={{ ...styles.button, backgroundColor: 'white' }}
                light
                onPress={() => areYouSure(handleUnlink)}
              >
                <Text>Unlink</Text>
              </Button>
            )}
            {organization && (
              <Text style={{ padding: 20 }} note>
                * This terminal is currently linked with {organization.name}.
              </Text>
            )}
          </Form>
        </KeyboardAvoidingView>
      </ScrollView>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<SignInOuterProps, SignInInnerProps>(null, ({ database }) => ({
      organizations: database.collections.get<Organization>(tableNames.organizations).query(),
    }))(c),
  );

export const SignIn = enhance(SignInInner);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
  },
  form: {
    width: moderateScale(300),
  },
  signin: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',

    marginTop: moderateScale(50),
  },
  button: {
    marginLeft: moderateScale(15),
    marginTop: moderateScale(10),
  },
  text: {
    color: 'white',
  },
} as const);
