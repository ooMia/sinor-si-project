import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '@/components/Button';
import { voteTheme, theme, rouletteTheme } from '@/theme/color';
import Modal from '@/components/Modal';
import Text from '@/components/Text';
import useModal from '@/hooks/useModal.js';
import GhostLeg from '@/components/GhostLeg';
import { useRef, useState } from 'react';

const ActiveGhostLeg = ({ navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();
  const GhostLegRef = useRef();

  const data = route.params?.ghostLeg;
  const legData = route.params?.legData;

  const handleSubmitVote = () => {
    navigation.navigate('GhostLegResult', {
      result: JSON.stringify({ items: GhostLegRef.current.MatchUserToItem() }),
    });
  };
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flex: 1, gap: 8, marginTop: 16 }}>
            <Text style={{ color: rouletteTheme.infoText, marginBottom: 10 }}>
              "색상이나 당첨 항목을 클릭하세요"
            </Text>
            <GhostLeg ref={GhostLegRef} items={data.items} legData={legData} />

            <View style={{ flex: 1 }}>
              <Button
                style={{
                  ...styles.button,
                  backgroundColor: voteTheme.voteSubmitBtn,
                }}
                text={'전체 결과 보기'}
                color={{
                  color: theme.main,
                  fontSize: 20,
                }}
                onPress={() => handleSubmitVote()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
  container: {
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
    justifyContent: 'flex-start',
  },
  voteContainer: {
    paddingVertical: 16,
  },
  text: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: voteTheme.PreviewModifyAndDeleteBtn,
    borderRadius: 12,
  },
});

export default ActiveGhostLeg;
