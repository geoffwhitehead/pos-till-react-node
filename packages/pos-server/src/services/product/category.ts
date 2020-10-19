import { CategoryProps } from '../../models/Category';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type CategoryService = CommonServiceFns<CategoryProps>;

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

    const findByIdAndUpdate = async (_id, props) => {
        const category = await categoryRepository.findByIdAndUpdate(_id, props);
        return category;
    };

    const findOne = async props => {
        const category = await categoryRepository.findOne(props);
        return category;
    };

    const findById = async _id => categoryRepository.findById(_id);
    const insert = async docs => {
        const success = await categoryRepository.insert(docs);
        logger.info('Inserted categories created');
        return success;
    };

    const pullChanges = async lastPulledAt => {
        const [created, updated, deleted] = await Promise.all([
            categoryRepository.createdSince(lastPulledAt),
            categoryRepository.updatedSince(lastPulledAt),
            categoryRepository.deletedSince(lastPulledAt),
        ]);

        return {
            created,
            updated,
            deleted: deleted.map(({ _id }) => _id),
        };
    };
    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert,
        pullChanges,
    };
};
