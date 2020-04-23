import { InjectedDependencies } from '..';
import { categoryService, CategoryService } from './category';
import { ModifierService, modifierService } from './modifer';
import { ItemService, itemService } from './item';
import { PriceGroupService, priceGroupService } from './priceGroup';
import { DiscountService, discountService } from './discount';

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
