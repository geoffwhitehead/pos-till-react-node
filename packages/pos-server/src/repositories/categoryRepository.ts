import { InjectedRepositoryDependencies, repository, RepositoryFns } from '.';
import { CategoryProps } from '../models/Category';

export type CategoryRepository = RepositoryFns<CategoryProps> & {};

export const categoryRepository = ({ models: { CategoryModel } }: InjectedRepositoryDependencies) =>
    repository<CategoryProps, CategoryRepository>({
        model: CategoryModel,
        fns: fns => fns,
    });
