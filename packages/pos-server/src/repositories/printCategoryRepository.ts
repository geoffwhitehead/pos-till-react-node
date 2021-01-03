import { InjectedRepositoryDependencies } from '.';
import { PrintCategoryProps } from '../models/PrintCategory';
import { repository, RepositoryFns } from './utils';

export type PrintCategoryRepository = RepositoryFns<PrintCategoryProps>;

export const printCategoryRepository = ({ models: { PrintCategoryModel } }: InjectedRepositoryDependencies) =>
    repository<PrintCategoryProps, PrintCategoryRepository>({
        model: PrintCategoryModel,
        fns: fns => fns,
    });
