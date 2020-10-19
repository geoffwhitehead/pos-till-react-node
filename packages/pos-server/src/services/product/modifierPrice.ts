import { ModifierPriceProps } from '../../models/ModifierPrice';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type ModifierPriceService = CommonServiceFns<ModifierPriceProps>;

export const modifierPriceService = ({
    repositories: { modifierPriceRepository },
    logger,
}: InjectedDependencies): ModifierPriceService => {
    const findAll = async () => await modifierPriceRepository.findAll();
    const create = async props => modifierPriceRepository.create(props);

    const findByIdAndUpdate = async (_id, props) => modifierPriceRepository.findByIdAndUpdate(_id, props);

    const findOne = async props => modifierPriceRepository.findOne(props);

    const findById = async _id => modifierPriceRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: modifierPriceRepository.insert,
        pullChanges: () => ({} as any),
    };
};
