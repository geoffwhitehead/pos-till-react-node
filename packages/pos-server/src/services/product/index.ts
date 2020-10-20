import { InjectedDependencies, SyncFns } from '..';
import { categoryService, CategoryService } from './category';
import { ModifierService, modifierService } from './modifer';
import { ItemService, itemService } from './item';
import { PriceGroupService, priceGroupService } from './priceGroup';
import { DiscountService, discountService } from './discount';
import { RepositoryFns } from '../../repositories/utils';

export type CommonServiceFns<T> = {
    findAll: RepositoryFns<T>['findAll'];
    findOne: RepositoryFns<T>['findOne'];
    findByIdAndUpdate: RepositoryFns<T>['findByIdAndUpdate'];
    findById: RepositoryFns<T>['findById'];
    insert: RepositoryFns<T>['insert'];
    create: RepositoryFns<T>['create'];
} & SyncFns;

export interface ProductService {
    category: CategoryService;
    modifier: ModifierService;
    item: ItemService;
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
            name: 'item',
            service: itemService,
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
