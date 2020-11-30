import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Body, CheckBox, Form, Input, ListItem, Text, View } from '../../../../core';
import {
  Item as ItemModel,
  ItemPrice,
  ModifierItem,
  ModifierItemPrice,
  PriceGroup,
  tableNames,
} from '../../../../models';
import { commonStyles } from '../../../Settings/Tabs/styles';

interface PriceGroupDetailsProps {
  onClose: () => void;
  priceGroup?: PriceGroup;
}

const generatePriceGroupDetailsSchema = (shortNameLength: number) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .required('Required'),
    shortName: Yup.string()
      .min(2, 'Too Short')
      .max(shortNameLength, 'Too Long'),
    isPrepTimeRequired: Yup.boolean(),
  });

type FormValues = {
  name: string;
  shortName: string;
  isPrepTimeRequired: boolean;
};

export const PriceGroupDetails: React.FC<PriceGroupDetailsProps> = ({ priceGroup, onClose }) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();
  const { organization } = useContext(OrganizationContext);

  const priceGroupDetailsSchema = generatePriceGroupDetailsSchema(organization.shortNameLength);
  const onSave = async (values: FormValues, priceGroup: PriceGroup) => {
    setLoading(true);
    if (priceGroup) {
      await database.action(() => priceGroup.updatePriceGroup(values));
    } else {
      const priceGroupCollection = database.collections.get<PriceGroup>(tableNames.priceGroups);
      const modifierItemsCollection = database.collections.get<ModifierItem>(tableNames.modifierItems);
      const modifierItemPricesCollection = database.collections.get<ModifierItemPrice>(tableNames.modifierItemPrices);
      const itemPricesCollection = database.collections.get<ItemPrice>(tableNames.itemPrices);
      const itemsCollection = database.collections.get<ItemModel>(tableNames.items);

      const [items, modifierItems] = await Promise.all([
        itemsCollection.query().fetch(),
        modifierItemsCollection.query().fetch(),
      ]);

      const priceGroupToCreate = priceGroupCollection.prepareCreate(record => Object.assign(record, values));

      // create null entry for all item prices
      const itemPricesToCreate = items.map(item =>
        itemPricesCollection.prepareCreate(record => {
          record.item.set(item);
          Object.assign(record, {
            priceGroupId: priceGroupToCreate.id,
          });
        }),
      );

      // create null entry for all modifier item prices

      const modifierItemPricesToCreate = modifierItems.map(modifierItem =>
        modifierItemPricesCollection.prepareCreate(record => {
          record.modifierItem.set(modifierItem);
          Object.assign(record, {
            priceGroupId: priceGroupToCreate.id,
          });
        }),
      );

      const batched = [priceGroupToCreate, ...itemPricesToCreate, ...modifierItemPricesToCreate];

      await database.action(() => database.batch(...batched));
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: priceGroup?.name || '',
    shortName: priceGroup?.shortName || '',
    isPrepTimeRequired: priceGroup?.isPrepTimeRequired || false,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={priceGroupDetailsSchema}
      onSubmit={values => onSave(values, priceGroup)}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { name, shortName, isPrepTimeRequired } = values;

        const title = priceGroup ? `${capitalize(priceGroup.name)}` : 'New Price Group';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            isPrimaryDisabled={loading}
            size="small"
          >
            <View>
              <Form style={commonStyles.form}>
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>

                <ItemField label="Short Name" touched={touched.shortName} name="shortName" errors={errors.shortName}>
                  <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
                </ItemField>

                <ListItem>
                  <CheckBox
                    checked={isPrepTimeRequired}
                    onPress={() => setFieldValue('isPrepTimeRequired', !isPrepTimeRequired)}
                    onBlur={handleBlur('isPrepTimeRequired')}
                  />
                  <Body>
                    <Text>Is prep time required</Text>
                  </Body>
                </ListItem>
              </Form>
            </View>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
