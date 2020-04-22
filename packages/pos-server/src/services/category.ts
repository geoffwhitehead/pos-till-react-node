import { CategoryProps } from '../models/Category';
import { InjectedDependencies } from '.';

export interface CategoryService {
    findAll: () => Promise<CategoryProps[]>;
    create: (userProps: CategoryProps) => Promise<CategoryProps>;
    updateById: (id: string, userProps: Partial<CategoryProps>) => Promise<CategoryProps>;
}

export const categoryService = ({
    repositories: { categoryRepository },
    logger,
}: InjectedDependencies): CategoryService => {
    const findAll: CategoryService['findAll'] = async () => await categoryRepository.findAll();
    const create = async props => {
        const category = await categoryRepository.create(props);
        logger.info('Category created');
        return category;
    };

    const updateById = async (id, props) => {
        const category = await categoryRepository.findByIdAndUpdate(id, props);
        return category;
    };

    return {
        findAll,
        create,
        updateById,
    };
};
