import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../components/ItemField/ItemField';
import { Button, Form, Icon, Input, Item, Picker, Right, Text, View } from '../../../core';
import { tableNames, TablePlanElement } from '../../../models';
import {
  TablePlanElementProps,
  TablePlanElementRotations,
  TablePlanElementTypes,
} from '../../../models/TablePlanElement';
import { commonStyles } from '../../Settings/Tabs/styles';

type TableElementFormInnerProps = {};

type TableElementFormOuterProps = {
  tablePlanElement?: TablePlanElement;
  x: number;
  y: number;
};

const validationSchema = Yup.object().shape({
  billReference: Yup.string(),
  type: Yup.string().required(),
  rotation: Yup.string().required(),
});

type FormValues = {
  billReference: string;
  type: string;
  rotation: string;
};

export const TableElementForm: React.FC<TableElementFormInnerProps & TableElementFormOuterProps> = ({
  tablePlanElement,
  x,
  y,
}) => {
  const database = useDatabase();

  const initialValues = tablePlanElement
    ? {
        billReference: tablePlanElement.billReference.toString(),
        type: tablePlanElement.type,
        rotation: tablePlanElement.rotation.toString(),
      }
    : {
        billReference: null,
        type: '',
        rotation: '0',
      };

  const onSave = async (values: FormValues) => {
    const parsedValues: TablePlanElementProps = {
      billReference: parseInt(values.billReference) || null,
      type: values.type,
      posX: x,
      posY: y,
      rotation: parseInt(values.rotation),
    };

    const tablePlanElementCollection = database.collections.get<TablePlanElement>(tableNames.tablePlanElement);

    await database.action(() => {
      if (tablePlanElement) {
        return tablePlanElement.update(record => Object.assign(record, parsedValues));
      } else {
        return tablePlanElementCollection.create(record => Object.assign(record, parsedValues));
      }
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSave}>
      {({ handleChange, handleBlur, resetForm, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { billReference, rotation, type } = values;

        useEffect(() => {
          resetForm({ values: initialValues });
        }, [x, y]);

        return (
          <View>
            <Item style={{ backgroundColor: 'whitesmoke', padding: 5 }}>
              <Right>
                <Button success small iconLeft onPress={handleSubmit}>
                  <Icon name="ios-add-circle-outline" />
                  <Text>Save</Text>
                </Button>
              </Right>
            </Item>
            <Form style={commonStyles.form}>
              <ItemField
                label="Table / Bill Number"
                touched={touched.billReference}
                name="billReference"
                errors={errors.billReference}
              >
                <Input
                  onChangeText={handleChange('billReference')}
                  onBlur={handleBlur('billReference')}
                  value={billReference}
                />
              </ItemField>

              <ItemField
                picker
                label="Type"
                touched={touched.type}
                name="type"
                errors={errors.type}
                style={{
                  alignItems: 'flex-start',
                }}
              >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="chevron-down-outline" />}
                  placeholder="Select type"
                  selectedValue={type}
                  onValueChange={handleChange('type')}
                >
                  {Object.keys(TablePlanElementTypes).map(type => (
                    <Picker.Item key={type} label={type} value={TablePlanElementTypes[type]} />
                  ))}
                </Picker>
              </ItemField>

              <ItemField
                picker
                label="Rotation"
                touched={touched.rotation}
                name="rotation"
                errors={errors.rotation}
                style={{
                  alignItems: 'flex-start',
                }}
              >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="chevron-down-outline" />}
                  placeholder="Select rotation"
                  selectedValue={rotation}
                  onValueChange={handleChange('rotation')}
                >
                  {Object.keys(TablePlanElementRotations).map(rotation => (
                    <Picker.Item key={rotation} label={rotation} value={TablePlanElementRotations[rotation]} />
                  ))}
                </Picker>
              </ItemField>
            </Form>
          </View>
        );
      }}
    </Formik>
  );
};

// export const enhance = withObservables<TableElementFormOuterProps, TableElementFormInnerProps>(
//   ['tablePlanElement'],
//   ({ tablePlanElement }) => ({
//     tablePlanElement: tablePlanElement ? tablePlanElement : {},
//   }),
// );
// export const TableElementForm = enhance(TableElementFormInner);
