import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { ModalContentButton } from '../../../../../components/Modal/ModalContentButton';
import { Form, Input, Item, Label, Text, Textarea } from '../../../../../core';
import { RemoveMode } from '../ReceiptItems';

const modalReasonSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  reason: Yup.string()
    .min(5, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
});

export type ModifyReason = {
  reason: string;
  name: string;
};

type ModalReasonProps = {
  onClose: () => void;
  onComplete: (values: ModifyReason) => void;
  mode: RemoveMode;
  title: string;
};

export const ModalReason: React.FC<ModalReasonProps> = ({ onComplete, onClose, mode, title }) => {
  const initialValues = {
    reason: '',
    name: '',
  };

  return (
    <Formik initialValues={initialValues} validationSchema={modalReasonSchema} onSubmit={values => onComplete(values)}>
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
        const { reason, name } = values;
        const err = {
          reason: !!(touched.reason && errors.reason),
          name: !!(touched.name && errors.name),
        };

        const description =
          mode === RemoveMode.comp
            ? 'Please provide a reason for making this item complimentary...'
            : mode === RemoveMode.void
            ? 'Please provide a reason why this item is being voided...'
            : 'Please provide a reason... ';

        return (
          <ModalContentButton
            primaryButtonText="Save"
            onPressPrimaryButton={handleSubmit}
            onPressSecondaryButton={onClose}
            secondaryButtonText="Cancel"
            title={title}
            size="medium"
          >
            <Form>
              <Text style={{ paddingBottom: 20 }}>{description}</Text>
              <Item stackedLabel error={err.name}>
                <Label>Name</Label>
                <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
              </Item>
              <Item stackedLabel error={err.reason}>
                <Label style={{ paddingBottom: 10 }}>Reason</Label>
                <Textarea
                  style={{ width: '100%' }}
                  underline
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  value={reason}
                  rowSpan={5}
                  bordered
                />
              </Item>
            </Form>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
