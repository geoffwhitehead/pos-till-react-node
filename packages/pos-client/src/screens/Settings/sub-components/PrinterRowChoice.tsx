import { Printer } from '../../../models';
import { ListItem, Left, Text, Body, Right, Icon } from 'native-base';
import { commonStyles } from './styles';
import React from 'react';
// import { capitalize } from 'lodash';
import withObservables from '@nozbe/with-observables';

interface PrinterRowChoiceInnerProps {}

interface PrinterRowChoiceOuterProps {
  onSelect?: (p: Printer) => void;
  printer: Printer;
  arrowDir: 'left' | 'right';
}

const PrinterRowChoiceInner: React.FC<PrinterRowChoiceOuterProps & PrinterRowChoiceInnerProps> = ({
  onSelect,
  printer,
  arrowDir,
}) => {
  if (arrowDir === 'right') {
    return (
      <ListItem key={printer.id} noIndent onPress={() => onSelect(printer)}>
        <Left>
          <Text>{printer.name}</Text>
        </Left>
        <Body>
          <Text note>{printer.address}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem key={printer.id} noIndent onPress={() => onSelect(printer)}>
        <Left>
          <Icon name="arrow-back" style={{ color: 'grey' }} />
          <Text>{printer.name}</Text>
        </Left>
        <Body>
          <Text note>{printer.address}</Text>
        </Body>
        <Right></Right>
      </ListItem>
    );
  }
};

const enhance = withObservables<PrinterRowChoiceOuterProps, PrinterRowChoiceInnerProps>(['printer'], ({ printer }) => ({
  printer,
}));

export const PrinterRowChoice = enhance(PrinterRowChoiceInner);
