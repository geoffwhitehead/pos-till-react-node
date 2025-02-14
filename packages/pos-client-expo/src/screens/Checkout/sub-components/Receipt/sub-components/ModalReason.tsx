import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { ItemField } from '../../../../../components/ItemField/ItemField';
import { ModalContentButton } from '../../../../../components/Modal/ModalContentButton';
import { Form, Input, Textarea } from '../../../../../core';
import { Action } from '../ReceiptItems';

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
  mode: Action;
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

        const description =
          mode === Action.comp
            ? 'Please provide a reason for making this item complimentary...'
            : mode === Action.void
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
              <ItemField label="Name" touched={touched.name} name="name" errors={errors.name}>
                <Input onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={name} />
              </ItemField>

              <ItemField label="Reason" touched={touched.reason} name="reason" errors={errors.reason}>
                <Input onChangeText={handleChange('reason')} onBlur={handleBlur('reason')} value={reason} />
                <Textarea
                  style={{ width: '100%' }}
                  underline
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  value={reason}
                  rowSpan={5}
                  bordered
                />
              </ItemField>
            </Form>
          </ModalContentButton>
        );
      }}
    </Formik>
  );
};
