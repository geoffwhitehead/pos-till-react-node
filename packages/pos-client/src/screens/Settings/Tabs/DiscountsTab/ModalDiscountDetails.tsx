import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Body, CheckBox, Form, Input, Item, Label, ListItem, Text, View } from '../../../../core';
import { Discount, tableNames } from '../../../../models';
import { commonStyles } from '../styles';

interface ModalDiscountDetailsProps {
  onClose: () => void;
  discount?: Discount;
}

const discountDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  amount: Yup.number()
    .min(1, 'Too Low')
    .required('Required'),
  isPercent: Yup.boolean().required('Choose discount type'),
});

type FormValues = {
  name: string;
  amount: string;
  isPercent: boolean;
};

export const ModalDiscountDetails: React.FC<ModalDiscountDetailsProps> = ({ discount, onClose }) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const onSave = async (values: FormValues, discount: Discount) => {
    setLoading(true);
    const { name, amount, isPercent } = values;
    if (discount) {
      /**
       * TODO: i dont think this path will be used. Updating a discount probably wont be allowed.
       */
    } else {
      const discountCollection = database.collections.get<Discount>(tableNames.discounts);

      await database.action(() =>
        discountCollection.create(record => {
          Object.assign(record, {
            name,
            amount: parseInt(amount),
            isPercent,
          });
        }),
      );
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: discount?.name || '',
    amount: discount?.amount.toString() || '0',
    isPercent: discount?.isPercent || false,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={discountDetailsSchema}
      onSubmit={values => onSave(values, discount)}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { name, amount, isPercent } = values;
        const err = {
          name: !!(touched.name && errors.name),
          amount: !!(touched.amount && errors.amount),
          // isPercent: !!(touched.isPercent && errors.isPrepTimeRequired),
        };

        const title = discount ? `${capitalize(discount.name)}` : 'New Discount';

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
                <Item stackedLabel error={err.name}>
                  <Label>Name</Label>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </Item>
                <Item stackedLabel error={err.amount}>
                  <Label>Amount</Label>
                  <Input onChangeText={handleChange('amount')} onBlur={handleBlur('amount')} value={amount} />
                </Item>
                <ListItem>
                  <CheckBox
                    checked={isPercent}
                    onPress={() => setFieldValue('isPercent', !isPercent)}
                    onBlur={handleBlur('isPercent')}
                  />
                  <Body>
                    <Text>Is this a fixed or percentage discount?</Text>
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
