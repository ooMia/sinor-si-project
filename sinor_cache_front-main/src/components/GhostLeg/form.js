import { View, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { voteTheme, theme } from '@/theme/color';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal.js';
import GhostLeg from '@/components/GhostLeg';

const GhostLegForm = ({ navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();

  const data = route.params?.ghostLeg;

  const legData = route.params?.legData;

  const handleSubmitVote = () => {
    navigation.navigate('ActiveGhostLeg', {
      ghostLeg: data,
      legData: legData,
    });
  };

  return (
    <>
      <View style={styles.voteContainer}>
        <View style={{ flex: 1, gap: 8, marginTop: 16 }}>
          <GhostLeg items={data.items} legData={legData} hidden />
          {/* 투표하기 버튼 */}

          <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
            <Button
              style={{
                ...styles.button,
                backgroundColor: voteTheme.voteSubmitBtn,
              }}
              text={'결과 확인'}
              color={{
                color: theme.main,
                fontSize: 20,
              }}
              onPress={() => handleSubmitVote()}
            />
          </View>
        </View>
      </View>
      {isModal && (
        <Modal
          confirmCallback={confirm}
          modalType={modalType}
          cancelCallback={cancel}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  voteContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  voteItemText: {
    textAlign: 'left',
    color: voteTheme.PreviewItemText,
  },
  text: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: voteTheme.PreviewModifyAndDeleteBtn,
    flex: 1,
    borderRadius: 12,
  },
});

export default GhostLegForm;
