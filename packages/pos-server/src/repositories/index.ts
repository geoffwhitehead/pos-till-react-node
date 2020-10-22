import Models from '../models';
import { userRepository, UserRepository } from './userRepository';
import { organizationRepository, OrganizationRepository } from './organizationRepository';
import { categoryRepository, CategoryRepository } from './categoryRepository';
import { discountRepository, DiscountRepository } from './discountRepository';
import { priceGroupRepository, PriceGroupRepository } from './priceGroupRepository';
import { ModifierRepository, modifierRepository } from './modifierRepository';
import { ModifierItemRepository, modifierItemRepository } from './modifierItemRepository';
import { ModifierPriceRepository, modifierPriceRepository } from './modifierPriceRepository';
import { ItemRepository, itemRepository } from './itemRepository';
import { ItemModifierRepository, itemModifierRepository } from './itemModifierRepository';
import { ItemPriceRepository, itemPriceRepository } from './itemPriceRepository';
import { printerRepository, PrinterRepository } from './printerRepository';
import { PrinterGroupRepository, printerGroupRepository } from './printerGroupRepository';
import { printerGroupPrinterRepository, PrinterGroupPrinterRepository } from './printerGroupPrinterRepository';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
    categoryRepository: CategoryRepository;
    discountRepository: DiscountRepository;
    priceGroupRepository: PriceGroupRepository;
    modifierRepository: ModifierRepository;
    modifierItemRepository: ModifierItemRepository;
    modifierPriceRepository: ModifierPriceRepository;
    itemRepository: ItemRepository;
    itemModifierRepository: ItemModifierRepository;
    itemPriceRepository: ItemPriceRepository;
    printerRepository: PrinterRepository;
    printerGroupRepository: PrinterGroupRepository;
    printerGroupPrinterRepository: PrinterGroupPrinterRepository;
}

export interface InjectedRepositoryDependencies {
    models: {
        OrganizationModel: typeof Models.Organization;
        UserModel: typeof Models.User;
        CategoryModel: typeof Models.Category;
        DiscountModel: typeof Models.Discount;
        PriceGroupModel: typeof Models.PriceGroup;
        ModifierModel: typeof Models.Modifier;
        ModifierItemModel: typeof Models.ModifierItem;
        ModifierPriceModel: typeof Models.ModifierPrice;
        ItemModel: typeof Models.Item;
        ItemModifierModel: typeof Models.ItemModifier;
        ItemPriceModel: typeof Models.ItemPrice;
        PrinterModel: typeof Models.Printer;
        PrinterGroupModel: typeof Models.PrinterGroup;
        PrinterGroupPrinterModel: typeof Models.PrinterGroupPrinter;
    };
}

export const registerRepositories = (): RepositoryService => {
    const models = {
        OrganizationModel: Models.Organization, // tenantless
        UserModel: Models.User,
        CategoryModel: Models.Category,
        DiscountModel: Models.Discount,
        PriceGroupModel: Models.PriceGroup,
        ModifierModel: Models.Modifier,
        ModifierItemModel: Models.ModifierItem,
        ModifierPriceModel: Models.ModifierPrice,
        ItemModel: Models.Item,
        ItemPriceModel: Models.ItemPrice,
        ItemModifierModel: Models.ItemModifier,
        PrinterModel: Models.Printer,
        PrinterGroupModel: Models.PrinterGroup,
        PrinterGroupPrinterModel: Models.PrinterGroupPrinter,
    };

    const repositories = [
        {
            name: 'userRepository',
            repo: userRepository,
        },
        {
            name: 'organizationRepository',
            repo: organizationRepository,
        },
        {
            name: 'categoryRepository',
            repo: categoryRepository,
        },
        {
            name: 'priceGroupRepository',
            repo: priceGroupRepository,
        },
        {
            name: 'modifierRepository',
            repo: modifierRepository,
        },
        {
            name: 'modifierItemRepository',
            repo: modifierItemRepository,
        },
        {
            name: 'modifierPriceRepository',
            repo: modifierPriceRepository,
        },
        {
            name: 'discountRepository',
            repo: discountRepository,
        },
        {
            name: 'itemRepository',
            repo: itemRepository,
        },
        {
            name: 'itemPriceRepository',
            repo: itemPriceRepository,
        },
        {
            name: 'itemModifierRepository',
            repo: itemModifierRepository,
        },
        {
            name: 'printerRepository',
            repo: printerRepository,
        },
        {
            name: 'printerGroupRepository',
            repo: printerGroupRepository,
        },
        {
            name: 'printerGroupPrinterRepository',
            repo: printerGroupPrinterRepository,
        },
    ];

    return repositories.reduce((out, { name, repo }) => {
        return {
            ...out,
            [name]: repo({ models }),
        };
    }, {} as RepositoryService);
};
