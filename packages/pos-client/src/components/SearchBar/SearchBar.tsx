import React, { useState } from 'react';
import { Item, Icon, Input, Button, Text } from '../../core';

type SearchBarProps = {
  onSearch: (value: string) => void;
  value: string;
  onPressCreate?: () => void;
};
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value, onPressCreate, ...props }) => {
  return (
    <Item {...props} style={styles.searchBar}>
      <Icon name="ios-search" />
      <Input placeholder="Search" onChangeText={onSearch} value={value} />
      <Button iconLeft small success onPress={onPressCreate}>
        <Icon name="ios-add-circle-outline" />
        <Text>Create</Text>
      </Button>
    </Item>
  );
};

const styles = {
  searchBar: {
    paddingLeft: 15,
    paddingRight: 15,
  },
};
