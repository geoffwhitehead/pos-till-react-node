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
        const _id = uuid();
        console.log('_id', _id);
        return {
            _id,
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
    },
    logger,
}: InjectedDependencies): MaintenanceService => {
    const seed = async () => {
        const results = await printerRepository.insert([
            {
                name: 'Star SP700',
                type: 'ethernet',
                address: 'TCP:192.168.1.84',
                emulation: 'StarDotImpact',
                printWidth: 14,
            },
            {
                name: 'Star TSP100',
                type: 'wifi',
                address: 'TCP:192.168.1.78',
                emulation: 'StarGraphic',
                printWidth: 39,
            },
        ]);

        const thermalPrinter: PrinterProps = results.find(r => r.name === 'Star TSP100');
        const kitchenPrinter: PrinterProps = results.find(r => r.name === 'Star SP700');

        console.log('BEFORE INSERTING');
        const printerGroupResults = await printerGroupRepository.insert([
            {
                name: 'Starter',
                printers: [kitchenPrinter._id],
            },
            {
                name: 'Kitchen',
                printers: [kitchenPrinter._id],
            },
        ]);

        console.log('printerGroupResults', printerGroupResults);

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

        const newModifier = await modifierRepository.create(modifier);
        await modifierItemRepository.insert(modifierItems);
        await modifierPriceRepository.insert(modifierPrices);

        const items: ItemProps[] = [...Array(ITEMS_TO_SEED)].map(() => {
            const productName = faker.commerce.product();
            return {
                _id: uuid(),
                name: productName,
                shortName: productName.slice(0, 9),
                categoryId: insertedCategories[random(categories.length - 1)]._id,
                printerGroupId: printerGroupResults[random(1)]._id,
            };
        });

        const itemPrices: ItemPriceProps[] = flatten(items.map(item => generateItemPrices(priceGroups, item._id)));

        await itemRepository.insert(items);
        await itemPriceRepository.insert(itemPrices);
        // if (!insertedItems.result.ok) {
        //     console.log('insertedItems', insertedItems);
        //     throw new Error('Error inserting items');
        // }

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
