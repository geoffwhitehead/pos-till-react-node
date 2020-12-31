import { InjectedDependencies, pull, push } from '.';
import { TablePlanElementProps, TABLE_PLAN_ELEMENT_COLLECTION_NAME } from '../models/TablePlanElement';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type TablePlanService = CommonServiceFns<TablePlanElementProps>;

export const tablePlanService = ({
    repositories: { tablePlanElementRepository },
    logger,
}: InjectedDependencies): TablePlanService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const tablePlanElements = await pull(tablePlanElementRepository, lastPulledAt);

        return toClientChanges({
            [TABLE_PLAN_ELEMENT_COLLECTION_NAME]: tablePlanElements,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await push(tablePlanElementRepository, changes[TABLE_PLAN_ELEMENT_COLLECTION_NAME], lastPulledAt);
    };

    return {
        ...tablePlanElementRepository, // TODO:
        pullChanges,
        pushChanges,
    };
};
