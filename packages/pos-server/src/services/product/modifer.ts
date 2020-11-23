import faker from 'faker';
import { flatten } from 'lodash';
import uuid from 'uuid';
import { CommonServiceFns } from '.';
import { InjectedDependencies, pull, push } from '..';
import { ModifierProps, MODIFIER_COLLECTION_NAME } from '../../models/Modifier';
import { ModifierItemProps, MODIFIER_ITEM_COLLECTION_NAME } from '../../models/ModifierItem';
import { ModifierItemPriceProps, MODIFIER_ITEM_PRICE_COLLECTION_NAME } from '../../models/ModifierItemPrice';
import { PriceGroupProps } from '../../models/PriceGroup';
import { toClientChanges } from '../../utils/sync';

type SeedProps = {
    priceGroups: PriceGroupProps[];
};

export type ModifierService = CommonServiceFns<ModifierProps> & {
    seed: (params: SeedProps) => Promise<{ modifiers: ModifierProps[] }>;
};

const generateModifierItemPrices: (
    priceGroups: PriceGroupProps[],
    modifierItemId: string,
) => ModifierItemPriceProps[] = (priceGroups, modifierItemId) => {
    return priceGroups.map((group, i) => {
        return {
            _id: uuid(),
            priceGroupId: group._id,
            price:
                faker.random.number({
                    min: 1,
                    max: 15,
                }) * 100,
            modifierItemId,
        };
    });
};

export const modifierService = ({
    repositories: { modifierRepository, modifierItemRepository, modifierItemPriceRepository },
    logger,
}: InjectedDependencies): ModifierService => {
    const findAll = async () => await modifierRepository.findAll();
    const create = async props => {
        const modifier = await modifierRepository.create(props);
        logger.info('modifier created');
        return modifier;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const modifier = await modifierRepository.findByIdAndUpdate(_id, props);
        logger.info('modifier updated');

        return modifier;
    };

    const findOne = async props => {
        const modifier = await modifierRepository.findOne(props);
        return modifier;
    };

    const findById = async _id => modifierRepository.findById(_id);

    const pullChanges = async ({ lastPulledAt }) => {
        const [modifiers, modifierItems, modifierPrices] = await Promise.all([
            pull(modifierRepository, lastPulledAt),
            pull(modifierItemRepository, lastPulledAt),
            pull(modifierItemPriceRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [MODIFIER_COLLECTION_NAME]: modifiers,
            [MODIFIER_ITEM_COLLECTION_NAME]: modifierItems,
            [MODIFIER_ITEM_PRICE_COLLECTION_NAME]: modifierPrices,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        Promise.all([
            await push(modifierRepository, changes[MODIFIER_COLLECTION_NAME], lastPulledAt),
            await push(modifierItemRepository, changes[MODIFIER_ITEM_COLLECTION_NAME], lastPulledAt),
            await push(modifierItemPriceRepository, changes[MODIFIER_ITEM_PRICE_COLLECTION_NAME], lastPulledAt),
        ]);
    };

    const seed = async ({ priceGroups }: SeedProps) => {
        const modifier: ModifierProps = {
            _id: uuid(),
            name: 'Mains',
            minItems: 1,
            maxItems: 1,
        };

        const modifierItems: ModifierItemProps[] = [
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Chicken',
                shortName: 'Chicken',
            },
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Beef',
                shortName: 'Beef',
            },
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Pork',
                shortName: 'Pork',
            },
        ];

        const modifierItemPrices: ModifierItemPriceProps[] = flatten(
            modifierItems.map(mItem => generateModifierItemPrices(priceGroups, mItem._id)),
        );

        const defaultModifier = await modifierRepository.create(modifier);
        await modifierItemRepository.insert(modifierItems);
        await modifierItemPriceRepository.insert(modifierItemPrices);

        return {
            modifiers: [defaultModifier],
        };
    };

    return {
        seed,
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: modifierRepository.insert,
        pullChanges,
        pushChanges,
    };
};
