import { Printer } from '../../../models';
import { ListItem, Left, Text, Body, Right, Icon, Button } from 'native-base';
import { styles } from './styles';
import React from 'react';
// import { capitalize } from 'lodash';
import withObservables from '@nozbe/with-observables';

interface PrinterRowInnerProps {}

interface PrinterRowOuterProps {
  onSelect: (p: Printer) => void;
  onDelete: (p: Printer) => void;
  printer: Printer;
  isSelected?: boolean;
}

const PrinterRowInner: React.FC<PrinterRowOuterProps & PrinterRowInnerProps> = ({
  isSelected,
  onSelect,
  printer,
  onDelete,
}) => {
  return (
    <ListItem key={printer.id} noIndent style={isSelected ? styles.selectedRow : {}}>
      <Left>
        <Text>{printer.name}</Text>
      </Left>
      <Body>
        {/* <Text note>{capitalize(printer)}</Text> */}
        <Text note>{printer.address}</Text>
      </Body>
      <Button style={{ marginRight: 10 }} bordered danger small onPress={() => onDelete(printer)}>
        <Text>Delete</Text>
      </Button>
      <Button bordered info small onPress={() => onSelect(printer)}>
        <Text>View</Text>
      </Button>
    </ListItem>
  );
};

const enhance = withObservables<PrinterRowOuterProps, PrinterRowInnerProps>(['printer'], ({ printer }) => ({
  printer,
}));

export const PrinterRow = enhance(PrinterRowInner);
