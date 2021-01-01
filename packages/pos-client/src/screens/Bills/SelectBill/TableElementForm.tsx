import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import { inRange } from 'lodash';
import React from 'react';
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
  maxBills: number;
  onDelete: () => void;
};

const validationSchema = (maxBills: number) =>
  Yup.object().shape({
    billReference: Yup.string()
      .test('billReference', `Bill reference must be between 1 and ${maxBills}`, value => {
        if (!value || value.length === 0) {
          return true;
        }
        const ref = parseInt(value);
        if (inRange(ref, 0 + 1, maxBills + 1)) {
          return true;
        }
      })
      .nullable(),
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
  maxBills,
  onDelete,
}) => {
  const database = useDatabase();

  const initialValues = tablePlanElement
    ? {
        billReference: tablePlanElement.billReference?.toString() || '',
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
    <Formik initialValues={initialValues} validationSchema={validationSchema(maxBills)} onSubmit={onSave}>
      {({ handleChange, handleBlur, resetForm, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { billReference, rotation, type } = values;

        // useEffect(() => {
        //   resetForm({ values: initialValues });
        // }, [x, y]);

        return (
          <View style={{ borderColor: 'lightgrey', borderLeftWidth: 1, height: '100%' }}>
            <Item style={{ backgroundColor: 'whitesmoke', padding: 5 }}>
              <Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button success small iconLeft onPress={handleSubmit}>
                  <Icon name="ios-add-circle-outline" />
                  <Text>Save</Text>
                </Button>
                {tablePlanElement && (
                  <Button danger small onPress={onDelete} style={{ marginLeft: 5 }}>
                    <Icon name="ios-trash" />
                  </Button>
                )}
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
                    <Picker.Item key={type} label={TablePlanElementTypes[type]} value={type} />
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
