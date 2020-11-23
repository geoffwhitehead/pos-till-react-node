import { InjectedDependencies, pull, push, SyncFns } from '.';
import { PrinterProps, PRINTER_COLLECTION_NAME } from '../models/Printer';
import { PRINTER_GROUP_COLLECTION_NAME } from '../models/PrinterGroup';
import { PRINTER_GROUP_PRINTER_COLLECTION_NAME } from '../models/PrinterGroupPrinter';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type PrinterService = CommonServiceFns<PrinterProps> &
    SyncFns & {
        seed: () => void;
    };

export const printerService = ({
    repositories: { printerRepository, printerGroupRepository, printerGroupPrinterRepository },
    logger,
}: InjectedDependencies): PrinterService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const [printerGroups, printerGroupPrinters, printers] = await Promise.all([
            pull(printerGroupRepository, lastPulledAt),
            pull(printerGroupPrinterRepository, lastPulledAt),
            pull(printerRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [PRINTER_GROUP_COLLECTION_NAME]: printerGroups,
            [PRINTER_GROUP_PRINTER_COLLECTION_NAME]: printerGroupPrinters,
            [PRINTER_COLLECTION_NAME]: printers,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await Promise.all([
            push(printerGroupRepository, changes[PRINTER_GROUP_COLLECTION_NAME], lastPulledAt),
            push(printerGroupPrinterRepository, changes[PRINTER_GROUP_PRINTER_COLLECTION_NAME], lastPulledAt),
            push(printerRepository, changes[PRINTER_COLLECTION_NAME], lastPulledAt),
        ]);
    };

    const seed = async ({}) => {};

    return {
        ...printerRepository, // TODO:
        pullChanges,
        pushChanges,
        seed,
    };
};
