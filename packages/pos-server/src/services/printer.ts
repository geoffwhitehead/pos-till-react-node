import { InjectedDependencies } from '.';
import { RepositoryFns } from '../repositories/utils';
import { PrinterProps } from '../models/Printer';

export type PrinterService = RepositoryFns<PrinterProps>;

export const printerService = ({
    repositories: { printerRepository },
    logger,
}: InjectedDependencies): PrinterService => {
    console.log('printerRepository', printerRepository);
    return printerRepository;
};
