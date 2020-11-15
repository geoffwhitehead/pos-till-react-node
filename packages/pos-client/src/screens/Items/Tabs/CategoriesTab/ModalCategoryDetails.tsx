import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { Form, Input, Item, Label } from '../../../../core';
import { Category, tableNames } from '../../../../models';

type ModalCategoryDetailsOuterProps = {
  onClose: () => void;
  category?: Category;
};

type ModalCategoryDetailsInnerProps = {
  itemsCount?: number;
};
const categorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  shortName: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long'),
  color: Yup.string()
    .length(7, 'Incorrect length')
    .required(),
  positionIndex: Yup.number().required(),
});

type FormValues = {
  // name: string;
  shortName: string;
  color: string;
  positionIndex: string;
};

export const ModalCategoryDetailsInner: React.FC<ModalCategoryDetailsOuterProps & ModalCategoryDetailsInnerProps> = ({
  category,
  onClose,
  itemsCount,
}) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const update = async (values: FormValues, category: Category) => {
    setLoading(true);
    if (category) {
      await database.action(() => category.update(record => Object.assign(record, { shortName: values.shortName })));
    } else {
      const categoryCollection = database.collections.get<Category>(tableNames.categories);
      await database.action(() => categoryCollection.create(record => Object.assign(record, values)));
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: category?.name || '',
    shortName: category?.shortName || '',
    color: category?.color || '#FFFFFF',
    positionIndex: category?.positionIndex.toString() || '0',
  };

  const onDelete = async () => {
    database.action(() => category.markAsDeleted());
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={categorySchema}
      onSubmit={values => update(values, category)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { shortName, name, color, positionIndex } = values;
        const err = {
          name: !!(touched.name && errors.name),
          shortName: !!(touched.shortName && errors.shortName),
          color: !!(touched.color && errors.color),
          positionIndex: !!(touched.positionIndex && errors.positionIndex),
        };

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title="Category Details"
            isPrimaryDisabled={loading}
            size="small"
            isDeleteDisabled={category && itemsCount > 0}
            onPressDelete={onDelete}
          >
            <Form>
              {!category && (
                <Item stackedLabel error={err.name}>
                  <Label>Name</Label>
                  <Input
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={name}
                    disabled={!!category}
                  />
                </Item>
              )}
              <Item stackedLabel error={err.shortName}>
                <Label>Short Name</Label>
                <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
              </Item>
              <Item stackedLabel error={err.shortName}>
                <Label>Color</Label>
                <Input onChangeText={handleChange('color')} onBlur={handleBlur('color')} value={color} />
              </Item>
              <Item stackedLabel error={err.shortName}>
                <Label>Position Index</Label>
                <Input
                  onChangeText={handleChange('positionIndex')}
                  onBlur={handleBlur('positionIndex')}
                  value={positionIndex}
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
  withObservables<ModalCategoryDetailsOuterProps, ModalCategoryDetailsInnerProps>(['category'], ({ category }) => {
    return {
      category,
      itemsCount: category.items.observeCount(),
    };
  })(c);

export const ModalCategoryDetails = enhance(ModalCategoryDetailsInner);
