import { ItemProps } from '../../models/Item';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP, SyncFns } from '..';
import { CommonServiceFns } from '.';

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
        const [
            itemCreated,
            itemUpdated,
            itemDeleted,
            itemModifierCreated,
            itemModifierUpdated,
            itemModifierDeleted,
            itemPriceCreated,
            itemPriceUpdated,
            itemPriceDeleted,
        ] = await Promise.all([
            itemRepository.createdSince(lastPulledAt),
            itemRepository.updatedSince(lastPulledAt),
            itemRepository.deletedSince(lastPulledAt),
            itemModifierRepository.createdSince(lastPulledAt),
            itemModifierRepository.updatedSince(lastPulledAt),
            itemModifierRepository.deletedSince(lastPulledAt),
            itemPriceRepository.createdSince(lastPulledAt),
            itemPriceRepository.updatedSince(lastPulledAt),
            itemPriceRepository.deletedSince(lastPulledAt),
        ]);

        return {
            [MONGO_TO_SQL_TABLE_MAP.items]: {
                created: itemCreated,
                updated: itemUpdated,
                deleted: itemDeleted.map(({ _id }) => _id),
            },
            [MONGO_TO_SQL_TABLE_MAP.itemPrices]: {
                created: itemPriceCreated,
                updated: itemPriceUpdated,
                deleted: itemPriceDeleted.map(({ _id }) => _id),
            },
            [MONGO_TO_SQL_TABLE_MAP.itemModifiers]: {
                created: itemModifierCreated,
                updated: itemModifierUpdated,
                deleted: itemModifierDeleted.map(({ _id }) => _id),
            },
        };
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: itemRepository.insert,
        pullChanges,
    };
};
