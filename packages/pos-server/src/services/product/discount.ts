import { DiscountProps, DISCOUNT_COLLECTION_NAME } from '../../models/Discount';
import { InjectedDependencies, pull, push } from '..';
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

    const pullChanges = async ({ lastPulledAt }) => {
        const discounts = await pull(discountRepository, lastPulledAt);

        return toClientChanges({
            [DISCOUNT_COLLECTION_NAME]: discounts,
        });
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        await push(discountRepository, changes[DISCOUNT_COLLECTION_NAME], lastPulledAt);
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
