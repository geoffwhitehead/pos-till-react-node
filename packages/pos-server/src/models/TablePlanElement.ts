import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface TablePlanElementProps {
    _id?: string;
    billReference?: number;
    type: string;
    posX: number;
    posY: number;
    rotation: number;
}

export enum TablePlanElementTypes {
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

export const TABLE_PLAN_ELEMENT_COLLECTION_NAME = 'table_plan_element';

const TablePlanElementSchema: Schema<TablePlanElementProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        billReference: {
            type: Number,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
        posX: {
            type: Number,
            required: true,
        },
        posY: {
            type: Number,
            required: true,
        },
        rotation: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: false, collection: TABLE_PLAN_ELEMENT_COLLECTION_NAME },
);

const TablePlanElement = tenantModel<TablePlanElementProps>('TablePlanElement', TablePlanElementSchema);

export { TablePlanElement };
