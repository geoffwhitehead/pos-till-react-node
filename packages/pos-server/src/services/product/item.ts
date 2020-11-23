import faker from 'faker';
import { flatten, random } from 'lodash';
import uuid from 'uuid';
import { CommonServiceFns } from '.';
import { InjectedDependencies, pull, push } from '..';
import { CategoryProps } from '../../models/Category';
import { ItemProps, ITEM_COLLECTION_NAME } from '../../models/Item';
import { ITEM_MODIFIER_COLLECTION_NAME } from '../../models/ItemModifier';
import { ItemPriceProps, ITEM_PRICE_COLLECTION_NAME } from '../../models/ItemPrice';
import { ModifierProps } from '../../models/Modifier';
import { PriceGroupProps } from '../../models/PriceGroup';
import { PrinterGroupProps } from '../../models/PrinterGroup';
import { toClientChanges } from '../../utils/sync';

type SeedProps = {
    itemsToSeed: number;
    categories: CategoryProps[];
    printerGroups: PrinterGroupProps[];
    priceGroups: PriceGroupProps[];
    modifiers: ModifierProps[];
};

export type ItemService = CommonServiceFns<ItemProps> & {
    seed: (props: SeedProps) => Promise<{ items: ItemProps[] }>;
};

const generateItemPrices: (priceGroups: PriceGroupProps[], itemId: string) => ItemPriceProps[] = (
    priceGroups,
    itemId,
) => {
    return priceGroups.map((group, i) => {
        return {
            _id: uuid(),
            priceGroupId: group._id,
            price:
                faker.random.number({
                    min: 1,
                    max: 15,
                }) * 100,
            itemId,
        };
    });
};

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

    const seed = async ({ itemsToSeed = 25, categories, printerGroups, modifiers, priceGroups }) => {
        const items: ItemProps[] = [...Array(itemsToSeed)].map(() => {
            const productName = faker.commerce.product();
            const randomPrinterGroupId = printerGroups[random(1)]._id;
            const randomCategoryId = categories[random(categories.length - 1)]._id;
            return {
                _id: uuid(),
                name: productName,
                shortName: productName.slice(0, 9),
                categoryId: randomCategoryId,
                printerGroupId: randomPrinterGroupId,
            };
        });

        const itemPrices: ItemPriceProps[] = flatten(items.map(item => generateItemPrices(priceGroups, item._id)));

        const itemModifiers = items
            .map(item => {
                const hasMod = random(1);
                if (hasMod) {
                    const randomModifierId = modifiers[random(modifiers.length - 1)]._id;
                    return {
                        itemId: item._id,
                        modifierId: randomModifierId,
                    };
                }
                return null;
            })
            .filter(i => i != null);

        const seededItems = await itemRepository.insert(items);
        await itemPriceRepository.insert(itemPrices);
        await itemModifierRepository.insert(itemModifiers);

        return {
            items: seededItems,
        };
    };
    return {
        seed,
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
