import { InjectedDependencies } from '..';
import { categoryService, CategoryService } from './category';

export interface ProductService {
    category: CategoryService;
}

export const productService = (dependencies: InjectedDependencies): ProductService => {
    const subServices = [
        {
            name: 'category',
            service: categoryService,
        },
    ];

    return subServices.reduce(
        (out, { name, service }) => ({ ...out, [name]: service(dependencies) }),
        {} as ProductService,
    );
};
