import { ItemProps } from '../../models/Item';
import { InjectedDependencies } from '..';
import { RepositoryFns } from '../../repositories/utils';
import { CommonServiceFns } from '.';

// export interface ItemService {
//     findAll: () => Promise<ItemProps[]>;
//     create: (userProps: ItemProps) => Promise<ItemProps>;
//     findByIdAndUpdate: (_id: string, userProps: Partial<ItemProps>) => Promise<ItemProps>;
//     findOne: (props: ItemProps) => Promise<ItemProps>;
//     findById: (_id: string) => Promise<ItemProps>;
// }
export type ItemService = CommonServiceFns<ItemProps>;

export const itemService = ({ repositories: { itemRepository }, logger }: InjectedDependencies): ItemService => {
    const findAll = async () => await itemRepository.findAll();
    const create = async props => {
        const item = await itemRepository.create(props);
        logger.info('item created');
        return item;
    };

    const findByIdAndUpdate = async (_id, props) => {
        const item = await itemRepository.findByIdAndUpdate(_id, props);
        logger.info('item updated');

        return item;
    };

    const findOne = async props => {
        const item = await itemRepository.findOne(props);
        return item;
    };
    const findById = async _id => itemRepository.findById(_id);

    return {
        findAll,
        create,
        findByIdAndUpdate,
        findOne,
        findById,
        insert: itemRepository.insert,
        pullChanges: () => ({} as any),
    };
};
