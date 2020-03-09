import React from 'react';
import { Header, Left, Right, Body, Button, Icon, Title } from '../../core';

interface SidebarHeaderProps {
  title: string;
  onOpen: () => void;
  disableNav: boolean;
}

export const SidebarHeader: React.SFC<SidebarHeaderProps> = ({ title, onOpen, disableNav }) => {
  return (
    <Header>
      <Left>
        {!disableNav && (
          <Button transparent onPress={onOpen}>
            <Icon name="menu" />
          </Button>
        )}
      </Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right />
    </Header>
  );
};
