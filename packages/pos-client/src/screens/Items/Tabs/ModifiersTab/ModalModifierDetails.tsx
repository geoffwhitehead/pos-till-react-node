import React, { useState } from 'react';
import { Form, Label, Input, Item, Text, Col, Row, Grid } from '../../../../core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { commonStyles } from '../../../Settings/sub-components/styles';
import { Category, Modifier, tableNames } from '../../../../models';
import withObservables from '@nozbe/with-observables';

type ModalModifierDetailsOuterProps = {
  onClose: () => void;
  modifier: Modifier;
};

type ModalModifierDetailsInnerProps = {
  itemsCount: number;
};
const modifierSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  minItems: Yup.number().min(0, 'Must be a positive number'),
  maxItems: Yup.number().min(1, 'Must be number greater than 1'),
});

type FormValues = {
  name: string;
  minItems: number;
  maxItems: number;
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
    if (modifier) {
      await database.action(() => modifier.update(record => Object.assign(record, values)));
    } else {
      const modifierCollection = database.collections.get<Modifier>(tableNames.modifiers);
      await database.action(() => modifierCollection.create(record => Object.assign(record, values)));
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: modifier?.name || '',
    minItems: modifier?.minItems || 0,
    maxItems: modifier?.maxItems || 1,
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

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title="Modifier Details"
            isPrimaryDisabled={loading}
            isDeleteDisabled={itemsCount > 0}
            onPressDelete={onDelete}
            style={{ width: 600 }}
          >
            <Form style={commonStyles.form}>
              <Item stackedLabel error={err.name}>
                <Label>Name</Label>
                <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
              </Item>
              <Item stackedLabel error={err.minItems}>
                <Label>Min Items</Label>
                <Input
                  onChangeText={handleChange('minItems')}
                  onBlur={handleBlur('minItems')}
                  value={minItems.toString()}
                />
              </Item>
              <Item stackedLabel error={err.minItems}>
                <Label>Max Items</Label>
                <Input
                  onChangeText={handleChange('maxItems')}
                  onBlur={handleBlur('maxItems')}
                  value={maxItems.toString()}
                />
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
