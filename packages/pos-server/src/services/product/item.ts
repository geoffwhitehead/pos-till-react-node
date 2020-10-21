import { ItemProps, ITEM_COLLECTION_NAME } from '../../models/Item';
import { InjectedDependencies, pull, push, SyncFns } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';
import { ITEM_PRICE_COLLECTION_NAME } from '../../models/ItemPrice';
import { ITEM_MODIFIER_COLLECTION_NAME } from '../../models/ItemModifier';

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

    const pullChanges = async ({ lastPulledAt }) => {
        const [items, itemModifiers, itemPrices] = await Promise.all([
            pull(itemRepository, lastPulledAt),
            pull(itemModifierRepository, lastPulledAt),
            pull(itemPriceRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [ITEM_COLLECTION_NAME]: items,
            [ITEM_PRICE_COLLECTION_NAME]: itemPrices,
            [ITEM_MODIFIER_COLLECTION_NAME]: itemModifiers,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        Promise.all([
            await push(itemRepository, changes[ITEM_COLLECTION_NAME], lastPulledAt),
            await push(itemModifierRepository, changes[ITEM_MODIFIER_COLLECTION_NAME], lastPulledAt),
            await push(itemPriceRepository, changes[ITEM_PRICE_COLLECTION_NAME], lastPulledAt),
        ]);
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
