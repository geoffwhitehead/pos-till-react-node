import { Printer, PrinterGroup } from '../../../models';
import { ListItem, Left, Text, Body, Right, Icon } from 'native-base';
import { styles } from './styles';
import React from 'react';
import { capitalize } from 'lodash';
import withObservables from '@nozbe/with-observables';
import { printerSchema } from '../../../models/Printer';

interface PrinterGroupRowInnerProps {
  printers: Printer[];

}

interface PrinterGroupRowOuterProps {
  onSelect: (pG: PrinterGroup) => void;
  isSelected: boolean;
  printerGroup: PrinterGroup
}

const PrinterGroupRowInner: React.FC<PrinterGroupRowOuterProps & PrinterGroupRowInnerProps> = ({ isSelected, printers, onSelect, printerGroup }) => {
  return (
    <ListItem key={printerGroup.id} noIndent style={isSelected && styles.selectedRow} onPress={() => onSelect(printerGroup)}>
      <Left>
        <Text>{printerGroup.name}</Text>
      </Left>
      <Body>
        <Text note>{printers.map(p => p.name).join(', ')}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );
};

const enhance = withObservables<PrinterGroupRowOuterProps, PrinterGroupRowInnerProps>(['printerGroup'], ({ printerGroup }) => ({
  printerGroup,
  printers: printerGroup.printers
}));

export const PrinterGroupRow = enhance(PrinterGroupRowInner);
