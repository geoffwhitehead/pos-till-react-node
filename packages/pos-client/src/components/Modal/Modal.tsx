import React from 'react';
import NativeModal from 'react-native-modal';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  style?: Record<string, string | number>;
};
export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, ...props }) => {
  console.log('children', children);
  console.log('isOpen', isOpen);
  return (
    <NativeModal
      {...props}
      propagateSwipe
      isVisible={isOpen}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationInTiming={50}
      animationOutTiming={50}
      hideModalContentWhileAnimating={true}
      backdropTransitionInTiming={50}
      backdropTransitionOutTiming={50}
    >
      {isOpen && children}
    </NativeModal>
  );
};
