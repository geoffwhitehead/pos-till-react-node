import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { FieldArray, Formik } from 'formik';
import { capitalize, keyBy } from 'lodash';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Content, Form, Input, Separator, Text } from '../../../../core';
import { Modifier, ModifierItem, ModifierItemPrice, PriceGroup, tableNames } from '../../../../models';
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

const generateModifierItemSchema = (shortNameLength: number) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .required('Required'),
    shortName: Yup.string()
      .min(2, 'Too Short')
      .max(shortNameLength, 'Too Long')
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
  const { organization } = useContext(OrganizationContext);

  const modifierItemSchema = generateModifierItemSchema(organization.shortNameLength);
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

      await database.action(() => modifierItem.updateItem(remappedUpdate));
    } else {
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
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>

                <ItemField label="Short Name" touched={touched.shortName} name="shortName" errors={errors.shortName}>
                  <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
                </ItemField>

                <Separator bordered style={{ marginTop: 30, padding: 10 }}>
                  <Text>Prices</Text>
                </Separator>

                <FieldArray
                  name="prices"
                  render={() => {
                    return prices.map(({ price, priceGroup }, index) => {
                      return (
                        <ItemField
                          label={capitalize(priceGroup.name)}
                          touched={touched.prices && touched.prices[index]?.price}
                          name={`prices[${index}].price`}
                          errors={errors.prices && errors.prices[index]}
                        >
                          <Input
                            onChangeText={handleChange(`prices[${index}].price`)}
                            onBlur={handleBlur(`prices[${index}].price`)}
                            value={price.toString()}
                          />
                        </ItemField>
                      );
                    });
                  }}
                />
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
