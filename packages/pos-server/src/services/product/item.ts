import { ItemProps } from '../../models/Item';
import { InjectedDependencies } from '..';
import { RepositoryFns } from '../../repositories/utils';

// export interface ItemService {
//     findAll: () => Promise<ItemProps[]>;
//     create: (userProps: ItemProps) => Promise<ItemProps>;
//     findByIdAndUpdate: (id: string, userProps: Partial<ItemProps>) => Promise<ItemProps>;
//     findOne: (props: ItemProps) => Promise<ItemProps>;
//     findById: (id: string) => Promise<ItemProps>;
// }

export type ItemService = RepositoryFns<ItemProps>;

export const itemService = ({ repositories: { itemRepository }, logger }: InjectedDependencies): ItemService => {
    const findAll = async () => await itemRepository.findAll();
    const create = async props => {
        const item = await itemRepository.create(props);
        logger.info('item created');
        return item;
    };

    const findByIdAndUpdate = async (id, props) => {
        const item = await itemRepository.findByIdAndUpdate(id, props);
        logger.info('item updated');

        return item;
    };

    const findOne = async props => {
        const item = await itemRepository.findOne(props);
        return item;
    };
    const findById = async id => itemRepository.findById(id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: itemRepository.insert,
    };
};
