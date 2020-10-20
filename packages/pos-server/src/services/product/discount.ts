import { DiscountProps } from '../../models/Discount';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP } from '..';
import { CommonServiceFns } from '.';

export type DiscountService = CommonServiceFns<DiscountProps>;

export const discountService = ({
    repositories: { discountRepository },
    logger,
}: InjectedDependencies): DiscountService => {
    const findAll = async () => await discountRepository.findAll();
    const create = async props => {
        const discount = await discountRepository.create(props);
        logger.info('Discount created');
        return discount;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const discount = await discountRepository.findByIdAndUpdate(_id, props);
        logger.info('Discount updated');
        return discount;
    };

    const findOne = async props => await discountRepository.findOne(props);

    const findById = async _id => discountRepository.findById(_id);

    const pullChanges = async lastPulledAt => {
        const [created, updated, deleted] = await Promise.all([
            discountRepository.createdSince(lastPulledAt),
            discountRepository.updatedSince(lastPulledAt),
            discountRepository.deletedSince(lastPulledAt),
        ]);

        return {
            [MONGO_TO_SQL_TABLE_MAP.discounts]: { created, updated, deleted: deleted.map(({ _id }) => _id) },
        };
    };

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: discountRepository.insert,
        pullChanges,
    };
};
