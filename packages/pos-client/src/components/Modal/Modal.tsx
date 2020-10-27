import React from 'react';
import NativeModal from 'react-native-modal';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  return (
    <NativeModal
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
