import withObservables from '@nozbe/with-observables';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Left, ListItem, Right, Text, View } from '../../../../core';
import { Category } from '../../../../models';

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
        <View style={{ ...styles.name, backgroundColor: category.backgroundColor }}>
          <Text
            style={{
              ...styles.text,

              color: category.textColor,
            }}
          >{`${index + 1}: ${category.name}`}</Text>
        </View>
        <Text style={styles.text} note>{`Assigned: ${itemsCount} Items`}</Text>
        <Text style={styles.text} note>{`Position Index: ${category.positionIndex}`}</Text>
      </Left>
      <Right>
        <Button bordered info small onPress={() => onSelect(category)} transparent>
          <Text>Edit</Text>
        </Button>
      </Right>
    </ListItem>
  );
};

const enhance = c =>
  withObservables<CategoryRowOuterProps, CategoryRowInnerProps>(['category'], ({ category }) => {
    return {
      category,
      itemsCount: category.items.observeCount(),
    };
  })(c);

export const CategoryRow = enhance(CategoryRowInner);

const styles = StyleSheet.create({
  text: { alignSelf: 'flex-start' },
  name: { borderRadius: 5, padding: 3, paddingLeft: 6, paddingRight: 6 },
} as const);
