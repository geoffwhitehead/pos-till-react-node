import { getItems } from '../api/item';
import { realm } from './Realm';
import { getCategories } from '../api/category';
import { getModifiers } from '../api/modifier';
import { getDiscounts } from '../api/discount';
import { getPaymentTypes } from '../api/paymentType';
import { getPrinters } from '../api/printer';
import { getPriceGroups, PriceGroupItemServerProps } from '../api/priceGroup';
import {
  DiscountSchema,
  ItemSchema,
  PaymentTypeSchema,
  PriceGroupItemProps,
  PrinterSchema,
  AddressSchema,
  OrganizationSchema,
  PriceGroupSchema,
  ItemProps,
  PrinterProps,
} from './schemas';
import uuidv4 from 'uuid/v4';
import { getOrganization } from '../api/organization';
import AsyncStorage from '@react-native-community/async-storage';

export const populate = async (params: { userId: string; organizationId: string }) => {
  const { organizationId, userId } = params;

  try {
    // fetch the organization first ao that any expired tokens can be updated
    const { data: organization, ok: organizationResponse } = await getOrganization(organizationId);


    
    if (!organizationResponse) {
      throw new Error('Failed fetching organization');
    }

    // const at = await AsyncStorage.getItem('accessToken');
    // const rt = await AsyncStorage.getItem('refreshToken');

    // console.log('!!!!!!!! at', at);
    // console.log('!!!!!!! rt', rt);
    const responses = await Promise.all([
      getItems(),
      getCategories(),
      getModifiers(),
      getDiscounts(),
      getPriceGroups(),
      getPrinters(),
    ]);

    const paymentTypes = await getPaymentTypes();
    const [items, categories, modifiers, discounts, priceGroups, printers] = responses;

    console.log('priceGroups', priceGroups);
    // TODO: remove after dev
    realm.write(() => {
      realm.deleteAll();
    });
    if (responses.some(r => !r.data?.success)) {
      throw new Error('Failed to populate data');
    }
    const resolvePriceGroup: (price: PriceGroupItemServerProps[]) => PriceGroupItemProps[] = price => {
      try {
        return price.map(priceGroup => {
          const pG = priceGroups.data.data.find(({ _id }) => _id === priceGroup.groupId);
          return {
            price: parseInt(priceGroup.amount),
            groupId: pG,
          };
        });
      } catch (err) {
        throw Error(
          'Error trying to resolve a price group lookup, most likely the price group added to a modifier or item no longer exists',
        );
      }
    };

    const resolveLinkedPrinters = (item: ItemProps): PrinterProps[] => {
      const populatedPrinters = item.linkedPrinters.reduce((acc, printerId) => {
        const linkedPrinter = printers.data.data.find(({ _id }) => _id === printerId);
        if (!linkedPrinter) {
          console.error(`Printer ${printerId} not found for item: ${item._id}`);
          return acc;
        }

        return [...acc, linkedPrinter];
      }, []);

      return populatedPrinters;
    };

    // add ids, mongoose doesnt store them seperately on the server
    const remappedModifiers = modifiers.data.data.map(modifier => {
      return {
        ...modifier,
        mods: modifier.mods.map(mod => {
          return {
            ...mod,
            // TODO: might be better to create _ids on server and change data structure
            _id: uuidv4(),
            price: resolvePriceGroup(mod.price),
          };
        }),
      };
    });

    const {
      address: { line1, line2 = '', county, city, postcode },
      _id,
      name,
      email,
      phone,
    } = organization.data;

    const orgAddress = {
      _id: uuidv4(),
      line1,
      line2,
      city,
      county,
      postcode,
    };

    const org = {
      _id,
      name,
      email,
      phone,
    };

    console.log('printers', printers);

    realm.write(() => {
      realm.create(AddressSchema.name, orgAddress);
      realm.create(OrganizationSchema.name, org);
      priceGroups.data.data.map(priceGroup => realm.create(PriceGroupSchema.name, priceGroup));
      printers.data.data.map(printer => realm.create(PrinterSchema.name, printer));
      paymentTypes.data.data.map(paymentType => realm.create(PaymentTypeSchema.name, paymentType));
      discounts.data.data.map(discount => realm.create(DiscountSchema.name, discount));
      items.data.data.map(item => {
        const i = {
          ...item,
          categoryId: categories.data.data.find(c => c._id === item.categoryId),
          modifierId: item.modifierId ? remappedModifiers.find(({ _id }) => _id === item.modifierId) : null,
          price: resolvePriceGroup(item.price),
          linkedPrinters: resolveLinkedPrinters(item),
        };
        realm.create(ItemSchema.name, i, true);
        // need to update item.category with object
      });
    });

    console.log('Done populating');
  } catch (err) {
    console.error('Error populting ', err);
  }
};
