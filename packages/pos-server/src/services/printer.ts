import { InjectedDependencies, pull, push, SyncFns } from '.';
import { RepositoryFns } from '../repositories/utils';
import { PrinterProps, PRINTER_COLLECTION_NAME } from '../models/Printer';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type PrinterService = CommonServiceFns<PrinterProps> & SyncFns;

export const printerService = ({
    repositories: { printerRepository },
    logger,
}: InjectedDependencies): PrinterService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const priceGroups = await pull(printerRepository, lastPulledAt);

        return toClientChanges({
            [PRINTER_COLLECTION_NAME]: priceGroups,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await push(printerRepository, changes[PRINTER_COLLECTION_NAME], lastPulledAt);
    };
    return {
        ...printerRepository, // TODO
        pullChanges,
        pushChanges,
    };
};
