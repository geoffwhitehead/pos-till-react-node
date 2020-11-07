import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Button, Content, List, ListItem, Text } from '../../core';

const routes = ['Checkout', 'SplashScreen'];

export const Sidebar = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  return (
    <Content>
      <Text>asd</Text>
      <List
        dataArray={routes}
        renderRow={route => {
          return (
            <ListItem button onPress={() => navigation.navigate(route)}>
              <Text>{route}</Text>
            </ListItem>
          );
        }}
      />
      <Button onPress={() => signOut()}>
        <Text>Sign out</Text>
      </Button>
    </Content>
  );
};
