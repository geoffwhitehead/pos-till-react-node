import { InjectedDependencies, pull, push, SyncFns } from '.';
import { RepositoryFns } from '../repositories/utils';
import { PrinterGroupProps, PRINTER_GROUP_COLLECTION_NAME } from '../models/PrinterGroup';
import { toClientChanges } from '../utils/sync';
import { PRINTER_GROUP_PRINTER_COLLECTION_NAME } from '../models/PrinterGroupPrinter';
import { CommonServiceFns } from './product';

export type PrinterGroupService = CommonServiceFns<PrinterGroupProps> & SyncFns;
export const printerGroupService = ({
    repositories: { printerGroupRepository, printerGroupPrinterRepository },
    logger,
}: InjectedDependencies): PrinterGroupService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const [printerGroups, printerGroupPrinters] = await Promise.all([
            pull(printerGroupRepository, lastPulledAt),
            pull(printerGroupPrinterRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [PRINTER_GROUP_COLLECTION_NAME]: printerGroups,
            [PRINTER_GROUP_PRINTER_COLLECTION_NAME]: printerGroupPrinters,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await Promise.all([
            push(printerGroupRepository, changes[PRINTER_GROUP_COLLECTION_NAME], lastPulledAt),
            push(printerGroupPrinterRepository, changes[PRINTER_GROUP_PRINTER_COLLECTION_NAME], lastPulledAt),
        ]);
    };

    return {
        ...printerGroupRepository, // TODO
        pullChanges,
        pushChanges,
    };
};
