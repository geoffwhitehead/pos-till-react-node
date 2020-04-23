import { CategoryProps } from '../models/Category';
import { InjectedDependencies } from '.';

export interface CategoryService {
    findAll: () => Promise<CategoryProps[]>;
    create: (userProps: CategoryProps) => Promise<CategoryProps>;
    findByIdAndUpdate: (id: string, userProps: Partial<CategoryProps>) => Promise<CategoryProps>;
    findOne: (props: CategoryProps) => Promise<CategoryProps>;
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

    const findByIdAndUpdate = async (id, props) => {
        const category = await categoryRepository.findByIdAndUpdate(id, props);
        return category;
    };

    const findOne = async props => {
        const category = await categoryRepository.findOne(props);
        return category;
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
    };
};
