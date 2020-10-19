import { InjectedDependencies, SyncFns } from '..';
import { categoryService, CategoryService } from './category';
import { ModifierService, modifierService } from './modifer';
import { ItemService, itemService } from './item';
import { PriceGroupService, priceGroupService } from './priceGroup';
import { DiscountService, discountService } from './discount';
import { itemModifierService, ItemModifierService } from './itemModifier';
import { itemPriceService, ItemPriceService } from './itemPrice';
import { modifierItemService, ModifierItemService } from './modifierItem';
import { modifierPriceService, ModifierPriceService } from './modifierPrice';
import { RepositoryFns } from '../../repositories/utils';

export type CommonServiceFns<T> = {
    findAll: RepositoryFns<T>['findAll'];
    findOne: RepositoryFns<T>['findOne'];
    findByIdAndUpdate: RepositoryFns<T>['findByIdAndUpdate'];
    findById: RepositoryFns<T>['findById'];
    insert: RepositoryFns<T>['insert'];
    create: RepositoryFns<T>['create'];
} & SyncFns<T>;

export interface ProductService {
    category: CategoryService;
    modifier: ModifierService;
    modifierItem: ModifierItemService;
    modifierPrice: ModifierPriceService;
    item: ItemService;
    itemModifier: ItemModifierService;
    itemPrice: ItemPriceService;
    priceGroup: PriceGroupService;
    discount: DiscountService;
}

export const productService = (dependencies: InjectedDependencies): ProductService => {
    const subServices = [
        {
            name: 'category',
            service: categoryService,
        },
        {
            name: 'modifier',
            service: modifierService,
        },
        {
            name: 'modifierItem',
            service: modifierItemService,
        },
        {
            name: 'modifierPrice',
            service: modifierPriceService,
        },
        {
            name: 'item',
            service: itemService,
        },
        {
            name: 'itemModifier',
            service: itemModifierService,
        },
        {
            name: 'itemPrice',
            service: itemPriceService,
        },
        {
            name: 'priceGroup',
            service: priceGroupService,
        },
        {
            name: 'discount',
            service: discountService,
        },
    ];

    return subServices.reduce(
        (out, { name, service }) => ({ ...out, [name]: service(dependencies) }),
        {} as ProductService,
    );
};
