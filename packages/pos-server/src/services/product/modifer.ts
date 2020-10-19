import { ModifierProps } from '../../models/Modifier';
import { InjectedDependencies } from '..';
import { CommonServiceFns } from '.';

export type ModifierService = CommonServiceFns<ModifierProps>;

export const modifierService = ({
    repositories: { modifierRepository },
    logger,
}: InjectedDependencies): ModifierService => {
    const findAll = async () => await modifierRepository.findAll();
    const create = async props => {
        const modifier = await modifierRepository.create(props);
        logger.info('modifier created');
        return modifier;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const modifier = await modifierRepository.findByIdAndUpdate(_id, props);
        logger.info('modifier updated');

        return modifier;
    };

    const findOne = async props => {
        const modifier = await modifierRepository.findOne(props);
        return modifier;
    };

    const findById = async _id => modifierRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: modifierRepository.insert,
        pullChanges: () => ({} as any),
    };
};
