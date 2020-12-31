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
