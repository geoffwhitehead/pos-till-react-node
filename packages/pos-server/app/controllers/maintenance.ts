import { Request, Response, response } from 'express';
import faker from 'faker';
import { Category } from '../models';

const rdm = max => Math.floor(Math.random() * max);

export const seed = async (req: Request, res: Response) => {
    const ITEMS_TO_SEED = 20;
    const CATEGORIES_TO_SEED = ['DEFAULT', 'STD', 'MAIN'];

    const categories = CATEGORIES_TO_SEED.map(name => {
        return {
            name,
        };
    });

    console.log('*************** categories', JSON.stringify(categories, null, 4));

    const { result, insertedIds } = await Category.collection.insert(categories);

    if (!result.ok) {
        console.log('result', result);
        throw new Error('Error inserting categories');
    }

    const items = new Array(ITEMS_TO_SEED).map(() => {
        return {
            name: faker.commerce.product(),
            categoryId: insertedIds[rdm(CATEGORIES_TO_SEED.length)],
            price:
                faker.random.number({
                    min: 1,
                    max: 15,
                }) * 100,
            stock: 10,
        };
    });
    return response.status(500).send('BREAK');
};
