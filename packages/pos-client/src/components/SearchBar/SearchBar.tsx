import React from 'react';
import { Button, Icon, Input, Item, Text } from '../../core';
import { resolveButtonState } from '../../utils/helpers';

type SearchBarProps = {
  onSearch: (value: string) => void;
  value: string;
  onPressCreate?: () => void;
  isCreateDisabled?: boolean;
  onPressSecondary?: () => void;
  secondaryText?: string;
  secondaryIconName?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  value,
  onPressSecondary,
  secondaryText,
  onPressCreate,
  isCreateDisabled,
  secondaryIconName,
  children,
  ...props
}) => {
  return (
    <Item {...props} style={styles.searchBar}>
      <Icon name="ios-search" />
      <Input placeholder="Search" onChangeText={onSearch} value={value} />
      {children}
      {onPressSecondary && (
        <Button iconLeft small info onPress={onPressSecondary}>
          {secondaryIconName && <Icon name={secondaryIconName} />}
          <Text>{secondaryText}</Text>
        </Button>
      )}
      <Button
        iconLeft
        small
        {...resolveButtonState(isCreateDisabled, 'success')}
        onPress={onPressCreate}
        disabled={isCreateDisabled}
        style={{ marginLeft: 5, alignSelf: 'center' }}
      >
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
