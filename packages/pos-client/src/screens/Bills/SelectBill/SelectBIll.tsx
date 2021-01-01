import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useContext, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { SwitchSelector } from '../../../components/SwitchSelector/SwitchSelector';
import { CurrentBillContext } from '../../../contexts/CurrentBillContext';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Button, Col, Footer, Grid, Icon, Item, List, ListItem, Right, Text } from '../../../core';
import { database } from '../../../database';
import { Bill, BillPeriod, tableNames, TablePlanElement } from '../../../models';
import { BillRow } from './BillRow';
import { BillRowEmpty } from './BillRowEmpty';
import { TableElementForm } from './TableElementForm';
import { TableElement, TableViewer } from './TableViewer';

interface SelectBillInnerProps {
  openBills: Bill[];
  tablePlanElements: TablePlanElement[];
}

interface SelectBillOuterProps {
  billPeriod: BillPeriod;
  /**
   * Optional hook in to select bill on change.
   * This is used when navigated to from the sidebar to redirect the user to the checkout page.
   */
  onSelectBill?: (bill: Bill) => void;
}

export const SelectBillInner: React.FC<SelectBillOuterProps & SelectBillInnerProps> = ({
  onSelectBill,
  openBills,
  billPeriod,
  tablePlanElements,
}) => {
  const { setCurrentBill } = useContext(CurrentBillContext);
  const { organization } = useContext(OrganizationContext);
  const [isFilterOpenSelected, setIsFilterOpenSelected] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<TableElement>();

  const bills: (Bill | null)[] = useMemo(() => {
    const filterOpenOnly = bill => (isFilterOpenSelected ? !!bill : true);

    const billsArr = openBills.reduce((acc, bill) => {
      acc[bill.reference - 1] = bill;
      return [...acc];
    }, Array(organization.maxBills).fill(null));

    return billsArr.filter(filterOpenOnly);
  }, [openBills, isFilterOpenSelected]);

  const _onSelectBill = (bill: Bill) => {
    setCurrentBill(bill);
    onSelectBill && onSelectBill(bill);
  };

  const handleCreateSelectBill = async (reference: number) => {
    const bill = await billPeriod.createBill({ reference });
    _onSelectBill(bill);
  };

  const handleDeleteSelectedTableElement = async () => {
    await database.action(() => selectedElement.tablePlanElement?.markAsDeleted());
    setSelectedElement(null);
  };

  const handleSelectElement = (el: TableElement) => {
    if (isEditing) {
      setSelectedElement(el);
    } else {
      const ref = el.tablePlanElement?.billReference;
      if (ref) {
        const bill = openBills.find(bill => bill.reference === ref);
        if (bill) {
          _onSelectBill(bill);
        } else {
          handleCreateSelectBill(ref);
        }
      }
    }
  };

  return (
    <>
      <Item style={{ backgroundColor: 'whitesmoke', padding: 5 }}>
        <Right>
          <Button info small iconLeft onPress={() => setIsEditing(!isEditing)}>
            <Icon name="ios-build-outline" />
            <Text>Toggle Edit View</Text>
          </Button>
        </Right>
      </Item>
      <Grid>
        <Col>
          <TableViewer
            tableElements={tablePlanElements}
            onSelectElement={handleSelectElement}
            selectedElement={selectedElement}
            gridSize={organization.billViewPlanGridSize}
            openBills={openBills}
          />
        </Col>
        <Col style={{ width: 400 }}>
          {isEditing && !selectedElement && <Text style={{ padding: 15 }}>Select a table element to edit...</Text>}
          {isEditing && selectedElement && (
            <TableElementForm
              {...selectedElement}
              maxBills={organization.maxBills}
              onDelete={handleDeleteSelectedTableElement}
            />
          )}

          {!isEditing && (
            <List>
              <ListItem itemHeader first>
                <SwitchSelector
                  options={[
                    { label: 'Show All', value: 0 },
                    { label: 'Show Open', value: 1 },
                  ]}
                  initial={isFilterOpenSelected}
                  onPress={value => setIsFilterOpenSelected(value as number)}
                  style={{ paddingRight: 10 }}
                />
              </ListItem>
              <ScrollView>
                {bills.map((bill, index) => {
                  return bill ? (
                    <BillRow key={bill.id} bill={bill} onSelectBill={_onSelectBill} />
                  ) : (
                    <BillRowEmpty
                      key={'k' + index + 1}
                      reference={index + 1}
                      onCreateSelectBill={handleCreateSelectBill}
                    />
                  );
                })}
              </ScrollView>
            </List>
          )}
        </Col>
      </Grid>
      <Footer>
        <Text style={{ padding: 10 }} note>{`Open bills: ${openBills.length} / ${bills.length}`}</Text>
      </Footer>
    </>
  );
};

export const enhance = c =>
  withDatabase<{}>(
    withObservables<SelectBillOuterProps, SelectBillInnerProps>(['billPeriod'], ({ billPeriod }) => ({
      billPeriod,
      openBills: billPeriod.openBills,
      tablePlanElements: database.collections
        .get<TablePlanElement>(tableNames.tablePlanElement)
        .query()
        .observeWithColumns(['bill_reference', 'type', 'rotation']),
    }))(c),
  );

export const SelectBill = enhance(SelectBillInner);
