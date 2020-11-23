import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import SwitchSelector from 'react-native-switch-selector';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Form, Input, ListItem, View } from '../../../../core';
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
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>

                <ItemField label="Amount" touched={touched.amount} name="amount" errors={errors.amount}>
                  <Input onChangeText={handleChange('amount')} onBlur={handleBlur('amount')} value={amount} />
                </ItemField>

                <ListItem>
                  <SwitchSelector
                    options={[
                      { label: 'Fixed Amount', value: 0 },
                      { label: 'Percentage', value: 1 },
                    ]}
                    initial={isPercent ? 1 : 0}
                    onPress={value => setFieldValue('isPercent', !!value)}
                    style={{ paddingRight: 10 }}
                  />
                </ListItem>
              </Form>
            </View>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
