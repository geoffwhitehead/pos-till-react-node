import { Dictionary, groupBy, keyBy, times } from 'lodash';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FurnArmchair from '../../../assets/armchair.svg';
import FurnChair from '../../../assets/chair.svg';
import FurnCoffeeTable from '../../../assets/coffee-table.svg';
import FurnCupboard from '../../../assets/cupboard.svg';
import FurnDoor from '../../../assets/door.svg';
import FurnDrawers from '../../../assets/drawers.svg';
import FurnExtractor from '../../../assets/extractor-hood.svg';
import FurnPlant2 from '../../../assets/plant-1.svg';
import FurnPlant3 from '../../../assets/plant-2.svg';
import FurnPlant4 from '../../../assets/plant-3.svg';
import FurnPlant1 from '../../../assets/plant.svg';
import FurnSink from '../../../assets/sink.svg';
import FurnSofaCorner from '../../../assets/sofa-corner.svg';
import FurnSofa from '../../../assets/sofa.svg';
import Table2Round from '../../../assets/table2-col.svg';
import Table4 from '../../../assets/table4-col.svg';
import Table4Square from '../../../assets/table4-sq-col.svg';
import { default as BlockGrey, default as BlockWallGrey } from '../../../assets/wall-grey.svg';
import { Button, Col, Grid, Row } from '../../../core';
import { TablePlanElement } from '../../../models';
import { TablePlanElementTypes } from '../../../models/TablePlanElement';

type TableViewerProps = {
  selectedElement: TableElement;
  tableElements: TablePlanElement[];
  onSelectElement: (el: TableElement) => void;
};

export type TableElement = {
  x: number;
  y: number;
  tablePlanElement?: TablePlanElement;
};

const gridSize = 10;
const GRID_SPACING = 4;

export const TableViewer: React.FC<TableViewerProps> = ({ selectedElement, tableElements, onSelectElement }) => {
  const groupedByXY = useMemo(() => {
    const groupedByX = groupBy(tableElements, el => el.posX);
    const groupedByPosition = Object.entries(groupedByX).reduce((out, [key, groupX]) => {
      return {
        ...out,
        [key]: keyBy(groupX, el => el.posY),
      };
    }, {} as Dictionary<Dictionary<TablePlanElement>>);
    return groupedByPosition;
  }, [tableElements]);
  console.log('selectedElement', selectedElement);

  const determineElement = (el: TablePlanElement) => {
    console.log('Type ', el.type);
    const typeLabel = TablePlanElementTypes[el.type];
    switch (typeLabel) {
      case TablePlanElementTypes['block:wallgrey']:
        return BlockWallGrey;
      case TablePlanElementTypes['table:4:square']:
        return Table4Square;
      case TablePlanElementTypes['table:2:round']:
        return Table2Round;
      case TablePlanElementTypes['table:4']:
        return Table4;
      case TablePlanElementTypes['block:grey']:
        return BlockGrey;
      case TablePlanElementTypes['furniture:armchair']:
        return FurnArmchair;
      case TablePlanElementTypes['furniture:coffeetable']:
        return FurnCoffeeTable;
      case TablePlanElementTypes['furniture:cupboard']:
        return FurnCupboard;
      case TablePlanElementTypes['furniture:door']:
        return FurnDoor;
      case TablePlanElementTypes['furniture:extractor']:
        return FurnExtractor;
      case TablePlanElementTypes['furniture:plant1']:
        return FurnPlant1;
      case TablePlanElementTypes['furniture:plant2']:
        return FurnPlant2;
      case TablePlanElementTypes['furniture:plant3']:
        return FurnPlant3;
      case TablePlanElementTypes['furniture:plant4']:
        return FurnPlant4;
      case TablePlanElementTypes['furniture:chair']:
        return FurnChair;
      case TablePlanElementTypes['furniture:drawers']:
        return FurnDrawers;
      case TablePlanElementTypes['furniture:sink']:
        return FurnSink;
      case TablePlanElementTypes['furniture:sofacorner']:
        return FurnSofaCorner;
      case TablePlanElementTypes['furniture:sofa']:
        return FurnSofa;
      default:
        return null;
    }
  };

  return (
    <Grid style={styles.grid}>
      {times(gridSize, row => {
        return (
          <Row key={row} style={styles.row}>
            {times(gridSize, column => {
              const el = groupedByXY?.[row]?.[column];
              const SVG = el ? determineElement(el) : null;
              const isSelected = selectedElement && selectedElement.y === column && selectedElement.x === row;
              const selectedStyles = isSelected ? styles.selected : {};

              return (
                <Col key={`${row}-${column}`} style={{ ...styles.col, ...selectedStyles }}>
                  <TouchableOpacity
                    onPress={() => {
                      onSelectElement({ x: row, y: column, tablePlanElement: el || null });
                    }}
                  >
                    {el && SVG && <SVG width="100%" height="100%" rotation={3} />}
                    {!el && <Button light style={{ ...styles.button, backgroundColor: 'white' }} />}
                  </TouchableOpacity>
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Grid>
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: GRID_SPACING,
    height: '100%',
    width: '100%',
  },
  row: {
    // paddingTop: GRID_SPACING,
    // paddingBottom: GRID_SPACING,
  },
  col: {
    // paddingLeft: GRID_SPACING,
    // paddingRight: GRID_SPACING,
    borderColor: 'whitesmoke',
    borderWidth: 1,
  },
  button: {
    height: '100%',
    width: '100%',
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  selected: {
    borderColor: 'red',
  },
});
