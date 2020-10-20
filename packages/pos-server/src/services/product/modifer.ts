import { ModifierProps } from '../../models/Modifier';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP } from '..';
import { CommonServiceFns } from '.';

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
        const [
            modifierCreated,
            modifierUpdated,
            modifierDeleted,
            modifierItemCreated,
            modifierItemUpdated,
            modifierItemDeleted,
            modifierPriceCreated,
            modifierPriceUpdated,
            modifierPriceDeleted,
        ] = await Promise.all([
            modifierRepository.createdSince(lastPulledAt),
            modifierRepository.updatedSince(lastPulledAt),
            modifierRepository.deletedSince(lastPulledAt),
            modifierItemRepository.createdSince(lastPulledAt),
            modifierItemRepository.updatedSince(lastPulledAt),
            modifierItemRepository.deletedSince(lastPulledAt),
            modifierPriceRepository.createdSince(lastPulledAt),
            modifierPriceRepository.updatedSince(lastPulledAt),
            modifierPriceRepository.deletedSince(lastPulledAt),
        ]);

        return {
            [MONGO_TO_SQL_TABLE_MAP.modifiers]: {
                created: modifierCreated,
                updated: modifierUpdated,
                deleted: modifierDeleted.map(({ _id }) => _id),
            },
            [MONGO_TO_SQL_TABLE_MAP.modifierItems]: {
                created: modifierItemCreated,
                updated: modifierItemUpdated,
                deleted: modifierItemDeleted.map(({ _id }) => _id),
            },
            [MONGO_TO_SQL_TABLE_MAP.modifierPrices]: {
                created: modifierPriceCreated,
                updated: modifierPriceUpdated,
                deleted: modifierPriceDeleted.map(({ _id }) => _id),
            },
        };
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: modifierRepository.insert,
        pullChanges,
    };
};
