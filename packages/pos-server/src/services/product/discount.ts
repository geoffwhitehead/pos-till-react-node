import { CommonServiceFns } from '.';
import { InjectedDependencies, pull, push } from '..';
import { DiscountProps, DISCOUNT_COLLECTION_NAME } from '../../models/Discount';
import { toClientChanges } from '../../utils/sync';

export type DiscountService = CommonServiceFns<DiscountProps> & { seed: () => Promise<{ discounts: DiscountProps[] }> };

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

    const seed = async () => {
        const discounts = [
            {
                name: 'Student',
                amount: 10,
                isPercent: true,
            },
            {
                name: 'Staff',
                amount: 15,
                isPercent: true,
            },
        ];

        const seededDiscounts = await discountRepository.insert(discounts);

        return {
            discounts: seededDiscounts,
        };
    };
    return {
        seed,
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
