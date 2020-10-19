import { ModifierItemProps } from '../../models/ModifierItem';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type ModifierItemService = CommonServiceFns<ModifierItemProps>;

export const modifierItemService = ({
    repositories: { modifierItemRepository },
    logger,
}: InjectedDependencies): ModifierItemService => {
    const findAll = async () => await modifierItemRepository.findAll();
    const create = async props => modifierItemRepository.create(props);

    const findByIdAndUpdate = async (_id, props) => modifierItemRepository.findByIdAndUpdate(_id, props);

    const findOne = async props => modifierItemRepository.findOne(props);

    const findById = async _id => modifierItemRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: modifierItemRepository.insert,
        pullChanges: () => ({} as any),
    };
};
