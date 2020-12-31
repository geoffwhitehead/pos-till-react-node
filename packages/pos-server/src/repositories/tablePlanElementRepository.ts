import { InjectedRepositoryDependencies } from '.';
import { TablePlanElementProps } from '../models/TablePlanElement';
import { repository, RepositoryFns } from './utils';

export type TablePlanElementRepository = RepositoryFns<TablePlanElementProps> & {};

export const tablePlanElementRepository = ({ models: { TablePlanElementModel } }: InjectedRepositoryDependencies) =>
    repository<TablePlanElementProps, TablePlanElementRepository>({
        model: TablePlanElementModel,
        fns: fns => fns,
    });
