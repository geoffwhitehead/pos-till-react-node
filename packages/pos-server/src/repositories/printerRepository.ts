import { InjectedRepositoryDependencies } from '.';
import { PrinterProps } from '../models/Printer';
import { RepositoryFns, repository } from './utils';

export type PrinterRepository = RepositoryFns<PrinterProps> & {};

export const printerRepository = ({ models: { PrinterModel } }: InjectedRepositoryDependencies) =>
    repository<PrinterProps, PrinterRepository>({
        model: PrinterModel,
        fns: fns => fns,
    });
