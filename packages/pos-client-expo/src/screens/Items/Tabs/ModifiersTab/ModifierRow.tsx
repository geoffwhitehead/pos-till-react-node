import withObservables from '@nozbe/with-observables';
import React from 'react';
import { Button, Left, ListItem, Right, Text } from '../../../../core';
import { Modifier } from '../../../../models';

type ModifierRowOuterProps = {
  onSelect: (modifier: Modifier) => void;
  onView: (modifier: Modifier) => void;
  index: number;
  modifier: Modifier;
  selected?: boolean;
};

type ModifierRowInnerProps = {
  itemsCount: number;
};

const ModifierRowInner: React.FC<ModifierRowOuterProps & ModifierRowInnerProps> = ({
  onSelect,
  index,
  itemsCount,
  modifier,
  onView,
  selected,
  ...props
}) => {
  return (
    <ListItem {...props} onPress={() => onSelect(modifier)} selected={selected}>
      <Left style={{ flexDirection: 'column' }}>
        <Text style={{ alignSelf: 'flex-start' }}>{`${index + 1}: ${modifier.name}`}</Text>
        <Text style={{ alignSelf: 'flex-start' }} note>{`Assigned: ${itemsCount} Items`}</Text>
      </Left>
      <Right>
        <Button bordered info small onPress={() => onView(modifier)} transparent>
          <Text>Edit</Text>
        </Button>
      </Right>
    </ListItem>
  );
};

const enhance = c =>
  withObservables<ModifierRowOuterProps, ModifierRowInnerProps>(['modifier'], ({ modifier }) => {
    return {
      modifier,
      itemsCount: modifier.itemModifiers.observeCount(),
    };
  })(c);

export const ModifierRow = enhance(ModifierRowInner);
