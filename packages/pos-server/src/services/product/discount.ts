import { DiscountProps } from '../../models/Discount';
import { InjectedDependencies } from '..';

export interface DiscountService {
    findAll: () => Promise<DiscountProps[]>;
    create: (userProps: DiscountProps) => Promise<DiscountProps>;
    findByIdAndUpdate: (id: string, userProps: Partial<DiscountProps>) => Promise<DiscountProps>;
    findOne: (props: DiscountProps) => Promise<DiscountProps>;
    findById: (id: string) => Promise<DiscountProps>;
}

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

    const findByIdAndUpdate = async (id, props) => {
        const discount = await discountRepository.findByIdAndUpdate(id, props);
        logger.info('Discount updated');
        return discount;
    };

    const findOne = async props => await discountRepository.findOne(props);

    const findById = async id => discountRepository.findById(id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
    };
};
