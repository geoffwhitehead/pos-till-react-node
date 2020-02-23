import { getItems } from '../api/items';
import { realm } from './Realm';
import { getCategories } from '../api/category';
import { getModifiers } from '../api/modifier';
import { getDiscounts } from '../api/discount';
import { getPaymentTypes } from '../api/paymentTypes';
import { DiscountSchema, ItemSchema, PaymentTypeSchema } from './schemas';

export const populate = async () => {
  try {
    const [
      { data: items },
      { data: categories },
      { data: modifiers },
      { data: discounts },
      { data: paymentTypes },
    ] = await Promise.all([getItems(), getCategories(), getModifiers(), getDiscounts(), getPaymentTypes()]);

    // add ids, mongoose doesnt store them seperately ont he server
    const remappedModifiers = modifiers.map(modifier => {
      return {
        ...modifier,
        mods: modifier.mods.map((mod, index) => {
          return {
            ...mod,
            // TODO: might be better to create _ids on server and change data structure
            _id: index.toString(),
            price: parseInt(mod.price),
          };
        }),
      };
    });

    realm.write(() => {
      // realm.deleteAll();
      paymentTypes.map(paymentType => realm.create(PaymentTypeSchema.name, paymentType));
      discounts.map(discount => realm.create(DiscountSchema.name, discount));
      items.map(item => {
        const i = {
          ...item,
          categoryId: categories.find(c => c._id === item.categoryId),
          modifierId: item.modifierId ? remappedModifiers.find(m => m._id === item.modifierId) : null,
        };
        realm.create(ItemSchema.name, i, true);
        // need to update item.category with object
      });
    });
  } catch (err) {
    console.log('ERROR ', err);
  }
};
