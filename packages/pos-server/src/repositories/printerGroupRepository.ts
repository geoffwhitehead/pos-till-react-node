import { InjectedRepositoryDependencies } from '.';
import { PrinterGroupProps } from '../models/PrinterGroup';
import { RepositoryFns, repository } from './utils';

export type PrinterGroupRepository = RepositoryFns<PrinterGroupProps> & {};

export const printerGroupRepository = ({ models: { PrinterGroupModel } }: InjectedRepositoryDependencies) =>
    repository<PrinterGroupProps, PrinterGroupRepository>({
        model: PrinterGroupModel,
        fns: fns => fns,
    });
