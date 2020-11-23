import { CommonServiceFns } from '.';
import { InjectedDependencies, pull, push } from '..';
import { CategoryProps, CATEGORY_COLLECTION_NAME } from '../../models/Category';
import { toClientChanges } from '../../utils/sync';

export type CategoryService = CommonServiceFns<CategoryProps> & {
    seed: () => Promise<{ categories: CategoryProps[] }>;
};

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

    const pullChanges = async ({ lastPulledAt }) => {
        const categories = await pull(categoryRepository, lastPulledAt);

        console.log('categories', categories);
        return toClientChanges({
            [CATEGORY_COLLECTION_NAME]: categories,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await push(categoryRepository, changes[CATEGORY_COLLECTION_NAME], lastPulledAt);
    };

    const seed = async () => {
        const defaultCategories = [
            {
                name: 'Starters',
                shortName: 'Starters',
                positionIndex: 0,
                color: 'blue',
            },
            {
                name: 'Mains',
                shortName: 'Mains',
                positionIndex: 1,
                color: 'red',
            },
            {
                name: 'Desserts',
                shortName: 'Desserts',
                positionIndex: 2,
                color: 'purple',
            },
            {
                name: 'Wine',
                shortName: 'Wine',
                positionIndex: 3,
                color: 'red',
            },
            {
                name: 'Beer',
                shortName: 'Beer',
                positionIndex: 4,
                color: 'brown',
            },
        ];

        const categories = await categoryRepository.insert(defaultCategories);

        return { categories };
    };

    return {
        seed,
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
