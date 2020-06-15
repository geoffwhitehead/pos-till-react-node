import { Printer } from '../../../models';
import { ListItem, Left, Text, Body, Right, Icon } from 'native-base';
import { styles } from './styles';
import React from 'react';
import { capitalize } from 'lodash';
import withObservables from '@nozbe/with-observables';

interface PrinterRowChoiceInnerProps {}

interface PrinterRowChoiceOuterProps {
  onSelect?: (p: Printer) => void;
  printer: Printer;
  isSelected?: boolean;
}

const PrinterRowChoiceInner: React.FC<PrinterRowChoiceOuterProps & PrinterRowChoiceInnerProps> = ({
  isSelected,
  onSelect,
  printer,
}) => {
  return (
    <ListItem key={printer.id} noIndent style={isSelected && styles.selectedRow} onPress={() => onSelect(printer)}>
      <Left>
        <Icon name="arrow-back" style={{color: 'grey'}}/>
        <Text>{printer.name}</Text>
      </Left>
      <Body>
        <Text note>{capitalize(printer.type)}</Text>
        <Text note>{printer.address}</Text>
      </Body>
      <Right></Right>
    </ListItem>
  );
};

const enhance = withObservables<PrinterRowChoiceOuterProps, PrinterRowChoiceInnerProps>(['printer'], ({ printer }) => ({
  printer,
}));

export const PrinterRowChoice = enhance(PrinterRowChoiceInner);
