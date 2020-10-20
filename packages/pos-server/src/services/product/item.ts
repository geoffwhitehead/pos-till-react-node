import { ItemProps } from '../../models/Item';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP, pull, push, SyncFns } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';

export type ItemService = CommonServiceFns<ItemProps> & SyncFns;

export const itemService = ({
    repositories: { itemRepository, itemModifierRepository, itemPriceRepository },
    logger,
}: InjectedDependencies): ItemService => {
    const findAll = async () => await itemRepository.findAll();
    const create = async props => {
        const item = await itemRepository.create(props);
        logger.info('item created');
        return item;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const item = await itemRepository.findByIdAndUpdate(_id, props);
        logger.info('item updated');

        return item;
    };

    const findOne = async props => {
        const item = await itemRepository.findOne(props);
        return item;
    };
    const findById = async _id => itemRepository.findById(_id);

    const pullChanges = async lastPulledAt => {
        const [items, itemModifiers, itemPrices] = await Promise.all([
            pull(itemRepository, lastPulledAt),
            pull(itemModifierRepository, lastPulledAt),
            pull(itemPriceRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [MONGO_TO_SQL_TABLE_MAP.items]: items,
            [MONGO_TO_SQL_TABLE_MAP.itemPrices]: itemPrices,
            [MONGO_TO_SQL_TABLE_MAP.itemModifiers]: itemModifiers,
        });
    };

    const pushChanges = async (lastPulledAt, changes) => {
        try {
            await Promise.all([
                push(itemRepository, changes, lastPulledAt),
                push(itemModifierRepository, changes, lastPulledAt),
                push(itemPriceRepository, changes, lastPulledAt),
            ]);
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
        insert: itemRepository.insert,
        pullChanges,
        pushChanges,
    };
};
