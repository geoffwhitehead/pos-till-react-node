import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export type TablePlanElementProps = {
  billReference?: number;
  type: string;
  posX: number;
  posY: number;
  rotation: number;
};

// wall color: #A2A2A2
export enum TablePlanElementTypes {
  'table:4:square' = 'table:4:square',
  'table:2:round' = 'table:2:round',
  'table:4' = 'table:4',
  'block:wall' = 'block:wall',
  'block:wall:corner' = 'block:wall:corner',
  'block:wall:center' = 'block:wall:center',
  'block:wall:square' = 'block:wall:square',
  'block:window' = 'block:window',
  'furniture:armchair' = 'furniture:armchair',
  'furniture:coffeetable' = 'furniture:coffeetable',
  'furniture:cupboard' = 'furniture:cupboard',
  'furniture:door' = 'furniture:door',
  'furniture:extractor' = 'furniture:extractor',
  'furniture:plant1' = 'furniture:plant1',
  'furniture:plant2' = 'furniture:plant2',
  'furniture:plant3' = 'furniture:plant3',
  'furniture:plant4' = 'furniture:plant4',
  'furniture:chair' = 'furniture:chair',
  'furniture:drawers' = 'furniture:drawers',
  'furniture:sink' = 'furniture:sink',
  'furniture:sofacorner' = 'furniture:sofacorner',
  'furniture:sofa' = 'furniture:sofa',
}

export enum TablePlanElementTypeLabels {
  'table:4:square' = 'Table: 4 Square',
  'table:2:round' = 'Table: 2 Round',
  'table:4' = 'Table: 4',
  'block:wall' = 'Block: Wall',
  'block:wall:corner' = 'Block: Wall Corner',
  'block:wall:center' = 'Block: Wall Center',
  'block:wall:square' = 'Block: Wall Square',
  'block:window' = 'Block: Window',
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
  '90 Degrees' = '90',
  '180 Degrees' = '180',
  '270 Degrees' = '270',
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
