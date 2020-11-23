import uuid from 'uuid';
import { InjectedDependencies, pull, push } from '.';
import { PrinterProps, PRINTER_COLLECTION_NAME } from '../models/Printer';
import { PrinterGroupProps, PRINTER_GROUP_COLLECTION_NAME } from '../models/PrinterGroup';
import { PRINTER_GROUP_PRINTER_COLLECTION_NAME } from '../models/PrinterGroupPrinter';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type PrinterService = CommonServiceFns<PrinterProps> & {
    seed: () => Promise<{
        printers: PrinterProps[];
        printerGroups: PrinterGroupProps[];
    }>;
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

    const seed = async () => {
        const defaultPrinters = [
            {
                _id: uuid(),
                name: 'Star SP700',
                address: 'TCP:192.168.1.84',
                emulation: 'StarDotImpact',
                printWidth: 14,
            } as const,
            {
                _id: uuid(),
                name: 'Star TSP100',
                address: 'TCP:192.168.1.78',
                emulation: 'StarGraphic',
                printWidth: 39,
            } as const,
        ];

        const printers = await printerRepository.insert(defaultPrinters);

        const defaultGroups = [
            {
                _id: uuid(),
                name: 'Starter',
            },
            {
                _id: uuid(),
                name: 'Kitchen',
            },
        ];
        const printerGroups = await printerGroupRepository.insert(defaultGroups);

        await printerGroupPrinterRepository.insert(
            defaultGroups.map(group => ({
                printerGroupId: group._id,
                printerId: defaultPrinters[1]._id,
            })),
        );

        return {
            printers,
            printerGroups,
        };
    };

    return {
        ...printerRepository, // TODO:
        pullChanges,
        pushChanges,
        seed,
    };
};
