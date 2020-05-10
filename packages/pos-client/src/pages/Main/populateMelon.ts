import { database } from '../../App';
import { Models } from '../../models';
import { ItemProps, CategoryProps } from '../../services/schemas';
import { Model } from '@nozbe/watermelondb';
import { getItems } from '../../api/item';
import { getCategories } from '../../api/category';
import { getModifiers } from '../../api/modifier';
import { getDiscounts } from '../../api/discount';
import { getPriceGroups } from '../../api/priceGroup';
import { getPrinters } from '../../api/printer';
import { omit } from 'lodash';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import catchFn from './catchFn';
export const populateMelon = async () => {
  try {
    await database.action(async () => {
      await database.unsafeResetDatabase();
    });
  } catch (e) {
    console.log('ERRROR resetting db :', e);
  }

  const responses = await Promise.all([
    getItems(),
    getCategories(),
    getModifiers(),
    getDiscounts(),
    getPriceGroups(),
    getPrinters(),
  ]);
  const categoriesCollection = database.collections.get<CategoryProps & Model>('categories');

  console.log('--------------- START');
  const categoriesToCreate = responses[1].data.data.map(({ _id, name }) =>
    categoriesCollection.prepareCreate(
      catchFn(category => {
        // category.name = name;
        category._raw = sanitizedRaw({ id: _id, name }, categoriesCollection.schema);
        // r = {
        //   _raw: sanitizedRaw({ id: _id }, categoriesCollection.schema),
        //   name,
        // };
      }),
    ),
  );

  console.log('----- AFTER');
  //   console.log('*************** categoriesToCreate', JSON.stringify(categoriesToCreate, null, 4));
  //   console.log('*************** responses[1].data.data', JSON.stringify(responses[1].data.data, null, 4));
  try {
    await database.action(async () => {
      await database.batch(...categoriesToCreate);
    });
  } catch (e) {
    console.log('ERRROR watermelon :', e);
  }

  console.log('------- CREATED');
  //   try {
  //     await database.action(async () => {
  //       const cats = await database.collections.get<CategoryProps & Model>('categories');
  //       console.log('cats', cats);
  //     });
  //   } catch (e) {
  //     console.log('ERRROR watermelon :', e);
  //   }

  //   const itemsCollection = database.collections.get<ItemProps & Model>('items');
  //   const x = await database.action(async () => {
  //     const newItem = await itemsCollection.create(item => {
  //       item.name = 'test';
  //     });
  //   });
};
