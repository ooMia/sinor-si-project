import { Modal as RNModal, View, StyleSheet, Pressable } from 'react-native';
import Text from '@/components/Text';
import { ModalButton } from '@/components/Button';
import { theme, modalTheme } from '@/theme/color';

const ModalType = [
  {
    type: 'endDate',
    content:
      '마감시간은 지금으로부터 최소 하루, 최대 7일 이내로 설정할 수 있습니다.',
    confirm: '확인',
  },
  {
    type: 'closeVote',
    content: '현재 작성중인 투표 만들기를 종료하시겠습니까?',
    cancel: '종료하기',
    confirm: '계속 작성',
  },
  {
    type: 'closeRoulette',
    content: '현재 작성중인 돌림판 만들기를 종료하시겠습니까?',
    cancel: '종료하기',
    confirm: '계속 작성',
  },
  {
    type: 'closeGhostLeg',
    content: '현재 작성중인 사다리 설정을 종료하시겠습니까?',
    cancel: '종료하기',
    confirm: '계속 작성',
  },
  {
    type: 'checkVote',
    content: '아직 입력되지 않은 항목이 있습니다.',
    confirm: '확인',
  },
  {
    type: 'deleteVote',
    content: '투표를 삭제하시겠습니까?',
    cancel: '닫기',
    confirm: '삭제하기',
  },
  {
    type: 'deleteRoulette',
    content: '돌림판을 삭제하시겠습니까?',
    cancel: '닫기',
    confirm: '삭제하기',
  },
  {
    type: 'deleteGhostLeg',
    content: '사다리 타기를 삭제하시겠습니까?',
    cancel: '닫기',
    confirm: '삭제하기',
  },
  {
    type: 'impossibleMultiSelect',
    content: '복수 선택이 불가능합니다.',
    confirm: '확인',
  },
  {
    type: 'endVote',
    content: '투표를 종료하시겠습니까?',
    cancel: '다음에 하기',
    confirm: '종료하기',
  },
  {
    type: 'endRoulette',
    content: '돌림판을 종료하시겠습니까?',
    cancel: '다음에 하기',
    confirm: '종료하기',
  },
  {
    type: 'endGhostLeg',
    content: '사다리 타기를 종료하시겠습니까?',
    cancel: '다음에 하기',
    confirm: '종료하기',
  },
];

const Modal = (props) => {
  const { confirmCallback, cancelCallback, modalType, ...prop } = props;
  const contents = ModalType.filter((v) => v.type === modalType)[0];
  return (
    <RNModal transparent={true}>
      <Pressable
        style={{ flex: 1, backgroundColor: modalTheme.modalBackground }}
        onPress={() =>
          prop?.closeModal ? prop.closeModal() : confirmCallback()
        }
      />
      <View style={styles.modalWrap}>
        <View style={styles.modalMain}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>{contents?.content}</Text>
          </View>
          <View style={styles.modalButtonWrap}>
            {contents?.cancel && (
              <View
                style={{
                  ...styles.modalButton,
                  borderRightWidth: 1,
                  borderColor: modalTheme.border,
                }}
              >
                <ModalButton
                  cancel
                  text={contents?.cancel}
                  onPress={cancelCallback}
                />
              </View>
            )}
            <View style={styles.modalButton}>
              <ModalButton
                confirm
                text={contents?.confirm}
                onPress={confirmCallback}
              />
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export const TabModal = ({ isModal, setModal, handler, isWriter }) => {
  return (
    <RNModal transparent visible={isModal}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onPress={() => setModal()}
      />
      <View
        style={{
          position: 'absolute',
          marginTop: 50,
          right: 5,
          borderColor: modalTheme.border,
          borderRadius: 5,
          borderWidth: 1,
        }}
      >
        <View style={{ backgroundColor: theme.background, padding: 10 }}>
          <View style={{ gap: 10 }}>
            <ModalButton
              confirm={!isWriter}
              cancel={isWriter}
              text={'사용자'}
              onPress={() => handler(false)}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: modalTheme.border,
              }}
            ></View>
            <ModalButton
              cancel={!isWriter}
              confirm={isWriter}
              text={'작성자'}
              onPress={() => handler(true)}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalMain: {
    backgroundColor: theme.background,
    width: '100%',
    borderRadius: 32,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  modalButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: modalTheme.border,
  },
  modalButton: {
    paddingHorizontal: 10,
    paddingVertical: 24,
    flex: 1,
  },

  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: modalTheme.contentText,
  },
});
