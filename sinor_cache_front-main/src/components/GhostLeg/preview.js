import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { voteTheme, rouletteTheme } from '@/theme/color';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal.js';
import SettingsGhostLeg from '@/components/GhostLeg/settings';

const GhostLegPreview = ({ resetParams, navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();
  const data = route.params?.ghostLeg;
  const handleDeleteVote = () =>
    onPressModalOpen(
      'deleteGhostLeg',
      () => onPressModalClose(),
      () => resetParams('ghostLeg'),
    );
  return (
    <>
      <View style={styles.voteContainer}>
        <View style={styles.voteHeader}>
          <View style={styles.text}>
            <SvgIcon name="GhostLegIcon" size={24} />
            <Text style={{ color: voteTheme.optionText, fontSize: 15 }}>
              사다리 타기
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 16, flex: 1 }}>
          <SettingsGhostLeg items={data.items} />
          <View style={{ flexDirection: 'row', flex: 1, marginTop: 15 }}>
            <Button
              style={{ ...styles.button, marginRight: 8 }}
              text={'수정하기'}
              color={{ color: voteTheme.addItemText, fontSize: 20 }}
              onPress={() =>
                navigation.navigate('CreateGhostLeg', {
                  ghostLeg: data,
                })
              }
            />
            <Button
              style={styles.button}
              text={'삭제하기'}
              color={{ color: voteTheme.addItemText, fontSize: 20 }}
              onPress={() => handleDeleteVote()}
            />
          </View>
        </View>
      </View>
      {isModal && (
        <Modal
          confirmCallback={cancel}
          modalType={modalType}
          cancelCallback={confirm}
          closeModal={onPressModalClose}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  voteContainer: {
    borderWidth: 1,
    borderColor: voteTheme.itemBorder,
    borderRadius: 11,
    flex: 1,
    padding: 16,
    marginTop: 24,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteItemText: {
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: voteTheme.addItemBackground,
    textAlign: 'left',
    marginBottom: 8,
    color: voteTheme.PreviewItemText,
  },
  text: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: voteTheme.PreviewModifyAndDeleteBtn,
    flex: 1,
    borderRadius: 12,
  },
});

export default GhostLegPreview;
