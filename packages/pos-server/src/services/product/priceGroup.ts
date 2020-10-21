import { PriceGroupProps, PRICE_GROUP_COLLECTION_NAME } from '../../models/PriceGroup';
import { InjectedDependencies, pull, push } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';

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

    const pullChanges = async ({ lastPulledAt }) => {
        const priceGroups = await pull(priceGroupRepository, lastPulledAt);

        return toClientChanges({
            [PRICE_GROUP_COLLECTION_NAME]: priceGroups,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await push(priceGroupRepository, changes[PRICE_GROUP_COLLECTION_NAME], lastPulledAt);
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: priceGroupRepository.insert,
        pullChanges,
        pushChanges,
    };
};
