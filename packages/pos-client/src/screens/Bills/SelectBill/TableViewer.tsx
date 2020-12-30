import { Dictionary, groupBy, keyBy, times } from 'lodash';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Col, Grid, Row } from '../../../core';
import { TablePlanElement } from '../../../models';

type TableViewerProps = { tableElements: TablePlanElement[]; onSelectElement: (el: TableElement) => void };

export type TableElement = {
  x: number;
  y: number;
  tablePlanElement?: TablePlanElement;
};

const gridSize = 15;
const GRID_SPACING = 4;

export const TableViewer: React.FC<TableViewerProps> = ({ tableElements, onSelectElement }) => {
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

  return (
    <Grid style={styles.grid}>
      {times(gridSize, row => {
        return (
          <Row key={row} style={styles.row}>
            {times(gridSize, column => {
              const el = groupedByXY?.[row]?.[column];
              return (
                <Col key={`${row}-${column}`} style={styles.col}>
                  {el && (
                    <Button
                      style={{ ...styles.button, backgroundColor: 'pink' }}
                      onPress={() => {
                        onSelectElement({ x: row, y: column, tablePlanElement: el });
                      }}
                    />
                  )}
                  {!el && (
                    <Button
                      style={{ ...styles.button, backgroundColor: 'yellow' }}
                      onPress={() => {
                        onSelectElement({ x: row, y: column, tablePlanElement: el });
                      }}
                    />
                  )}
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
});
