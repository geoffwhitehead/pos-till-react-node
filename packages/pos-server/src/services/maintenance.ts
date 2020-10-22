import faker from 'faker';
import { random } from 'lodash';
import { PriceGroupProps } from '../models/PriceGroup';
import { InjectedDependencies } from '.';
import { PrinterProps } from '../models/Printer';
import { ItemPriceProps } from '../models/ItemPrice';
import uuid from 'uuid';
import { ModifierProps } from '../models/Modifier';
import { ModifierItemProps } from '../models/ModifierItem';
import { ModifierPriceProps } from '../models/ModifierPrice';
import { flatten } from 'lodash';
import { ItemProps } from '../models/Item';
import { ItemModifierProps } from '../models/ItemModifier';

export interface MaintenanceService {
    seed: () => Promise<any>;
    // seed: () => Promise<{ success: boolean }>;
}

const ITEMS_TO_SEED = 250;
const PRICE_GROUPS = ['Main', 'Take Away'];

const generateItemPrices: (priceGroups: PriceGroupProps[], itemId: string) => ItemPriceProps[] = (
    priceGroups,
    itemId,
) => {
    return priceGroups.map((group, i) => {
        return {
            _id: uuid(),
            priceGroupId: group._id,
            price:
                faker.random.number({
                    min: 1,
                    max: 15,
                }) * 100,
            itemId,
        };
    });
};

const generateModifierPrices: (priceGroups: PriceGroupProps[], modifierItemId: string) => ModifierPriceProps[] = (
    priceGroups,
    modifierItemId,
) => {
    return priceGroups.map((group, i) => {
        return {
            _id: uuid(),
            priceGroupId: group._id,
            price:
                faker.random.number({
                    min: 1,
                    max: 15,
                }) * 100,
            modifierItemId,
        };
    });
};

export const maintenanceService = ({
    repositories: {
        categoryRepository,
        discountRepository,
        priceGroupRepository,
        modifierRepository,
        modifierItemRepository,
        modifierPriceRepository,
        itemRepository,
        itemPriceRepository,
        itemModifierRepository,
        printerRepository,
        printerGroupRepository,
        printerGroupPrinterRepository,
    },
    logger,
}: InjectedDependencies): MaintenanceService => {
    const seed = async () => {
        const printers = [
            {
                _id: uuid(),
                name: 'Star SP700',
                type: 'ethernet',
                address: 'TCP:192.168.1.84',
                emulation: 'StarDotImpact',
                printWidth: 14,
            } as const,
            {
                id: uuid(),
                name: 'Star TSP100',
                type: 'wifi',
                address: 'TCP:192.168.1.78',
                emulation: 'StarGraphic',
                printWidth: 39,
            } as const,
        ];

        const results = await printerRepository.insert(printers);

        const thermalPrinter = printers[1];
        const kitchenPrinter = printers[0];

        console.log('BEFORE INSERTING');
        const printerGroups = [
            {
                _id: uuid(),
                name: 'Starter',
            },
            {
                _id: uuid(),
                name: 'Kitchen',
            },
        ];
        await printerGroupRepository.insert(printerGroups);

        await printerGroupPrinterRepository.insert(
            printerGroups.map(group => ({
                printerGroupId: group._id,
                printerId: kitchenPrinter._id,
            })),
        );

        const categories = [
            {
                name: 'Starters',
                shortName: 'Starters',
            },
            {
                name: 'Mains',
                shortName: 'Mains',
            },
            {
                name: 'Desserts',
                shortName: 'Desserts',
            },
            {
                name: 'Wine',
                shortName: 'Wine',
            },
            {
                name: 'Beer',
                shortName: 'Beer',
            },
        ];

        const insertedCategories = await categoryRepository.insert(categories);

        // if (!insertedCategories.result.ok) {
        //     console.log('result', insertedCategories.result);
        //     throw new Error('Error inserting categories');
        // }

        const insertedPriceGroups = await priceGroupRepository.insert(PRICE_GROUPS.map(name => ({ name })));
        // if (!insertedPriceGroups.result.ok) {
        //     console.log('result', insertedPriceGroups.result);
        //     throw new Error('Error inserting price groups');
        // }

        const priceGroups = await priceGroupRepository.findAll();

        const modifier: ModifierProps = {
            _id: uuid(),
            name: 'Mains',
            minItems: 1,
            maxItems: 1,
        };

        const modifierItems: ModifierItemProps[] = [
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Chicken',
                shortName: 'Chicken',
                // price: generatePriceGroups(priceGroups),
            },
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Beef',
                shortName: 'Beef',
                // price: generatePriceGroups(priceGroups),
            },
            {
                _id: uuid(),
                modifierId: modifier._id,
                name: 'Pork',
                shortName: 'Pork',
                // price: generatePriceGroups(priceGroups),
            },
        ];

        const modifierPrices: ModifierPriceProps[] = flatten(
            modifierItems.map(mItem => generateModifierPrices(priceGroups, mItem._id)),
        );

        await modifierRepository.create(modifier);
        await modifierItemRepository.insert(modifierItems);
        await modifierPriceRepository.insert(modifierPrices);

        const items: ItemProps[] = [...Array(ITEMS_TO_SEED)].map(() => {
            const productName = faker.commerce.product();
            return {
                _id: uuid(),
                name: productName,
                shortName: productName.slice(0, 9),
                categoryId: insertedCategories[random(categories.length - 1)]._id,
                printerGroupId: printerGroups[random(1)]._id,
            };
        });

        const itemPrices: ItemPriceProps[] = flatten(items.map(item => generateItemPrices(priceGroups, item._id)));

        const itemModifiers = items
            .map(item => {
                const hasMod = random(1);
                if (hasMod) {
                    return {
                        itemId: item._id,
                        modifierId: modifier._id,
                    };
                }
                return null;
            })
            .filter(i => i != null);

        await itemRepository.insert(items);
        await itemPriceRepository.insert(itemPrices);
        await itemModifierRepository.insert(itemModifiers);

        await discountRepository.insert([
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
        // if (!insertedDiscounts.result.ok) {
        //     console.log('insertedDiscounts', insertedDiscounts);
        //     throw new Error('Error inserting discounts');
        // }

        logger.info('Sucessfully seeded');
        return {
            success: true,
        };
    };
    return {
        seed,
    };
};
