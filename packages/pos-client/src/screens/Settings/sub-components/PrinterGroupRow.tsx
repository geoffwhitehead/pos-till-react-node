import { Printer, PrinterGroup } from '../../../models';
import { ListItem, Left, Text, Body, Button } from '../../../core';
import { styles } from './styles';
import React from 'react';
import withObservables from '@nozbe/with-observables';

interface PrinterGroupRowInnerProps {
  printers: Printer[];
}

interface PrinterGroupRowOuterProps {
  onSelect: (pG: PrinterGroup) => void;
  onDelete: (pG: PrinterGroup) => void;
  isSelected: boolean;
  printerGroup: PrinterGroup;
}

const PrinterGroupRowInner: React.FC<PrinterGroupRowOuterProps & PrinterGroupRowInnerProps> = ({
  isSelected,
  printers,
  onSelect,
  onDelete,
  printerGroup,
  ...props
}) => {
  return (
    <ListItem {...props} noIndent style={isSelected ? styles.selectedRow : {}}>
      <Left>
        <Text>{printerGroup.name}</Text>
      </Left>
      <Body>
        <Text note>{printers.map(p => p.name).join(', ')}</Text>
      </Body>

      <Button style={{ marginRight: 10 }} bordered danger small onPress={() => onDelete(printerGroup)}>
        <Text>Delete</Text>
      </Button>
      <Button bordered info small onPress={() => onSelect(printerGroup)}>
        <Text>View</Text>
      </Button>
    </ListItem>
  );
};

const enhance = withObservables<PrinterGroupRowOuterProps, PrinterGroupRowInnerProps>(
  ['printerGroup'],
  ({ printerGroup }) => ({
    printerGroup,
    printers: printerGroup.printers,
  }),
);

export const PrinterGroupRow = enhance(PrinterGroupRowInner);
