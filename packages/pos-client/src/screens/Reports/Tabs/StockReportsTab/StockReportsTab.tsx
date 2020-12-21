import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { TimePicker } from '../../../../components/TimePicker/TimePicker';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import { Button, Form, Icon, Item, Label, Left, ListItem, Picker, Right, Spinner, Text, View } from '../../../../core';
import { BillItem, Category, tableNames } from '../../../../models';
import { print } from '../../../../services/printer/printer';
import { stockReport } from '../../../../services/printer/stockReport';

type StockReportsTabInnerProps = {
  categories: Category[];
};

type StockReportsTabOuterProps = {
  database: Database;
};

// const printStockReport = ()

export const StockReportsTabInner: React.FC<StockReportsTabOuterProps & StockReportsTabInnerProps> = ({
  categories,
}) => {
  const [startDate, setStartDate] = useState(dayjs(dayjs().subtract(7, 'day')).toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());
  const [visibleDatePicker, setVisibleDatePicker] = useState<'start' | 'end'>();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const database = useDatabase();
  const { receiptPrinter } = useContext(ReceiptPrinterContext);
  const { organization } = useContext(OrganizationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const handleConfirm = date => {
    visibleDatePicker === 'start' ? setStartDate(date) : setEndDate(date);
    setVisibleDatePicker(null);
  };

  const handleCancel = () => setVisibleDatePicker(null);

  const onPrintStockReport = async () => {
    setIsLoading(true);

    const commands = await stockReport({ startDate, endDate, database, printer: receiptPrinter, organization });
    await print({ commands, printer: receiptPrinter });
    setIsLoading(false);
  };

  const fetchGraphData = async () => {
    console.log('FETCHING GRAPH DATA');
    setIsGraphLoading(true);
    const startDateUnix =
      dayjs(startDate)
        //   .startOf('day')
        .unix() * 1000;

    const endDateUnix =
      dayjs(endDate)
        .endOf('day')
        .unix() * 1000;

    console.log('startDateUnix ', startDateUnix);
    console.log('endDateUnix ', endDateUnix);
    const billItems = await database.collections
      .get<BillItem>(tableNames.billItems)
      .query(
        Q.and(
          Q.where('category_id', Q.eq(selectedCategory.id)),
          Q.where('is_voided', Q.notEq(true)),
          //   Q.where('created_at', Q.gte(startDateUnix)),
          Q.where('created_at', Q.lte(endDateUnix)),
        ),
      )
      .fetch();
    console.log('billItems ', billItems);

    const grouped = groupBy(billItems, billItem => billItem.itemId);

    const data = Object.values(grouped).map(billItems => {
      return {
        x: billItems[0].itemName,
        y: billItems.length,
      };
    });

    console.log('DATA ', data);
    setGraphData(data);
    setIsGraphLoading(false);
  };

  useEffect(() => {
    if (selectedCategory && startDate && endDate) {
      fetchGraphData();
    }
  }, [selectedCategory, startDate, endDate]);

  const handlePressStartDate = () => setVisibleDatePicker('start');
  const handlePressEndDate = () => setVisibleDatePicker('end');

  return (
    <View>
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Stock Reports</Text>
      </ListItem>
      <ListItem style={{ flexDirection: 'row' }}>
        <Left>
          <Form style={{ width: 400 }}>
            <Item stackedLabel style={{ borderBottomWidth: 0 }} onPress={handlePressStartDate}>
              <Label>Start Date</Label>
              <Text style={styles.dateLabel}>{`${dayjs(startDate).format('DD/MM/YYYY')}`}</Text>
            </Item>
            <Item stackedLabel style={{ borderBottomWidth: 0 }} onPress={handlePressEndDate}>
              <Label>End Date</Label>
              <Text style={styles.dateLabel}>{`${dayjs(endDate).format('DD/MM/YYYY')}`}</Text>
            </Item>
          </Form>
        </Left>
        <Right>
          <Button small style={{ margin: 10, alignSelf: 'flex-end' }} onPress={onPrintStockReport}>
            <Text>Print Report</Text>
          </Button>
        </Right>
      </ListItem>
      <ListItem itemDivider style={styles.categoryPickerItem}>
        <Label>
          <Text style={styles.categoryPickerText}>Category: </Text>
        </Label>
        <Picker
          mode="dropdown"
          iosHeader="Select a category"
          iosIcon={<Icon name="chevron-down-outline" />}
          placeholder="Select a category"
          selectedValue={selectedCategory}
          onValueChange={c => setSelectedCategory(c)}
        >
          {categories.map(category => {
            return <Picker.Item key={category.id} label={category.name} value={category} />;
          })}
        </Picker>
      </ListItem>
      {isGraphLoading && <Spinner />}
      {!isGraphLoading && graphData.length === 0 && <Text style={{ padding: 10 }}>No data in this date range... </Text>}
      {!isGraphLoading && graphData.length > 0 && (
        <ScrollView>
          <VictoryChart
            height={1000}
            padding={{ left: 120, right: 50, top: 50 }}
            theme={VictoryTheme.material}
            horizontal
            domainPadding={{ x: 15 }}
          >
            <VictoryBar
              barWidth={3}
              alignment="start"
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '1px solid #ccc' },
              }}
              data={graphData}
            />
          </VictoryChart>
        </ScrollView>
      )}
      <View>
        <TimePicker
          isVisible={visibleDatePicker === 'start'}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          value={startDate}
          title="Please select an start date"
          mode="date"
        />
        <TimePicker
          isVisible={visibleDatePicker === 'end'}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          value={endDate}
          title="Please select an end date"
          mode="date"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryPickerItem: { paddingLeft: 15 },
  categoryPickerText: { color: 'grey' },
  dateLabel: { alignSelf: 'flex-start', paddingTop: 10 },
});

const enhance = c =>
  withDatabase<any>(
    withObservables<StockReportsTabOuterProps, StockReportsTabInnerProps>([], ({ database }) => ({
      categories: database.collections.get<Category>(tableNames.categories).query(),
    }))(c),
  );

export const StockReportsTab = enhance(StockReportsTabInner);
