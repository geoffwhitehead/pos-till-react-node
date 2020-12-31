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
  'table:4:square' = 'Table: 4 Square',
  'table:2:round' = 'Table: 2 Round',
  'table:4' = 'Table: 4',
  'block:grey' = 'Block: Grey',
  'block:wallgrey' = 'Block: Wall Grey',
  'furniture:armchair' = 'Furniture: Armchair',
  'furniture:coffeetable' = 'Furniture: Coffee Table',
  'furniture:cupboard' = 'Furniture: Cupboard',
  'furniture:door' = 'Furniture: Door',
  'furniture:extractor' = 'Furniture: Extractor',
  'furniture:plant1' = 'Furniture: Plant 1',
  'furniture:plant2' = 'Furniture: Plant 2',
  'furniture:plant3' = 'Furniture: Plant 3',
  'furniture:plant4' = 'Furniture: Plant 4',
  'furniture:chair' = 'Furniture: Chair',
  'furniture:drawers' = 'Furniture: Drawers',
  'furniture:sink' = 'Furniture: Sink',
  'furniture:sofacorner' = 'Furniture: Sofa Corner',
  'furniture:sofa' = 'Furniture: Sofa',
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
