import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export type TablePlanElementProps = {
  billReference?: number;
  type: string;
  posX: number;
  posY: number;
  rotation: number;
};

export enum TablePlanElementTypes {
  'Table: 2' = 'table:2',
  'Table: 4' = 'table:4',
}

export enum TablePlanElementRotations {
  '0 Degrees' = '0',
  '45 Degrees' = '45',
  '90 Degrees' = '90',
  '135 Degrees' = '135',
  '180 Degrees' = '180',
  '225 Degrees' = '225',
  '270 Degrees' = '270',
  '315 Degrees' = '315',
}

export class TablePlanElement extends Model {
  static table = 'table_plan_element';

  @field('bill_reference') billReference: number;
  @field('type') type: string;
  @field('pos_x') posX: number;
  @field('pos_y') posY: number;
  @field('rotation') rotation: number;
}

export const tablePlanElementSchema = tableSchema({
  name: 'table_plan_element',
  columns: [
    { name: 'bill_reference', type: 'number', isOptional: true },
    { name: 'type', type: 'string' },
    { name: 'pos_x', type: 'number' },
    { name: 'pos_y', type: 'number' },
    { name: 'rotation', type: 'number' },
  ],
});
