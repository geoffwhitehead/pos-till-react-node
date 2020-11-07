import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../components/Modal/ModalContentButton';
import { Body, CheckBox, Col, Content, Form, Input, Item, Label, ListItem, Row, Text } from '../../../core';
import { PriceGroup, tableNames } from '../../../models';
import { commonStyles } from './styles';

interface PriceGroupDetailsProps {
  onClose: () => void;
  priceGroup?: PriceGroup;
}

const priceGroupDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  shortName: Yup.string()
    .min(2, 'Too Short')
    .max(50, 'Too Long'),
  isPrepTimeRequired: Yup.boolean(),
});

type FormValues = {
  name: string;
  shortName: string;
  isPrepTimeRequired: boolean;
};

export const PriceGroupDetails: React.FC<PriceGroupDetailsProps> = ({ priceGroup, onClose }) => {
  const [loading, setLoading] = useState(false);
  const database = useDatabase();

  const update = async (values: FormValues, priceGroup: PriceGroup) => {
    setLoading(true);
    if (priceGroup) {
      await database.action(() => priceGroup.updatePriceGroup(values));
    } else {
      const priceGroupCollection = database.collections.get<PriceGroup>(tableNames.priceGroups);

      await database.action(() => priceGroupCollection.create(record => Object.assign(record, values)));
    }
    setLoading(false);
    onClose();
  };

  const initialValues = {
    name: priceGroup?.name || '',
    shortName: priceGroup?.shortName || '',
    isPrepTimeRequired: priceGroup?.isPrepTimeRequired || false,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={priceGroupDetailsSchema}
      onSubmit={values => update(values, priceGroup)}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched, values }) => {
        const { name, shortName, isPrepTimeRequired } = values;
        const err = {
          name: !!(touched.name && errors.name),
          shortName: !!(touched.shortName && errors.shortName),
          // isPrepTimeRequired: !!(touched.isPrepTimeRequired && errors.isPrepTimeRequired),
        };

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title="Price Group Details"
            isPrimaryDisabled={loading}
          >
            <Content>
              <Row>
                <Col>
                  <Form style={commonStyles.form}>
                    <Item stackedLabel error={err.name}>
                      <Label>Name</Label>
                      <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
                    </Item>
                    <Item stackedLabel error={err.shortName}>
                      <Label>Short Name</Label>
                      <Input
                        onChangeText={handleChange('shortName')}
                        onBlur={handleBlur('shortName')}
                        value={shortName}
                      />
                    </Item>
                    <ListItem>
                      <CheckBox
                        checked={isPrepTimeRequired}
                        onPress={() => setFieldValue('isPrepTimeRequired', !isPrepTimeRequired)}
                        onBlur={handleBlur('isPrepTimeRequired')}
                      />
                      <Body>
                        <Text>Is prep time required</Text>
                      </Body>
                    </ListItem>
                  </Form>
                </Col>
                <Col />
              </Row>
              <Row></Row>
            </Content>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
