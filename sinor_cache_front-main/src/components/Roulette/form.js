import { View, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { voteTheme, theme, rouletteTheme } from '@/theme/color';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal.js';
import { useRef, useState } from 'react';
import Roulette from '@/components/Roulette';

const VOTER = Array.from(Array(10), (_, index) => ({
  voterId: index + 1,
  name: `닉네임${index + 1}`,
  vote: index < 8 ? 0 : 1,
  // 나중에 이미지 저장할 때는 s3에 저장해서 받아와야함
  profile: require('@/assets/icons/user-thumbnail.png'),
}));

const RouletteForm = ({ navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();

  const rouletteRef = useRef();

  const data = route.params?.roulette;
  data.items.forEach(
    (v, i) => (v.voter = VOTER.filter((value) => value.vote === i)),
  );

  const [isVote, setVote] = useState(false);
  // writer
  const [voteEnd, setVoteEnd] = useState(false);

  const handleSubmitVote = () => {
    if (isVote) {
      navigation.navigate('VoteResult', {
        result: JSON.stringify(data),
      });
    } else {
      rouletteRef.current.handleRotateRoulette();
      onSubmit();
    }
  };

  const onSubmit = () => {
    setVote(() => true);
  };

  const handleClickEndVote = () => {
    setVoteEnd(true);
    setVote(true);
    onPressModalClose();
  };
  return (
    <>
      <View style={styles.voteContainer}>
        <View style={{ flex: 1, gap: 8, marginTop: 16 }}>
          <Roulette
            ref={rouletteRef}
            type={data.type}
            isEnd={voteEnd}
            onSubmit={onSubmit}
            items={data.items
              .map((item, index) => {
                return {
                  text: item.text,
                  ratio: +item.ratio,
                  color: rouletteTheme[`color${index + 1}`],
                };
              })
              .sort((a, b) => a.ratio - b.ratio)}
          />
          {/* 투표하기 버튼 */}

          <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
            {route.params?.writer && (
              <Button
                style={{
                  ...styles.button,
                  backgroundColor: voteEnd
                    ? rouletteTheme.endBtnBg
                    : voteTheme.voteSubmitBtn,
                }}
                text={voteEnd ? '돌림판 종료됨' : '종료하기'}
                color={{
                  color: voteEnd ? rouletteTheme.endBtnText : theme.main,
                  fontSize: 20,
                }}
                onPress={() =>
                  onPressModalOpen(
                    'endRoulette',
                    () => handleClickEndVote(),
                    () => onPressModalClose(),
                  )
                }
                disabled={voteEnd}
              />
            )}
            <Button
              style={{
                ...styles.button,
                backgroundColor: voteTheme.voteSubmitBtn,
              }}
              text={isVote || voteEnd ? '결과 확인' : '원판 돌리기'}
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

export default RouletteForm;
