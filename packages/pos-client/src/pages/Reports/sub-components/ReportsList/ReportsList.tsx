import React from 'react';
import { List, ListItem, Text, Left, Body, Right, Button, Content, Icon, Toast } from '../../../../core';
import dayjs from 'dayjs';
import { BillPeriodProps } from '../../../../services/schemas';
import { Collection } from 'realm';

interface ReportsListProps {
  reports: Collection<BillPeriodProps>;
  selectedReport: BillPeriodProps | null;
  onSelectReport: (report: BillPeriodProps) => void;
  onPressClosePeriod: () => void;
}

export const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  onPressClosePeriod,
}) => {
  return (
    <Content>
      <List>
        {reports.slice(0, 3).map(report => {
          return (
            <ListItem
              thumbnail
              selected={selectedReport && selectedReport._id === report._id}
              onPress={() => onSelectReport(report)}
            >
              <Left>
                <Icon name="ios-paper" />
              </Left>
              <Body>
                <Text>{`Opened: ${dayjs(report.opened).toString()}`}</Text>
                <Text>{`Closed: ${report.closed ? dayjs(report.closed).toString() : ''}`}</Text>
              </Body>
              <Right>
                {!report.closed && (
                  <Button onPress={onPressClosePeriod}>
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
