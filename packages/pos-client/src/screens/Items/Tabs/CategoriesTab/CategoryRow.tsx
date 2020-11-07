import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { Button, Left, ListItem, Right, Text } from '../../../../core';
import { Category, Modifier, tableNames } from '../../../../models';

type CategoryRowOuterProps = {
  onSelect: (category: Category) => void;
  index: number;
  key: string;
  category: Category;
};

type CategoryRowInnerProps = {
  itemsCount: number;
};

const CategoryRowInner: React.FC<CategoryRowOuterProps & CategoryRowInnerProps> = ({
  onSelect,
  index,
  itemsCount,
  category,
  ...props
}) => {
  return (
    <ListItem {...props}>
      <Left style={{ flexDirection: 'column' }}>
        <Text style={{ alignSelf: 'flex-start' }}>{`${index + 1}: ${category.name}`}</Text>
        <Text style={{ alignSelf: 'flex-start' }} note>{`Assigned: ${itemsCount} Items`}</Text>
      </Left>
      <Right>
        <Button bordered info small onPress={() => onSelect(category)} transparent>
          <Text>View</Text>
        </Button>
      </Right>
    </ListItem>
  );
};

const enhance = c =>
  withObservables<CategoryRowOuterProps, CategoryRowInnerProps>(['category'], ({ category, database }) => {
    return {
      category,
      itemsCount: category.items.observeCount(),
    };
  })(c);

export const CategoryRow = enhance(CategoryRowInner);
