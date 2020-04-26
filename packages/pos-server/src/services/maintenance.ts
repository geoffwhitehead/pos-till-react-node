import faker from 'faker';
import { random } from 'lodash';
import { ItemPriceGroupProps, PriceGroupProps } from '../models/PriceGroup';
import { InjectedDependencies } from '.';

export interface MaintenanceService {
    seed: () => Promise<{ success: boolean }>;
}

const ITEMS_TO_SEED = 20;
const PRICE_GROUPS = ['Main', 'Take Away']; // TODO: fix so generate price grouips handles varuious sizes

const generatePriceGroups: (priceGroups: PriceGroupProps[]) => ItemPriceGroupProps[] = priceGroups => {
    const basePrice =
        faker.random.number({
            min: 1,
            max: 15,
        }) * 100;

    return priceGroups.map((group, i) => {
        return {
            groupId: group._id,
            price: i = 0 ? basePrice : basePrice * (1 - (i / 100) * 10),
        };
    });
};

export const maintenanceService = ({
    repositories: {
        categoryRepository,
        discountRepository,
        priceGroupRepository,
        modifierRepository,
        itemRepository,
        printerRepository,
    },
    logger,
}: InjectedDependencies): MaintenanceService => {
    const seed = async () => {
        try {
            const result = await printerRepository.insert([{ name: 'Kitchen', type: '', address: '' }]);

            const printer = result.ops[0];

            const categories = [
                {
                    name: 'Starters',
                    linkedPrinters: [printer._id],
                },
                {
                    name: 'Mains',
                    linkedPrinters: [printer._id],
                },
                {
                    name: 'Desserts',
                    linkedPrinters: [printer._id],
                },
                {
                    name: 'Wine',
                    linkedPrinters: [],
                },
                {
                    name: 'Beer',
                    linkedPrinters: [],
                },
            ];

            const insertedCategories = await categoryRepository.insert(categories);

            if (!insertedCategories.result.ok) {
                console.log('result', insertedCategories.result);
                throw new Error('Error inserting categories');
            }

            const insertedPriceGroups = await priceGroupRepository.insert(PRICE_GROUPS.map(name => ({ name })));

            if (!insertedPriceGroups.result.ok) {
                console.log('result', insertedPriceGroups.result);
                throw new Error('Error inserting price groups');
            }

            const priceGroups = await priceGroupRepository.findAll();

            const modifier = {
                name: 'Mains',
                mods: [
                    {
                        name: 'Chicken',
                        price: generatePriceGroups(priceGroups),
                    },
                    {
                        name: 'Beef',
                        price: generatePriceGroups(priceGroups),
                    },
                    {
                        name: 'Pork',
                        price: generatePriceGroups(priceGroups),
                    },
                ],
            };

            const newModifier = await modifierRepository.create(modifier);

            const items = [...Array(ITEMS_TO_SEED)].map(() => {
                return {
                    name: faker.commerce.product(),
                    categoryId: insertedCategories.insertedIds[random(categories.length)],
                    price: generatePriceGroups(priceGroups),
                    stock: 10,
                    modifierId: faker.random.boolean() ? newModifier._id : null,
                    linkedPrinters: [],
                };
            });

            const insertedItems = await itemRepository.insert(items);

            if (!insertedItems.result.ok) {
                console.log('insertedItems', insertedItems);
                throw new Error('Error inserting items');
            }

            const insertedDiscounts = await discountRepository.insert([
                {
                    name: 'Student',
                    amount: 10,
                    isPercent: true,
                },
                {
                    name: 'Staff',
                    amount: 15,
                    isPercent: true,
                },
                {
                    name: 'Offer',
                    amount: 500,
                    isPercent: false,
                },
            ]);

            if (!insertedDiscounts.result.ok) {
                console.log('insertedDiscounts', insertedDiscounts);
                throw new Error('Error inserting discounts');
            }

            logger.info('Sucessfully seeded');
            return { success: true };
        } catch (err) {
            logger.error('Seeding failed ', err);
        }
    };
    return {
        seed,
    };
};
