import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import { capitalize, omit } from 'lodash';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { ModalColorPickerContent } from '../../../../components/ModalColorPicker/ModalColorPicker';
import { RecentColorsContext } from '../../../../contexts/RecentColorsContext';
import { Form, Input, Item, Label } from '../../../../core';
import { Category, tableNames } from '../../../../models';
import { colors } from '../../../../theme';

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
  backgroundColor: Yup.string()
    .length(7, 'Incorrect length')
    .required(),
  textColor: Yup.string()
    .length(7, 'Incorrect length')
    .required(),
  positionIndex: Yup.number().required(),
});

type FormValues = {
  // name: string;
  shortName: string;
  backgroundColor: string;
  textColor: string;
  positionIndex: string;
};

export const ModalCategoryDetailsInner: React.FC<ModalCategoryDetailsOuterProps & ModalCategoryDetailsInnerProps> = ({
  category,
  onClose,
  itemsCount,
}) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const { recentColors, setRecentColors } = useContext(RecentColorsContext);

  const update = async (values: FormValues, category: Category) => {
    setLoading(true);
    if (category) {
      await database.action(() =>
        category.update(record =>
          Object.assign(record, { ...omit(values, 'name'), positionIndex: parseInt(values.positionIndex) }),
        ),
      );
    } else {
      const categoryCollection = database.collections.get<Category>(tableNames.categories);
      await database.action(() =>
        categoryCollection.create(record =>
          Object.assign(record, {
            ...values,
            positionIndex: parseInt(values.positionIndex),
          }),
        ),
      );
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: category?.name || '',
    shortName: category?.shortName || '',
    backgroundColor: category?.backgroundColor || colors.theme.highlightBlue,
    textColor: category?.textColor || 'white',
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
        const { shortName, name, backgroundColor, textColor, positionIndex } = values;
        const err = {
          name: !!(touched.name && errors.name),
          shortName: !!(touched.shortName && errors.shortName),
          backgroundColor: !!(touched.backgroundColor && errors.backgroundColor),
          textColor: !!(touched.textColor && errors.textColor),
          positionIndex: !!(touched.positionIndex && errors.positionIndex),
        };

        const title = category ? `${capitalize(category.name)}` : 'New Category';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
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
                <Label>Position Index</Label>
                <Input
                  onChangeText={handleChange('positionIndex')}
                  onBlur={handleBlur('positionIndex')}
                  value={positionIndex}
                />
              </Item>
              <Item stackedLabel style={styles.colorPickerItem}>
                <Label>Background Color</Label>
                <ModalColorPickerContent
                  style={styles.colorPicker}
                  onChangeColor={handleChange('backgroundColor')}
                  colorHex={backgroundColor}
                  globalRecentColors={recentColors}
                  setGlobalRecentColors={setRecentColors}
                />
              </Item>
              <Item stackedLabel style={styles.colorPickerItem}>
                <Label>Text Color</Label>
                <ModalColorPickerContent
                  style={styles.colorPicker}
                  onChangeColor={handleChange('textColor')}
                  colorHex={textColor}
                  globalRecentColors={recentColors}
                  setGlobalRecentColors={setRecentColors}
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

const styles = {
  colorPickerItem: {
    flexDirection: 'column',
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'flex-start',
  },
  colorPicker: { width: '100%', flex: 0 },
} as const;
