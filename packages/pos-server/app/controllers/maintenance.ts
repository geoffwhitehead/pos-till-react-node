import { Request, Response } from 'express';
import faker from 'faker';
import { Category, Modifier, Item } from '../models';
import { rdm } from '../helpers/rdm';

export const seed = async (req: Request, res: Response) => {
    const ITEMS_TO_SEED = 10;
    const CATEGORIES_TO_SEED = ['DEFAULT', 'STD', 'MAIN'];

    try {
        const categories = CATEGORIES_TO_SEED.map(name => {
            return {
                name,
            };
        });

        const insertedCategories = await Category.collection.insert(categories);

        if (!insertedCategories.result.ok) {
            console.log('result', insertedCategories.result);
            throw new Error('Error inserting categories');
        }

        const modifier = new Modifier({
            name: 'Mains',
            mods: [
                {
                    name: 'Chicken',
                    price: '200',
                },
                {
                    name: 'Beef',
                    price: '250',
                },
                {
                    name: 'Pork',
                    price: '150',
                },
            ],
        });

        const m = await modifier.save();

        const items = new Array(ITEMS_TO_SEED).map(() => {
            return {
                name: faker.commerce.product(),
                categoryId: insertedCategories.insertedIds[rdm(CATEGORIES_TO_SEED.length)],
                price:
                    faker.random.number({
                        min: 1,
                        max: 15,
                    }) * 100,
                stock: 10,
                modifierId: faker.randomBoolean() ? m._id : null,
            };
        });
        console.log('*************** items', JSON.stringify(items, null, 4));

        const insertedItems = await Item.collection.insert(items);

        if (!insertedItems.result.ok) {
            console.log('insertedItems', insertedItems);
            throw new Error('Error inserting items');
        }

        return res.send('Sucessfully seeded');
    } catch (err) {
        return res.status(400).send(err);
    }
};
