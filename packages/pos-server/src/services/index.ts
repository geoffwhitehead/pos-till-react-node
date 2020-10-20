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

type Changes = Record<string, { created: any; updated: any; deleted: any }>;

export enum MONGO_TO_SQL_TABLE_MAP {
    categories = 'categories',
    discounts = 'discounts',
    items = 'items',
    itemModifiers = 'item_modifiers',
    itemPrices = 'item_prices',
    modifiers = 'modifiers',
    modifierItems = 'modifierItems',
    modifierPrices = 'modifierPrices',
    organizations = 'organizations',
    priceGroups = 'price_groups',
    printers = 'printers',
    printerGroups = 'printer_groups',
    printersGroupsPrinters = 'printer_groups_printers',
}
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
export type SyncFns = {
    pullChanges: (lastPulledAt: Date) => Promise<Changes>;
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
