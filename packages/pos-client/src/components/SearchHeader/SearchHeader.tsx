import React from 'react';
import { Container, Item, Icon, Input, Button, Header, Text } from '../../core';

interface SearchHeaderProps {
  onChangeText: (value: string) => void;
  value: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onChangeText, value = '' }) => {
  return (
    <Header searchBar rounded>
      <Item>
        <Icon name="ios-search" />
        <Input placeholder="Search" onChangeText={onChangeText} value={value} />
      </Item>
    </Header>
  );
};
