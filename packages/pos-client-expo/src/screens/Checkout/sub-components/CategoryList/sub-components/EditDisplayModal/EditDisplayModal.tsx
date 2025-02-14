import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { ItemField } from '../../../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../../../components/Modal/ModalContentButton';
import { ModalColorPickerContent } from '../../../../../../components/ModalColorPicker/ModalColorPicker';
import { RecentColorsContext } from '../../../../../../contexts/RecentColorsContext';
import { Form, Icon, Picker } from '../../../../../../core';
import { database } from '../../../../../../database';
import { Category } from '../../../../../../models';
import { colors } from '../../../../../../theme';
// import { styles } from '../../../../../../styles';
import { moderateScale } from '../../../../../../utils/scaling';

// type OnSelectProps = {
//   category: Category;
//   backgroundColor: string;
//   textColor: string;
// };

const categoryPositionSchema = Yup.object().shape({
  backgroundColor: Yup.string()
    .length(7, 'Incorrect length')
    .required(),
  textColor: Yup.string()
    .length(7, 'Incorrect length')
    .required(),
  categoryId: Yup.string().required(),
});

type EditDisplayModalProps = {
  categories: Category[];
  //   onSelect: (props: OnSelectProps) => void;
  selectedCategory?: Category;
  selectedPositionIndex: number;
  onClose: () => void;
};

type FormValues = {
  categoryId: string;
  backgroundColor: string;
  textColor: string;
};

export const EditDisplayModal: React.FC<EditDisplayModalProps> = ({
  categories,
  //   onSelect,
  selectedCategory,
  onClose,
  selectedPositionIndex,
}) => {
  const { recentColors, setRecentColors } = useContext(RecentColorsContext);
  const [loading, setLoading] = useState(false);
  console.log('selectedCategory', selectedCategory);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const newCategory = categories.find(c => c.id === values.categoryId);
    if (newCategory) {
      await database.action(async () => {
        if (selectedCategory) {
          await selectedCategory.update(record => {
            Object.assign(record, { positionIndex: newCategory.positionIndex });
          });
        }
        await newCategory.update(record => {
          Object.assign(record, {
            positionIndex: selectedPositionIndex,
            backgroundColor: values.backgroundColor,
            textColor: values.textColor,
          });
        });
      });
    }

    setLoading(false);
    onClose();
  };

  const initialValues = {
    backgroundColor: selectedCategory?.backgroundColor || colors.highlightBlue,
    textColor: selectedCategory?.textColor || '#ffffff',
    categoryId: selectedCategory?.id || '',
  };

  return (
    <Formik initialValues={initialValues} validationSchema={categoryPositionSchema} onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { backgroundColor, textColor, categoryId } = values;

        const title = 'Edit Position';

        const onCategoryChange = (categoryId: string) => {
          const category = categories.find(c => c.id === categoryId);
          handleChange('categoryId')(categoryId);
          handleChange('backgroundColor')(category.backgroundColor);
          handleChange('textColor')(category.textColor);
        };

        return (
          <ModalContentButton
            primaryButtonText="Save"
            isPrimaryDisabled={loading}
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            size="small"
          >
            <Form>
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

              <ItemField
                picker
                label="Category"
                touched={touched.categoryId}
                name="categoryId"
                errors={errors.categoryId}
                style={{
                  alignItems: 'flex-start',
                }}
                description="Select a category for this position."
              >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="chevron-down-outline" />}
                  placeholder="Select category"
                  selectedValue={categoryId}
                  onValueChange={onCategoryChange}
                  textStyle={{
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}
                >
                  {categories.map(category => (
                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                  ))}
                </Picker>
              </ItemField>
            </Form>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  colorPickerItem: {
    flexDirection: 'column',
    borderBottomWidth: 0,
    paddingTop: moderateScale(5),
    paddingBottom: moderateScale(5),
    alignItems: 'flex-start',
  },
  colorPicker: { width: '100%', flex: 0 },
});
