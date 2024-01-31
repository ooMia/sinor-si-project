import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Button from '@/components/Button';
import VoteIcon from '@/assets/icons/vote.svg';
import { voteTheme } from '@/theme/color';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal.js';

const VotePreview = ({ resetParams, navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();
  const data = JSON.parse(route.params?.vote);
  const handleDeleteVote = () =>
    onPressModalOpen(
      'deleteVote',
      () => onPressModalClose(),
      () => resetParams('vote'),
    );
  return (
    <>
      <View style={styles.voteContainer}>
        <View style={styles.voteHeader}>
          <View style={styles.text}>
            <VoteIcon width={24} height={24} />
            <Text style={{ color: voteTheme.optionText, fontSize: 15 }}>
              투표
            </Text>
          </View>
          <View style={styles.text}>
            {data.isAnonymous && (
              <Text style={{ color: voteTheme.addItemText, fontSize: 15 }}>
                익명 투표{data.isMultiple && 'ㆍ'}
              </Text>
            )}

            {data.isMultiple && (
              <Text style={{ color: voteTheme.addItemText, fontSize: 15 }}>
                복수 선택 가능
              </Text>
            )}
          </View>
        </View>
        <View style={{ marginTop: 16, flex: 1 }}>
          {data.voteItems?.map(
            (item, index) =>
              item.content && (
                <Text key={index} style={styles.voteItemText}>
                  {item.content}
                </Text>
              ),
          )}
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Button
              style={{ ...styles.button, marginRight: 8 }}
              text={'수정하기'}
              color={{ color: voteTheme.addItemText, fontSize: 20 }}
              onPress={() =>
                navigation.navigate('투표 만들기', {
                  vote: data,
                  type: route.params.type,
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

export default VotePreview;
