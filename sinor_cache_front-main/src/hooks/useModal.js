import { useState, useCallback } from 'react';
const useModal = () => {
  const [isModal, setIsModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [confirm, setConfirm] = useState(() => {});
  const confirmCallback = useCallback(
    (newCallback) => {
      setConfirm(newCallback);
    },
    [confirm],
  );
  const [cancle, setCancle] = useState(() => {});
  const cancleCallback = useCallback(
    (newCallback) => {
      setCancle(newCallback);
    },
    [cancle],
  );

  // Modal Handler
  const onPressModalOpen = (
    modalType,
    confirmCallbackProp,
    cancleCallbackProp,
  ) => {
    setIsModal(true);
    setModalType(modalType);
    confirmCallback(() => confirmCallbackProp);
    cancleCallback(() => cancleCallbackProp);
  };

  const onPressModalClose = () => setIsModal(false);

  return [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancle,
  ];
};

export default useModal;
