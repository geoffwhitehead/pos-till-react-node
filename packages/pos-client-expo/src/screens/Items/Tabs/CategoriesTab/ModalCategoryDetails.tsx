import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
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
import { Form, Icon, Input, Picker } from '../../../../core';
import { Category, PrintCategory, tableNames } from '../../../../models';
import { colors } from '../../../../theme';
import { moderateScale } from '../../../../utils/scaling';

type ModalCategoryDetailsOuterProps = {
  onClose: () => void;
  category?: Category;
  printCategories: PrintCategory[];
};

type ModalCategoryDetailsInnerProps = {
  itemsCount?: number;
};

type FormValues = {
  // name: string;
  shortName: string;
  backgroundColor: string;
  textColor: string;
  printCategoryId: string;
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
    printCategoryId: Yup.string().notRequired(),
  });

export const ModalCategoryDetailsInner: React.FC<ModalCategoryDetailsOuterProps & ModalCategoryDetailsInnerProps> = ({
  category,
  onClose,
  itemsCount,
  printCategories,
}) => {
  const { organization } = useContext(OrganizationContext);
  const { recentColors, setRecentColors } = useContext(RecentColorsContext);
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const categorySchema = generateCategorySchema(organization.shortNameLength);

  const update = async (values: FormValues, category: Category) => {
    setLoading(true);
    const printCategory = printCategories.find(pC => pC.id === values.printCategoryId);
    if (category) {
      await database.action(() =>
        category.update(record => {
          printCategory && record.printCategory.set(printCategory);
          Object.assign(record, { ...omit(values, 'name') });
        }),
      );
    } else {
      const categoryCollection = database.collections.get<Category>(tableNames.categories);
      await database.action(() =>
        categoryCollection.create(record => {
          printCategory && record.printCategory.set(printCategory);
          Object.assign(record, values);
        }),
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
    printCategoryId: category?.printCategoryId || '',
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
        const { shortName, name, backgroundColor, textColor, printCategoryId } = values;

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
            isDeleteDisabled={!category || itemsCount > 0}
            onPressDelete={onDelete}
          >
            <Form>
              {!category && (
                <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                  <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                </ItemField>
              )}

              <ItemField
                label="Short Name"
                touched={touched.shortName}
                name="shortName"
                errors={errors.shortName}
                description="Used on printers where space is restricted"
              >
                <Input onChangeText={handleChange('shortName')} onBlur={handleBlur('shortName')} value={shortName} />
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

              <ItemField
                picker
                label="Print Category"
                touched={touched.printCategoryId}
                name="printCategoryId"
                errors={errors.printCategoryId}
                style={{
                  alignItems: 'flex-start',
                }}
                description="Optional category to group by when sending to printers."
              >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="chevron-down-outline" />}
                  placeholder="Select print category (optional)"
                  selectedValue={printCategoryId}
                  onValueChange={handleChange('printCategoryId')}
                  textStyle={{
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}
                >
                  {printCategories.map(printCategory => (
                    <Picker.Item key={printCategory.id} label={printCategory.name} value={printCategory.id} />
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

const enhance = c =>
  withDatabase<any>(
    withObservables<ModalCategoryDetailsOuterProps, ModalCategoryDetailsInnerProps>(
      ['category'],
      ({ category, database }) => {
        console.log('category ', category);
        if (category) {
          return {
            category,
            itemsCount: category.items.observeCount(),
          };
        } else {
          return {
            printCategories: database.collections.get<PrintCategory>(tableNames.printCategories).query(),
          };
        }
      },
    )(c),
  );

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
});
