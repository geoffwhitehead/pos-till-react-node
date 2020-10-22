import { InjectedRepositoryDependencies } from '.';
import { PrinterGroupPrinterProps } from '../models/PrinterGroupPrinter';
import { RepositoryFns, repository } from './utils';

export type PrinterGroupPrinterRepository = RepositoryFns<PrinterGroupPrinterProps>;

export const printerGroupPrinterRepository = ({
    models: { PrinterGroupPrinterModel },
}: InjectedRepositoryDependencies) =>
    repository<PrinterGroupPrinterProps, PrinterGroupPrinterRepository>({
        model: PrinterGroupPrinterModel,
        fns: fns => fns,
    });
