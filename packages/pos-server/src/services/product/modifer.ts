import { ModifierProps } from '../../models/Modifier';
import { InjectedDependencies } from '..';

export interface ModifierService {
    findAll: () => Promise<ModifierProps[]>;
    create: (userProps: ModifierProps) => Promise<ModifierProps>;
    findByIdAndUpdate: (id: string, userProps: Partial<ModifierProps>) => Promise<ModifierProps>;
    findOne: (props: ModifierProps) => Promise<ModifierProps>;
    findById: (id: string) => Promise<ModifierProps>;
}

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

    const findByIdAndUpdate = async (id, props) => {
        const modifier = await modifierRepository.findByIdAndUpdate(id, props);
        logger.info('modifier updated');

        return modifier;
    };

    const findOne = async props => {
        const modifier = await modifierRepository.findOne(props);
        return modifier;
    };

    const findById = async id => modifierRepository.findById(id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
    };
};
