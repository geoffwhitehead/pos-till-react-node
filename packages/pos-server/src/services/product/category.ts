import { CategoryProps } from '../../models/Category';
import { InjectedDependencies } from '..';
import { RepositoryFns } from '../../repositories/utils';

export type CategoryService = RepositoryFns<CategoryProps>;

export const categoryService = ({
    repositories: { categoryRepository },
    logger,
}: InjectedDependencies): CategoryService => {
    const findAll = async () => await categoryRepository.findAll();
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

    const findById = async id => categoryRepository.findById(id);
    const insert = async docs => {
        const success = await categoryRepository.insert(docs);
        logger.info('Inserted categories created');
        return success;
    };
    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert,
    };
};
