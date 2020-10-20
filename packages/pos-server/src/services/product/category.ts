import { CategoryProps } from '../../models/Category';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP, pull, push } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';

export type CategoryService = CommonServiceFns<CategoryProps>;

export type CategoryClientProps = {
    name: string;
    short_name: string;
};

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
        const categories = await pull(categoryRepository, lastPulledAt);

        return toClientChanges({
            [MONGO_TO_SQL_TABLE_MAP.categories]: categories,
        });
    };

    const pushChanges = async (lastPulledAt, changes) => {
        try {
            await push(categoryRepository, changes, lastPulledAt);
        } catch (err) {
            // add logger
            console.error(err);
            return { success: false, error: 'Failed to push changes' };
        }
        return { success: true };
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert,
        pullChanges,
        pushChanges,
    };
};
