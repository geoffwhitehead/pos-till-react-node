import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import { groupBy, maxBy, truncate } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { SwitchSelector } from '../../../../components/SwitchSelector/SwitchSelector';
import { TimePicker } from '../../../../components/TimePicker/TimePicker';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import { Button, Form, Icon, Item, Label, ListItem, Picker, Spinner, Text, View } from '../../../../core';
import { BillItem, Category, PriceGroup, tableNames } from '../../../../models';
import { print } from '../../../../services/printer/printer';
import { stockReport } from '../../../../services/printer/stockReport';
import { colors } from '../../../../theme';
import { moderateScale } from '../../../../utils/scaling';

type StockReportsTabInnerProps = {
  categories: Category[];
};

type StockReportsTabOuterProps = {
  database: Database;
};

enum SortTypeEnum {
  /**
   * Note: notice asc / desc are reversed. For some reason in Victory ascending will go
   * from the highest to the lowest value.
   */
  'ascending' = 'descending',
  'descending' = 'ascending',
  'alphabetical' = 'alphabetical',
}

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
  const [sortType, setSortType] = useState<SortTypeEnum>(SortTypeEnum.alphabetical);
  const [yPadding, setYPadding] = useState(100);

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
    setIsGraphLoading(true);
    const startDateUnix =
      dayjs(startDate)
        .startOf('day')
        .unix() * 1000;

    const endDateUnix =
      dayjs(endDate)
        .endOf('day')
        .unix() * 1000;

    const billItems = await database.collections
      .get<BillItem>(tableNames.billItems)
      .query(
        Q.and(
          Q.where('category_id', Q.eq(selectedCategory.id)),
          Q.where('is_voided', Q.notEq(true)),
          Q.where('created_at', Q.lte(endDateUnix)),
        ),
      )
      .fetch();
    console.log('billItems ', billItems);

    const grouped = groupBy(billItems, billItem => billItem.itemId);

    console.log('grouped', grouped);
    const data = Object.values(grouped).map((billItems, i) => {
      const itemName = truncate(billItems[0].itemName, { length: 50 });
      return {
        x: `${itemName} (${i})`,
        y: billItems.length,
        label: billItems.length,
        name: itemName,
      };
    });
    const pixelsPerChar = 7;
    const graphPadding = (maxBy(data, el => el.x.length).x.length + 5) * pixelsPerChar;
    const labelPadding = 20;
    console.log('DATA ', data);
    console.log('graphPadding ', graphPadding);
    setYPadding(graphPadding + labelPadding);
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
  const chartHeight = 200 + 20 * graphData.length;
  return (
    <>
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Item Sales over range</Text>
      </ListItem>
      <ListItem style={{ flexDirection: 'row', width: '100%' }}>
        <Form style={{ flexDirection: 'row' }}>
          <Item stackedLabel style={{ borderBottomWidth: 0, width: moderateScale(200) }} onPress={handlePressStartDate}>
            <Label>Start Date</Label>
            <Text style={styles.dateLabel}>{`${dayjs(startDate).format('DD/MM/YYYY')}`}</Text>
          </Item>
          <Item stackedLabel style={{ borderBottomWidth: 0, width: moderateScale(200) }} onPress={handlePressEndDate}>
            <Label>End Date</Label>
            <Text style={styles.dateLabel}>{`${dayjs(endDate).format('DD/MM/YYYY')}`}</Text>
          </Item>
        </Form>
        <Button small style={{ margin: 10, alignSelf: 'flex-end' }} onPress={onPrintStockReport}>
          <Text>Print Report</Text>
        </Button>
      </ListItem>
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Item Sales over range by category</Text>
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
        <SwitchSelector
          options={[
            { label: 'Alpha', value: SortTypeEnum.alphabetical },
            { label: 'Ascending', value: SortTypeEnum.ascending },
            { label: 'Descending', value: SortTypeEnum.descending },
          ]}
          initial={sortType}
          onPress={value => setSortType(value as SortTypeEnum)}
          style={{ width: moderateScale(400), marginRight: 5 }}
        />
      </ListItem>
      {isGraphLoading && <Spinner />}
      {!isGraphLoading && graphData.length === 0 && <Text style={{ padding: 10 }}>No data in this date range... </Text>}
      {!isGraphLoading && graphData.length > 0 && (
        <ScrollView>
          <VictoryChart
            height={chartHeight}
            padding={{ left: yPadding, top: 50, right: 50, bottom: 50 }}
            theme={VictoryTheme.material}
            horizontal
            domainPadding={{ x: 20 }}
            animate={{
              duration: 500,
              onLoad: { duration: 250 },
            }}
          >
            <VictoryBar
              sortKey={sortType === SortTypeEnum.alphabetical ? 'name' : ['y', 'name']}
              sortOrder={sortType === SortTypeEnum.alphabetical ? SortTypeEnum.ascending : sortType}
              barWidth={15}
              alignment="middle"
              style={{
                data: { fill: colors.highlightBlue },
                parent: { border: '1px solid #ccc' },
              }}
              data={graphData}
            />
            <VictoryAxis
              dependentAxis
              label={`Items sold (${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')})`}
              style={{
                axisLabel: { padding: 30 },
              }}
            />
            <VictoryAxis
              label="Item"
              style={{
                axisLabel: { padding: yPadding - 20 },
              }}
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
    </>
  );
};

const styles = StyleSheet.create({
  categoryPickerItem: { paddingLeft: 15, backgroundColor: 'white', justifyContent: 'flex-end' },
  categoryPickerText: { color: 'grey' },
  dateLabel: { alignSelf: 'flex-start', paddingTop: 10 },
});

const enhance = c =>
  withDatabase<any>(
    withObservables<StockReportsTabOuterProps, StockReportsTabInnerProps>([], ({ database }) => ({
      categories: database.collections.get<Category>(tableNames.categories).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    }))(c),
  );

export const StockReportsTab = enhance(StockReportsTabInner);
