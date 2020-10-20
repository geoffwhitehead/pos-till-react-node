import { PriceGroupProps } from '../../models/PriceGroup';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP } from '..';
import { RepositoryFns } from '../../repositories/utils';
import { CommonServiceFns } from '.';

export type PriceGroupService = CommonServiceFns<PriceGroupProps>;

export const priceGroupService = ({
    repositories: { priceGroupRepository },
    logger,
}: InjectedDependencies): PriceGroupService => {
    const findAll = async () => await priceGroupRepository.findAll();
    const create = async props => {
        const priceGroup = await priceGroupRepository.create(props);
        logger.info('price group created');
        return priceGroup;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const priceGroup = await priceGroupRepository.findByIdAndUpdate(_id, props);
        logger.info('price group updated');

        return priceGroup;
    };

    const findOne = async props => {
        const priceGroup = await priceGroupRepository.findOne(props);
        return priceGroup;
    };

    const findById = async _id => priceGroupRepository.findById(_id);

    const pullChanges = async lastPulledAt => {
        const [created, updated, deleted] = await Promise.all([
            priceGroupRepository.createdSince(lastPulledAt),
            priceGroupRepository.updatedSince(lastPulledAt),
            priceGroupRepository.deletedSince(lastPulledAt),
        ]);

        return {
            [MONGO_TO_SQL_TABLE_MAP.priceGroups]: {
                created,
                updated,
                deleted: deleted.map(({ _id }) => _id),
            },
        };
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: priceGroupRepository.insert,
        pullChanges,
    };
};
