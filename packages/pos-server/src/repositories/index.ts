import Models from '../models';
import { categoryRepository, CategoryRepository } from './categoryRepository';
import { discountRepository, DiscountRepository } from './discountRepository';
import { ItemModifierRepository, itemModifierRepository } from './itemModifierRepository';
import { ItemPriceRepository, itemPriceRepository } from './itemPriceRepository';
import { ItemRepository, itemRepository } from './itemRepository';
import { ModifierItemPriceRepository, modifierItemPriceRepository } from './modifierItemPriceRepository';
import { ModifierItemRepository, modifierItemRepository } from './modifierItemRepository';
import { ModifierRepository, modifierRepository } from './modifierRepository';
import { organizationRepository, OrganizationRepository } from './organizationRepository';
import { paymentTypeRepository, PaymentTypeRepository } from './paymentTypeRepository';
import { priceGroupRepository, PriceGroupRepository } from './priceGroupRepository';
import { printerGroupPrinterRepository, PrinterGroupPrinterRepository } from './printerGroupPrinterRepository';
import { PrinterGroupRepository, printerGroupRepository } from './printerGroupRepository';
import { printerRepository, PrinterRepository } from './printerRepository';
import { userRepository, UserRepository } from './userRepository';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
    categoryRepository: CategoryRepository;
    discountRepository: DiscountRepository;
    priceGroupRepository: PriceGroupRepository;
    modifierRepository: ModifierRepository;
    modifierItemRepository: ModifierItemRepository;
    modifierItemPriceRepository: ModifierItemPriceRepository;
    itemRepository: ItemRepository;
    itemModifierRepository: ItemModifierRepository;
    itemPriceRepository: ItemPriceRepository;
    printerRepository: PrinterRepository;
    printerGroupRepository: PrinterGroupRepository;
    printerGroupPrinterRepository: PrinterGroupPrinterRepository;
    paymentTypeRepository: PaymentTypeRepository;
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
        ModifierItemPriceModel: typeof Models.ModifierItemPrice;
        ItemModel: typeof Models.Item;
        ItemModifierModel: typeof Models.ItemModifier;
        ItemPriceModel: typeof Models.ItemPrice;
        PrinterModel: typeof Models.Printer;
        PrinterGroupModel: typeof Models.PrinterGroup;
        PrinterGroupPrinterModel: typeof Models.PrinterGroupPrinter;
        PaymentTypeModel: typeof Models.PaymentType;
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
        ModifierItemPriceModel: Models.ModifierItemPrice,
        ItemModel: Models.Item,
        ItemPriceModel: Models.ItemPrice,
        ItemModifierModel: Models.ItemModifier,
        PrinterModel: Models.Printer,
        PrinterGroupModel: Models.PrinterGroup,
        PrinterGroupPrinterModel: Models.PrinterGroupPrinter,
        PaymentTypeModel: Models.PaymentType,
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
            name: 'modifierItemPriceRepository',
            repo: modifierItemPriceRepository,
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
        {
            name: 'paymentTypeRepository',
            repo: paymentTypeRepository,
        },
    ];

    return repositories.reduce((out, { name, repo }) => {
        return {
            ...out,
            [name]: repo({ models }),
        };
    }, {} as RepositoryService);
};
