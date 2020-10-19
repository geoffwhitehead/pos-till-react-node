import { ItemModifierProps } from '../../models/ItemModifier';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type ItemModifierService = CommonServiceFns<ItemModifierProps>;

export const itemModifierService = ({
    repositories: { itemModifierRepository },
    logger,
}: InjectedDependencies): ItemModifierService => {
    const findAll = async () => await itemModifierRepository.findAll();
    const create = async props => itemModifierRepository.create(props);

    const findByIdAndUpdate = async (_id, props) => itemModifierRepository.findByIdAndUpdate(_id, props);

    const findOne = async props => itemModifierRepository.findOne(props);

    const findById = async _id => itemModifierRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: itemModifierRepository.insert,
        pullChanges: () => ({} as any),
    };
};
