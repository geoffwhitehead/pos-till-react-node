import { Request, Response } from 'express';
import faker from 'faker';
import { Category, Modifier, Item, Discount, PriceGroup } from '../models';
import { random } from 'lodash';
import { ItemPriceGroupProps, PriceGroupDocument } from '../models/PriceGroup';

const ITEMS_TO_SEED = 20;
const CATEGORIES_TO_SEED = ['Starters', 'Mains', 'Desserts', 'Wine', 'Beer'];
const PRICE_GROUPS = ['Main', 'Take Away']; // dont change - generatePriceGroup wont handle

const generatePriceGroups: (priceGroups: PriceGroupDocument[]) => ItemPriceGroupProps[] = priceGroups => {
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

export const seed = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = CATEGORIES_TO_SEED.map(name => {
            return {
                name,
            };
        });

        const insertedCategories = await Category().collection.insert(categories);

        if (!insertedCategories.result.ok) {
            console.log('result', insertedCategories.result);
            throw new Error('Error inserting categories');
        }

        const insertedPriceGroups = await PriceGroup().collection.insert(PRICE_GROUPS.map(name => ({ name })));

        if (!insertedPriceGroups.result.ok) {
            console.log('result', insertedPriceGroups.result);
            throw new Error('Error inserting price groups');
        }

        const priceGroups = await PriceGroup().find({});
        const ModifierModel = Modifier();
        const modifier = new ModifierModel({
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
        });

        const m = await modifier.save();

        const items = [...Array(ITEMS_TO_SEED)].map(() => {
            return {
                name: faker.commerce.product(),
                categoryId: insertedCategories.insertedIds[random(CATEGORIES_TO_SEED.length)],
                price: generatePriceGroups(priceGroups),
                stock: 10,
                modifierId: faker.random.boolean() ? m._id : null,
            };
        });
        console.log('*************** items', JSON.stringify(items, null, 4));

        const insertedItems = await Item().collection.insert(items);

        if (!insertedItems.result.ok) {
            console.log('insertedItems', insertedItems);
            throw new Error('Error inserting items');
        }

        const insertedDiscounts = await Discount().collection.insert([
            {
                name: 'Student',
                amount: '10',
            },
            {
                name: 'Staff',
                amount: '15',
            },
            {
                name: 'Offer',
                amount: '500',
                isPercent: false,
            },
        ]);

        if (!insertedDiscounts.result.ok) {
            console.log('insertedDiscounts', insertedDiscounts);
            throw new Error('Error inserting discounts');
        }

        res.send('Sucessfully seeded');
    } catch (err) {
        console.log('err', err);
        res.status(400).send(err);
    }
};
