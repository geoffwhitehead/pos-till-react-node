import { PriceGroupProps } from '../../models/PriceGroup';
import { InjectedDependencies } from '..';

export interface PriceGroupService {
    findAll: () => Promise<PriceGroupProps[]>;
    create: (userProps: PriceGroupProps) => Promise<PriceGroupProps>;
    findByIdAndUpdate: (id: string, userProps: Partial<PriceGroupProps>) => Promise<PriceGroupProps>;
    findOne: (props: PriceGroupProps) => Promise<PriceGroupProps>;
    findById: (id: string) => Promise<PriceGroupProps>;
}

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

    const findByIdAndUpdate = async (id, props) => {
        const priceGroup = await priceGroupRepository.findByIdAndUpdate(id, props);
        logger.info('price group updated');

        return priceGroup;
    };

    const findOne = async props => {
        const priceGroup = await priceGroupRepository.findOne(props);
        return priceGroup;
    };

    const findById = async id => priceGroupRepository.findById(id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
    };
};
