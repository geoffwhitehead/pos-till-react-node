import { ItemPriceProps } from '../../models/ItemPrice';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type ItemPriceService = CommonServiceFns<ItemPriceProps>;

export const itemPriceService = ({
    repositories: { itemPriceRepository },
    logger,
}: InjectedDependencies): ItemPriceService => {
    const findAll = async () => await itemPriceRepository.findAll();
    const create = async props => itemPriceRepository.create(props);

    const findByIdAndUpdate = async (_id, props) => itemPriceRepository.findByIdAndUpdate(_id, props);

    const findOne = async props => itemPriceRepository.findOne(props);

    const findById = async _id => itemPriceRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: itemPriceRepository.insert,
        pullChanges: () => ({} as any),
    };
};
