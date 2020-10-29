import { Printer } from '../../../models';
import { ListItem, Left, Text, Body, Right, Icon } from 'native-base';
import { styles } from './styles';
import React from 'react';
// import { capitalize } from 'lodash';
import withObservables from '@nozbe/with-observables';

interface PrinterRowInnerProps {}

interface PrinterRowOuterProps {
  onSelect?: (p: Printer) => void;
  printer: Printer;
  isSelected?: boolean;
}

const PrinterRowInner: React.FC<PrinterRowOuterProps & PrinterRowInnerProps> = ({ isSelected, onSelect, printer }) => {
  return (
    <ListItem key={printer.id} noIndent style={isSelected && styles.selectedRow} onPress={() => onSelect(printer)}>
      <Left>
        <Text>{printer.name}</Text>
      </Left>
      <Body>
        {/* <Text note>{capitalize(printer)}</Text> */}
        <Text note>{printer.address}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );
};

const enhance = withObservables<PrinterRowOuterProps, PrinterRowInnerProps>(['printer'], ({ printer }) => ({
  printer,
}));

export const PrinterRow = enhance(PrinterRowInner);
