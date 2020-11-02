import React, { useContext } from 'react';
import { Text, Content, List, ListItem, Button } from '../../core';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from '../../contexts/AuthContext';

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
