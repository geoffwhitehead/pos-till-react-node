import React from 'react'
import { Container, Input, Button, Header, Content, Item, Text } from '../../core'
import { StyleSheet } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'

export const SignIn = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { signIn } = React.useContext(AuthContext)

  return (
    <Container>
      <Header />
      <Content>
        <Item>
          <Input placeholder="Username" onChangeText={setUsername} value={username} />
        </Item>
        <Item>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Item>
        <Item>
          <Button onPress={() => signIn({ username, password })}>
            <Text>Sign in</Text>
          </Button>
        </Item>
      </Content>
    </Container>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// })
