import { database } from '../../App';
import { Models } from '../../models';
import {
  ItemProps,
  CategoryProps,
  PriceGroupProps,
  PrinterProps,
  ModifierProps,
  ModifierItemProps,
} from '../../services/schemas';
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

  let toCreate = [];

  const okResponse = response => {
    if (response.ok && response.data?.success) {
      return response.data.data;
    } else {
      throw new Error('Failed: Response: ' + response.data?.success + 'Problem: ' + response.problem);
    }
  };
  const categoriesCollection = database.collections.get<CategoryProps & Model>('categories');
  const priceGroupsCollection = database.collections.get<PriceGroupProps & Model>('price_groups');
  const printersCollection = database.collections.get<PrinterProps & Model>('printers');

  console.log('--------------- START');
  const categoriesToCreate = okResponse(responses[1]).map(({ _id, name }) =>
    categoriesCollection.prepareCreate(
      catchFn(category => {
        category._raw = sanitizedRaw({ id: _id, name }, categoriesCollection.schema);
      }),
    ),
  );

  toCreate.push(...categoriesToCreate);

  const priceGroupsToCreate = okResponse(responses[4]).map(({ _id, name }) =>
    priceGroupsCollection.prepareCreate(
      catchFn(priceGroup => {
        priceGroup._raw = sanitizedRaw({ id: _id, name }, priceGroupsCollection.schema);
        priceGroup.name = name;
      }),
    ),
  );
  toCreate.push(...priceGroupsToCreate);

  const printersToCreate = okResponse(responses[2]).map(({ _id, name, type, address }) =>
    printersCollection.prepareCreate(
      catchFn(printer => {
        printer._raw = sanitizedRaw({ id: _id }, printersCollection.schema);
        printer.name = name;
        printer.type = type;
        printer.address = address;
      }),
    ),
  );

  toCreate.push(...printersToCreate);
  console.log('--------------- MARK');

  okResponse(responses[2]).map(({ _id, name, items }) => {
    const modifiersCollection = database.collections.get<ModifierProps & Model>('modifiers');
    const modifierItemsCollection = database.collections.get<any>('modifier_items');
    const modifierPriceCollection = database.collections.get<any>('modifier_prices');

    const modifier = modifiersCollection.prepareCreate(
      catchFn(modifier => {
        modifier._raw = sanitizedRaw({ id: _id, name }, modifiersCollection.schema);
        modifier.name = name;
      }),
    );

    items.map(mItem => {
      const itemToCreate = modifierItemsCollection.prepareCreate(
        catchFn(newItem => {
          newItem._raw = sanitizedRaw(
            { id: mItem._id, name: mItem.name, modifier_id: _id },
            modifierItemsCollection.schema,
          );
          newItem.name = mItem.name;
          newItem.modifier_id = _id;
        }),
      );

      const pricesToCreate = mItem.price.map(price =>
        modifierPriceCollection.prepareCreate(
          catchFn(newPrice => {
            newPrice._raw = sanitizedRaw(
              { id: price._id, price: price.amount, price_group_id: price.groupId, modifier_item_id: mItem._id },
              modifierPriceCollection.schema,
            );
            newPrice.price = price.amount;
            newPrice.price_group_id = price.groupId;
            newPrice.modifier_item_id = mItem._id;
          }),
        ),
      );

      toCreate.push(itemToCreate);
      toCreate.push(...pricesToCreate);
    });

    toCreate.push(modifier);

    // TODO: craete mod itesm

    // TODO create mod prices
  });

  console.log('----- AFTER');
  console.log('printersToCreate', printersToCreate);
  //   console.log('*************** categoriesToCreate', JSON.stringify(categoriesToCreate, null, 4));
  //   console.log('*************** responses[1].data.data', JSON.stringify(responses[1].data.data, null, 4));

  try {
    await database.action(async () => {
      await database.batch(...toCreate);
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
