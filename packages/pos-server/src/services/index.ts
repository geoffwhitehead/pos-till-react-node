import { userService } from './user';
import { authService } from './auth';
import { LoggerService } from '../loaders/logger';
import { RepositoryService } from '../repositories';
import { MailerService } from './mailer';
import { productService } from './product';
import { maintenanceService } from './maintenance';
import { printerService } from './printer';
import { organizationService } from './organization';
import { EnvConfig } from '../config';
import { printerGroupService } from './printerGroup';
import { CategoryProps } from '../models/Category';
import { DiscountProps } from '../models/Discount';
import { ItemProps } from '../models/Item';
import { ItemModifierProps } from '../models/ItemModifier';
import { ItemPriceProps } from '../models/ItemPrice';
import { ModifierProps } from '../models/Modifier';
import { ModifierItemProps } from '../models/ModifierItem';
import { ModifierPriceProps } from '../models/ModifierPrice';
import { OrganizationProps } from '../models/Organization';
import { PriceGroupProps } from '../models/PriceGroup';
import { PrinterProps } from '../models/Printer';
import { PrinterGroupProps } from '../models/PrinterGroup';
import { RepositoryFns } from '../repositories/utils';
import { loggers } from 'winston';
import { GenericResponseNoData } from '../utils/types';
import { fromClientChanges } from '../utils/sync';
import { stringify } from 'querystring';

export interface InjectedDependencies {
    mailer: MailerService;
    logger: LoggerService;
    repositories: RepositoryService;
    config: EnvConfig;
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code?: string;
        message?: string;
    };
}

// Changes = {
//     [table_name: string]: {
//       created: RawRecord[],
//       updated: RawRecord[],
//       deleted: string[],
//     }
//   }

export type ChangeDocument = Record<string, any> & { id: string };
export type ChangesObject = {
    created: ChangeDocument[];
    updated: ChangeDocument[];
    deleted: string[];
};
export type Changes = Record<string, ChangesObject>;

// type PullChangesResponse = {
//     changes: {
//         categorys: ChangeResponse<CategoryProps>;
//         discounts: ChangeResponse<DiscountProps>;
//         items: ChangeResponse<ItemProps>;
//         item_modifiers: ChangeResponse<ItemModifierProps>;
//         item_prices: ChangeResponse<ItemPriceProps>;
//         modifiers: ChangeResponse<ModifierProps>;
//         modifier_items: ChangeResponse<ModifierItemProps>;
//         modifier_prices: ChangeResponse<ModifierPriceProps>;
//         organizations: ChangeResponse<OrganizationProps>;
//         price_groups: ChangeResponse<PriceGroupProps>;
//         // printers: ChangeResponse<PrinterProps>
//         // printers_groups: ChangeResponse<PrinterGroupProps>
//         // printers_groups_printers: ChangeResponse<asd>
//     };
//     timestamp: Date;
// };

export type ServiceFns = RepositoryService;

type PullChangesRequestParams = {
    lastPulledAt: Date;
    schemaVersion: number;
    migration: null;
};

type PushChangesRequestParams = {
    lastPulledAt: Date;
    changes: Changes;
};

export type SyncFns = {
    pullChanges: (params: PullChangesRequestParams) => Promise<Changes>;
    pushChanges: (params: PushChangesRequestParams) => Promise<void>;
};

export const pull = async <T extends RepositoryFns<any>>(repo: T, lastPulledAt: Date) => {
    const [created, updated, deleted] = await Promise.all([
        repo.createdSince(lastPulledAt),
        repo.updatedSince(lastPulledAt),
        repo.deletedSince(lastPulledAt),
    ]);

    return {
        created,
        updated,
        deleted: deleted.map(({ _id }) => _id),
    };
};

// client wins
export const push = async <T extends RepositoryFns<any>>(repo: T, changes: ChangesObject, lastPulledAt: Date) => {
    await Promise.all(changes.created.map(props => repo.upsert(props)));
    await Promise.all(changes.updated.map(props => repo.upsert(props)));
    await Promise.all(changes.deleted.map(repo.deleteOneById));
};

type Service = { name: string; service: any }; // TODO: figure out how to tpye thiss
const services = [
    {
        name: 'userService',
        service: userService,
    },
    {
        name: 'authService',
        service: authService,
    },
    {
        name: 'productService',
        service: productService,
    },
    {
        name: 'maintenanceService',
        service: maintenanceService,
    },
    {
        name: 'printerService',
        service: printerService,
    },
    {
        name: 'printerGroupService',
        service: printerGroupService,
    },
    {
        name: 'organizationService',
        service: organizationService,
    },
];
export const registerServices = (dependencies: InjectedDependencies): Service[] => {
    return services.map(({ name, service }) => ({ name, service: service(dependencies) }));
};
