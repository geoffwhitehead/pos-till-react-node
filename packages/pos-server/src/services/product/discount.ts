import { DiscountProps } from '../../models/Discount';
import { InjectedDependencies, MONGO_TO_SQL_TABLE_MAP, pull, push } from '..';
import { CommonServiceFns } from '.';
import { toClientChanges } from '../../utils/sync';

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
        const discounts = await pull(discountRepository, lastPulledAt);

        return toClientChanges({
            [MONGO_TO_SQL_TABLE_MAP.discounts]: discounts,
        });
    };

    const pushChanges = async (lastPulledAt, changes) => {
        try {
            await push(discountRepository, changes, lastPulledAt);
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
        insert: discountRepository.insert,
        pullChanges,
        pushChanges,
    };
};
