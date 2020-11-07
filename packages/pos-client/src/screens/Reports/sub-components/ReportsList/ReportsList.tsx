import React from 'react';
import { BillPeriod } from '../../../../models';

interface ReportsListProps {
  billPeriods: BillPeriod[];
  selectedReport: BillPeriod | null;
  onSelectReport: (bP: BillPeriod) => void;
  onPressClosePeriod: (bP: BillPeriod) => void;
}

export const ReportsList: React.FC<ReportsListProps> = ({
  billPeriods,
  selectedReport,
  onSelectReport,
  onPressClosePeriod,
}) => {
  // return (
  //   <Content>
  //     <List>
  //       {billPeriods.slice(0, 3).map(billPeriod => {
  //         return (
  //           <ListItem
  //             thumbnail
  //             selected={selectedReport && selectedReport.id === billPeriod.id}
  //             onPress={() => onSelectReport(billPeriod)}
  //           >
  //             <Left>
  //               <Icon name="ios-paper" />
  //             </Left>
  //             <Body>
  //               <Text>{`Opened: ${dayjs(billPeriod.opened).toString()}`}</Text>
  //               <Text>{`Closed: ${billPeriod.closed ? dayjs(billPeriod.closed).toString() : ''}`}</Text>
  //             </Body>
  //             <Right>
  //               {!billPeriod.closed && (
  //                 <Button
  //                   onPress={() => {
  //                     onSelectReport(billPeriod);
  //                     onPressClosePeriod(billPeriod);
  //                   }}
  //                 >
  //                   <Text>Close current period</Text>
  //                 </Button>
  //               )}
  //             </Right>
  //           </ListItem>
  //         );
  //       })}
  //     </List>
  //   </Content>
  // );
};
