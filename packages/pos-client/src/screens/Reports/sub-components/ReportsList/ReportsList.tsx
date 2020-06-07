import React from 'react';
import { List, ListItem, Text, Left, Body, Right, Button, Content, Icon } from '../../../../core';
import dayjs from 'dayjs';

interface ReportsListProps {
  billPeriods: any;
  selectedReport: any | null;
  onSelectReport: (report: any) => void;
  onPressClosePeriod: (billPeriod) => void;
}

export const ReportsList: React.FC<ReportsListProps> = ({
  billPeriods,
  selectedReport,
  onSelectReport,
  onPressClosePeriod,
}) => {
  return (
    <Content>
      <List>
        {billPeriods.slice(0, 3).map(billPeriod => {
          return (
            <ListItem
              thumbnail
              selected={selectedReport && selectedReport._id === billPeriod._id}
              onPress={() => onSelectReport(billPeriod)}
            >
              <Left>
                <Icon name="ios-paper" />
              </Left>
              <Body>
                <Text>{`Opened: ${dayjs(billPeriod.opened).toString()}`}</Text>
                <Text>{`Closed: ${billPeriod.closed ? dayjs(billPeriod.closed).toString() : ''}`}</Text>
              </Body>
              <Right>
                {!billPeriod.closed && (
                  <Button
                    onPress={() => {
                      onSelectReport(billPeriod);
                      onPressClosePeriod(billPeriod);
                    }}
                  >
                    <Text>Close current period</Text>
                  </Button>
                )}
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};
