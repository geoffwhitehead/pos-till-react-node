import { InjectedRepositoryDependencies } from '.';
import { CategoryProps } from '../models/Category';
import { RepositoryFns, repository } from './utils';

export type CategoryRepository = RepositoryFns<CategoryProps> & {};

export const categoryRepository = ({ models: { CategoryModel } }: InjectedRepositoryDependencies) =>
    repository<CategoryProps, CategoryRepository>({
        model: CategoryModel,
        fns: fns => fns,
    });
