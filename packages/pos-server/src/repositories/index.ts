import Models from '../models';
import { userRepository, UserRepository } from './userRepository';
import { organizationRepository, OrganizationRepository } from './organizationRepository';
import { categoryRepository, CategoryRepository } from './categoryRepository';
import { discountRepository, DiscountRepository } from './discountRepository';
import { priceGroupRepository, PriceGroupRepository } from './priceGroupRepository';
import { ModifierRepository, modifierRepository } from './modifierRepository';
import { ItemRepository, itemRepository } from './itemRepository';
import { printerRepository, PrinterRepository } from './printerRepository';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
    categoryRepository: CategoryRepository;
    discountRepository: DiscountRepository;
    priceGroupRepository: PriceGroupRepository;
    modifierRepository: ModifierRepository;
    itemRepository: ItemRepository;
    printerRepository: PrinterRepository;
}

export interface InjectedRepositoryDependencies {
    models: {
        OrganizationModel: typeof Models.Organization;
        UserModel: typeof Models.User;
        CategoryModel: typeof Models.Category;
        DiscountModel: typeof Models.Discount;
        PriceGroupModel: typeof Models.PriceGroup;
        ModifierModel: typeof Models.Modifier;
        ItemModel: typeof Models.Item;
        PrinterModel: typeof Models.Printer;
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
        ItemModel: Models.Item,
        PrinterModel: Models.Printer,
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
            name: 'discountRepository',
            repo: discountRepository,
        },
        {
            name: 'itemRepository',
            repo: itemRepository,
        },
        {
            name: 'printerRepository',
            repo: printerRepository,
        },
    ];

    return repositories.reduce((out, { name, repo }) => {
        return {
            ...out,
            [name]: repo({ models }),
        };
    }, {} as RepositoryService);
};
