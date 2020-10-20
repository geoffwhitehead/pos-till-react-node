import { ModifierProps } from '../../models/Modifier';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP, pull, push } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';

export type ModifierService = CommonServiceFns<ModifierProps>;

export const modifierService = ({
    repositories: { modifierRepository, modifierItemRepository, modifierPriceRepository },
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

    const pullChanges = async lastPulledAt => {
        const [modifiers, modifierItems, modifierPrices] = await Promise.all([
            pull(modifierRepository, lastPulledAt),
            pull(modifierItemRepository, lastPulledAt),
            pull(modifierPriceRepository, lastPulledAt),
        ]);

        return toClientChanges({
            [MONGO_TO_SQL_TABLE_MAP.modifiers]: modifiers,
            [MONGO_TO_SQL_TABLE_MAP.modifierItems]: modifierItems,
            [MONGO_TO_SQL_TABLE_MAP.modifierPrices]: modifierPrices,
        });
    };

    const pushChanges = async (lastPulledAt, changes) => {
        try {
            await Promise.all([
                push(modifierRepository, changes, lastPulledAt),
                push(modifierItemRepository, changes, lastPulledAt),
                push(modifierPriceRepository, changes, lastPulledAt),
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
        insert: modifierRepository.insert,
        pullChanges,
        pushChanges,
    };
};
