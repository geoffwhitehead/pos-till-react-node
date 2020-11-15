import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Form, Input, Item, Label } from '../../../../core';
import { Modifier, tableNames } from '../../../../models';
import { commonStyles } from '../../../Settings/Tabs/styles';

type ModalModifierDetailsOuterProps = {
  onClose: () => void;
  modifier?: Modifier;
};

type ModalModifierDetailsInnerProps = {
  itemsCount?: number;
};
const modifierSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  // minItems: Yup.number().min(0, 'Must be a positive number'),
  minItems: Yup.number()
    .positive('Must be positive')
    .required('This field is required.')
    .when(['maxItems'], (maxItems, schema) => {
      return schema.max(maxItems);
    }),
  maxItems: Yup.number()
    .positive('Must be positive')
    .required('This field is required.'),
});

type FormValues = {
  name: string;
  minItems: string;
  maxItems: string;
};

export const ModalModifierDetailsInner: React.FC<ModalModifierDetailsOuterProps & ModalModifierDetailsInnerProps> = ({
  modifier,
  onClose,
  itemsCount,
}) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const update = async (values: FormValues, modifier: Modifier) => {
    setLoading(true);
    const { name, minItems, maxItems } = values;

    if (modifier) {
      await database.action(() =>
        modifier.updateItem({
          name,
          minItems: parseInt(minItems),
          maxItems: parseInt(maxItems),
        }),
      );
    } else {
      const modifierCollection = database.collections.get<Modifier>(tableNames.modifiers);
      await database.action(() => modifierCollection.create(record => Object.assign(record, values)));
    }

    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: modifier?.name || '',
    minItems: modifier?.minItems.toString() || '0',
    maxItems: modifier?.maxItems.toString() || '1',
  };

  const onDelete = async () => {
    await database.action(() => modifier.remove());
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={modifierSchema}
      onSubmit={values => update(values, modifier)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { name, minItems, maxItems } = values;
        const err = {
          name: !!(touched.name && errors.name),
          minItems: !!(touched.minItems && errors.minItems),
          maxItems: !!(touched.maxItems && errors.maxItems),
        };

        const title = modifier ? `${capitalize(modifier.name)}` : 'New Modifier';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            isPrimaryDisabled={loading}
            isDeleteDisabled={itemsCount > 0}
            onPressDelete={onDelete}
            size="small"
          >
            <Form style={commonStyles.form}>
              <Item stackedLabel error={err.name}>
                <Label>Name</Label>
                <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
              </Item>
              <Item stackedLabel error={err.minItems}>
                <Label>Min Items</Label>
                <Input onChangeText={handleChange('minItems')} onBlur={handleBlur('minItems')} value={minItems} />
              </Item>
              <Item stackedLabel error={err.minItems}>
                <Label>Max Items</Label>
                <Input onChangeText={handleChange('maxItems')} onBlur={handleBlur('maxItems')} value={maxItems} />
              </Item>
            </Form>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const enhance = c =>
  withObservables<ModalModifierDetailsOuterProps, ModalModifierDetailsInnerProps>(['modifier'], ({ modifier }) => {
    return {
      modifier,
      itemsCount: modifier.itemModifiers.observeCount(),
    };
  })(c);

export const ModalModifierDetails = enhance(ModalModifierDetailsInner);
