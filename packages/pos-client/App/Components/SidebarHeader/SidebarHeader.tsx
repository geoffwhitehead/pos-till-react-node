import React from 'react'
import { Container, Header, Left, Right, Body, Button, Icon, Title, Drawer } from '../../core'

interface SidebarHeaderProps {
  title: string;
  onOpen: () => void;
}

export const SidebarHeader: React.SFC<SidebarHeaderProps> = ({ title, onOpen }) => {

  return (
    <Header>
      <Left>
        <Button transparent onPress={onOpen}>
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right />
    </Header>
  )
}
