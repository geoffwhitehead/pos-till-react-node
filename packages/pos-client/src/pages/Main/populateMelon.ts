import { database } from '../../App';
import { Models, tNames } from '../../models';
import {
  ItemProps,
  CategoryProps,
  PriceGroupProps,
  PrinterProps,
  ModifierProps,
  ModifierItemProps,
  DiscountProps,
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
import { getOrganization } from '../../api/organization';
export const populateMelon = async () => {
  // return;
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
        category._raw = sanitizedRaw({ id: _id }, categoriesCollection.schema);
        Object.assign(category, { name });
      }),
    ),
  );

  toCreate.push(...categoriesToCreate);

  const priceGroupsToCreate = okResponse(responses[4]).map(({ _id, name }) =>
    priceGroupsCollection.prepareCreate(
      catchFn(priceGroup => {
        priceGroup._raw = sanitizedRaw({ id: _id }, priceGroupsCollection.schema);
        Object.assign(priceGroup, { name });
      }),
    ),
  );
  toCreate.push(...priceGroupsToCreate);

  const printersToCreate = okResponse(responses[5]).map(({ _id, name, type, address }) =>
    printersCollection.prepareCreate(
      catchFn(printer => {
        printer._raw = sanitizedRaw({ id: _id }, printersCollection.schema);
        Object.assign(printer, { name, type, address });
      }),
    ),
  );

  toCreate.push(...printersToCreate);

  const discountsToCreate = okResponse(responses[3]).map(({ _id, name, amount, isPercent }) => {
    const discountsCollection = database.collections.get<DiscountProps & Model>(tNames.discounts);
    return discountsCollection.prepareCreate(
      catchFn(discount => {
        discount._raw = sanitizedRaw({ id: _id }, discountsCollection.schema);
        Object.assign(discount, { name, amount, isPercent });
      }),
    );
  });

  toCreate.push(...discountsToCreate);

  okResponse(responses[0]).map(
    ({ _id: itemId, name, categoryId, price: itemPrices, modifiers, linkedPrinters: linkedPrinterIds }) => {
      const itemsCollection = database.collections.get<ItemProps & Model>(tNames.items);
      const itemPricesCollection = database.collections.get(tNames.itemPrices);
      const itemPrintersCollection = database.collections.get(tNames.itemPrinters);
      const itemModifiersCollection = database.collections.get(tNames.itemModifiers);

      const itemModifiersToCreate = modifiers.map(modifierId => {
        return itemModifiersCollection.prepareCreate(
          catchFn(_itemModifier => {
            Object.assign(_itemModifier, { itemId, modifierId });
          }),
        );
      });

      const itemPricesToCreate = itemPrices.map(itemPrice =>
        itemPricesCollection.prepareCreate(
          catchFn(_itemPrice => {
            _itemPrice._raw = sanitizedRaw({ id: itemPrice._id }, itemPricesCollection.schema);
            Object.assign(_itemPrice, {
              price: itemPrice.amount,
              priceGroupId: itemPrice.groupId,
              itemId,
            });
          }),
        ),
      );

      const printerLinksToCreate = linkedPrinterIds.map(linkedPrinterId => {
        return itemPrintersCollection.prepareCreate(
          catchFn(_itemPrinter => {
            Object.assign(_itemPrinter, { itemId, printerId: linkedPrinterId });
          }),
        );
      });

      const itemToCreate = itemsCollection.prepareCreate(
        catchFn(item => {
          item._raw = sanitizedRaw({ id: itemId }, itemsCollection.schema);
          Object.assign(item, { name, categoryId });
        }),
      );

      toCreate.push(...itemModifiersToCreate, ...itemPricesToCreate, ...printerLinksToCreate, itemToCreate);
    },
  );

  okResponse(responses[2]).map(({ _id, name, items, maxItems, minItems }) => {
    const modifiersCollection = database.collections.get<ModifierProps & Model>(tNames.modifiers);
    const modifierItemsCollection = database.collections.get<any>(tNames.modifierItems);
    const modifierPriceCollection = database.collections.get<any>(tNames.modifierPrices);

    const modifier = modifiersCollection.prepareCreate(
      catchFn(modifier => {
        modifier._raw = sanitizedRaw({ id: _id }, modifiersCollection.schema);
        Object.assign(modifier, { name, maxItems, minItems });
      }),
    );

    items.map(mItem => {
      const modifierToCreate = modifierItemsCollection.prepareCreate(
        catchFn(newItem => {
          newItem._raw = sanitizedRaw({ id: mItem._id }, modifierItemsCollection.schema);
          Object.assign(newItem, { name: mItem.name, modifierId: _id });
        }),
      );

      const pricesToCreate = mItem.price.map(price =>
        modifierPriceCollection.prepareCreate(
          catchFn(newPrice => {
            newPrice._raw = sanitizedRaw({ id: price._id }, modifierPriceCollection.schema);
            Object.assign(newPrice, {
              price: price.amount,
              priceGroupId: price.groupId,
              modifierItemId: mItem._id,
            });
          }),
        ),
      );
      toCreate.push(modifierToCreate, ...pricesToCreate);
    });
    toCreate.push(modifier);
  });

  console.log('toCreate', toCreate);
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
