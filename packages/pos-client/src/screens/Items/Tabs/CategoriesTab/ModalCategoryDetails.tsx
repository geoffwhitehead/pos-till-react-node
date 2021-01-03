import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { Formik } from 'formik';
import { capitalize, omit } from 'lodash';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { ModalColorPickerContent } from '../../../../components/ModalColorPicker/ModalColorPicker';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { RecentColorsContext } from '../../../../contexts/RecentColorsContext';
import { Form, Input } from '../../../../core';
import { Category, tableNames } from '../../../../models';
import { colors } from '../../../../theme';
import { moderateScale } from '../../../../utils/scaling';

type ModalCategoryDetailsOuterProps = {
  onClose: () => void;
  category?: Category;
};

type ModalCategoryDetailsInnerProps = {
  itemsCount?: number;
};

type FormValues = {
  // name: string;
  shortName: string;
  backgroundColor: string;
  textColor: string;
  positionIndex: string;
};

const generateCategorySchema = (shortNameLength: number) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .required('Required'),
    shortName: Yup.string()
      .min(2, 'Too Short')
      .max(shortNameLength, 'Too Long'),
    backgroundColor: Yup.string()
      .length(7, 'Incorrect length')
      .required(),
    textColor: Yup.string()
      .length(7, 'Incorrect length')
      .required(),
    positionIndex: Yup.number().required(),
  });

export const ModalCategoryDetailsInner: React.FC<ModalCategoryDetailsOuterProps & ModalCategoryDetailsInnerProps> = ({
  category,
  onClose,
  itemsCount,
}) => {
  const { organization } = useContext(OrganizationContext);
  const { recentColors, setRecentColors } = useContext(RecentColorsContext);
  const database = useDatabase();

  const [loading, setLoading] = useState(false);

  const categorySchema = generateCategorySchema(organization.shortNameLength);

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
    backgroundColor: category?.backgroundColor || colors.highlightBlue,
    textColor: category?.textColor || '#ffffff',
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
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>
              )}

              <ItemField label="Short Name" touched={touched.shortName} name="shortName" errors={errors.shortName}>
                <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
              </ItemField>

              <ItemField
                label="Grid Position"
                touched={touched.positionIndex}
                name="positionIndex"
                errors={errors.positionIndex}
              >
                <Input
                  onChangeText={handleChange('positionIndex')}
                  onBlur={handleBlur('positionIndex')}
                  value={positionIndex}
                />
              </ItemField>

              <ItemField
                style={styles.colorPickerItem}
                label="Background Color"
                touched={touched.backgroundColor}
                name="backgroundColor"
                errors={errors.backgroundColor}
              >
                <ModalColorPickerContent
                  style={styles.colorPicker}
                  onChangeColor={handleChange('backgroundColor')}
                  colorHex={backgroundColor}
                  globalRecentColors={recentColors}
                  setGlobalRecentColors={setRecentColors}
                />
              </ItemField>

              <ItemField
                style={styles.colorPickerItem}
                label="Text Color"
                touched={touched.textColor}
                name="textColor"
                errors={errors.textColor}
              >
                <ModalColorPickerContent
                  style={styles.colorPicker}
                  onChangeColor={handleChange('textColor')}
                  colorHex={textColor}
                  globalRecentColors={recentColors}
                  setGlobalRecentColors={setRecentColors}
                />
              </ItemField>
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

const styles = StyleSheet.create({
  colorPickerItem: {
    flexDirection: 'column',
    borderBottomWidth: 0,
    paddingTop: moderateScale(5),
    paddingBottom: moderateScale(5),
    alignItems: 'flex-start',
  },
  colorPicker: { width: '100%', flex: 0 },
} as const);
