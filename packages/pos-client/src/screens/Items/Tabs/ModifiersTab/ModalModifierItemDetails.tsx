import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Content, Form, Input, Item, Label, Separator, Text } from '../../../../core';
import { Modifier, ModifierItem, ModifierItemPrice, PriceGroup, tableNames } from '../../../../models';
import { SHORT_NAME_LENGTH } from '../../../../utils/consts';
import { commonStyles } from '../../../Settings/Tabs/styles';

type ModalModifierItemDetailsOuterProps = {
  database: Database;
  onClose: () => void;
  modifierItem?: ModifierItem;
  modifier: Modifier;
};

type ModalModifierItemDetailsInnerProps = {
  modifierItemPrices?: ModifierItemPrice[];
  priceGroups: PriceGroup[];
};

const modifierItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  shortName: Yup.string()
    .min(2, 'Too Short')
    .max(SHORT_NAME_LENGTH, 'Too Long')
    .required('Required'),
  prices: Yup.array()
    .of(
      Yup.object().shape({
        modifierItemPrice: Yup.object(),
        price: Yup.number(),
      }),
    )
    .required(),
});

type FormValues = {
  name: string;
  shortName: string;
  prices: { priceGroup: PriceGroup; price: string }[];
};

export const ModalModifierItemDetailsInner: React.FC<ModalModifierItemDetailsOuterProps &
  ModalModifierItemDetailsInnerProps> = ({ modifierItem, onClose, priceGroups, modifier, modifierItemPrices = [] }) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const keyedMofifierItemPricesByPriceGroup = keyBy(
    modifierItemPrices,
    modifierItemPrice => modifierItemPrice.priceGroupId,
  );

  const onSave = async (values: FormValues) => {
    const { name, shortName, prices } = values;
    setLoading(true);

    if (modifierItem) {
      // update
      const reMappedPrices = prices.map(({ priceGroup, price }) => {
        const modifierItemPrice = keyedMofifierItemPricesByPriceGroup[priceGroup.id];
        const nullOrPrice = price === '' ? null : parseInt(price);

        return {
          modifierItemPrice,
          price: nullOrPrice,
        };
      });

      const remappedUpdate = {
        name,
        shortName,
        prices: reMappedPrices,
      };

      console.log('remappedUpdate', remappedUpdate);
      await database.action(() => modifierItem.updateItem(remappedUpdate));
    } else {
      console.log('creating');
      // create
      const modifierItemCollection = database.collections.get<ModifierItem>(tableNames.modifierItems);
      const modifierItemPriceCollection = database.collections.get<ModifierItemPrice>(tableNames.modifierItemPrices);

      await database.action(async () => {
        const modifierItemToCreate = modifierItemCollection.prepareCreate(record => {
          record.modifier.set(modifier);
          Object.assign(record, { name, shortName });
        });

        const modifierItemPricesToCreate = prices.map(({ priceGroup, price }) => {
          const nullOrPrice = price === '' ? null : parseInt(price);

          return modifierItemPriceCollection.prepareCreate(record => {
            record.priceGroup.set(priceGroup);
            record.modifierItem.set(modifierItemToCreate);

            Object.assign(record, { price: nullOrPrice });
          });
        });

        const batched = [modifierItemToCreate, ...modifierItemPricesToCreate];

        console.log('batched', batched);
        await database.batch(...batched);
      });
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: modifierItem?.name || '',
    shortName: modifierItem?.shortName || '',
    prices: priceGroups.map(priceGroup => {
      /**
       * the 2 null checks here cover 2 scenarios:
       * - the item price doesnt exist because this is the "create" modal.
       * - the price exists but has been set to null to prevent the item being selected for this price group.
       */
      const priceOrEmptyString = keyedMofifierItemPricesByPriceGroup[priceGroup.id]?.price?.toString() || '';
      return {
        priceGroup,
        price: priceOrEmptyString,
      };
    }),
  };

  const onDelete = async () => {
    await database.action(() => modifierItem.markAsDeleted());
    onClose();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={modifierItemSchema} onSubmit={values => onSave(values)}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values, isValid }) => {
        const { name, prices, shortName } = values;
        const err = {
          name: !!(touched.name && errors.name),
          shortName: !!(touched.shortName && errors.shortName),
          prices: !!(touched.prices && errors.prices),
        };

        const title = modifierItem ? `${capitalize(modifierItem.name)}` : 'New Modifier Item';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            isPrimaryDisabled={loading}
            isDeleteDisabled={!isValid}
            onPressDelete={onDelete}
            size="small"
          >
            <Content>
              <Form style={commonStyles.form}>
                <Item stackedLabel error={err.name}>
                  <Label>Name</Label>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </Item>
                <Item stackedLabel error={err.name}>
                  <Label>Short Name</Label>
                  <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
                </Item>
                <Separator bordered style={{ marginTop: 30, padding: 10 }}>
                  <Text>Prices</Text>
                </Separator>
                {prices.map(({ price, priceGroup }, index) => {
                  return (
                    <Item key={priceGroup.id} stackedLabel error={err.prices}>
                      <Label>{priceGroup.name}</Label>
                      <Input
                        onChangeText={handleChange(`prices[${index}].price`)}
                        onBlur={handleBlur(`prices[${index}].price`)}
                        value={price.toString()}
                      />
                    </Item>
                  );
                })}
              </Form>
            </Content>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

export const ModalModifierItemDetails = withDatabase(
  withObservables<ModalModifierItemDetailsOuterProps, ModalModifierItemDetailsInnerProps>(
    ['modifierItem', 'modifier'],
    ({ modifierItem, modifier, database }) => {
      if (modifierItem) {
        return {
          modifier,
          modifierItem,
          modifierItemPrices: modifierItem.prices.observeWithColumns(['price']),
          priceGroups: database.collections
            .get<PriceGroup>(tableNames.priceGroups)
            .query()
            .observeWithColumns(['name']),
        };
      } else {
        return {
          modifier,
          priceGroups: database.collections
            .get<PriceGroup>(tableNames.priceGroups)
            .query()
            .observeWithColumns(['name']),
        };
      }
    },
  )(ModalModifierItemDetailsInner),
);
