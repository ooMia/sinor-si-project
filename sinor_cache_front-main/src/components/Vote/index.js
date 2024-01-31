import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import { voteTheme, theme } from '@/theme/color';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal.js';
import { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '@/utils/customFetch';
import Stomp from '@/components/WebScoket';
import { useCreateMember } from '@/hooks/useCreateBoard';

const VoteForm = ({ navigation, route }) => {
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();

  const { data: res, isPending } = useQuery({
    queryKey: ['getBoard', route.params?.boardId],
    queryFn: () => getData(`/board/${route.params?.boardId}`),
  });
  const { mutate: createMember } = useCreateMember();

  useEffect(() => {
    createMember();
  }, []);

  // writer
  const [voteEnd, setVoteEnd] = useState(false);

  if (isPending) return;
  console.log('ress', res?.votes[0]);
  console.log('voteItems', res?.votes[0]?.voteItems);
  console.log('validUntil', res?.votes[0]?.validUntil);
  const today = new Date();
  const date = new Date(res?.votes[0]?.validUntil).getDate() - today.getDate();

  return (
    <>
      <View style={styles.voteContainer}>
        <View style={styles.voteHeader}>
          <View style={styles.text}>
            <SvgIcon name="VoteIcon" size={24} />
            <Text style={{ color: voteTheme.optionText, fontSize: 15 }}>
              투표{' '}
              <Text style={{ color: theme.main, fontSize: 15 }}>
                {voteEnd ? (
                  <Text style={{ color: voteTheme.addItemText, fontSize: 15 }}>
                    종료됨
                  </Text>
                ) : (
                  `${date}일 남음`
                )}
              </Text>
            </Text>
          </View>
          <View style={styles.text}>
            {res?.votes[0]?.isAnonymous && (
              <Text style={{ color: voteTheme.addItemText, fontSize: 15 }}>
                익명 투표{res?.votes[0]?.isMultiple && 'ㆍ'}
              </Text>
            )}

            {res?.votes[0]?.isMultiple && (
              <Text style={{ color: voteTheme.addItemText, fontSize: 15 }}>
                복수 선택 가능
              </Text>
            )}
          </View>
        </View>
        <Stomp
          res={res}
          voteEnd={voteEnd}
          setVoteEnd={() => setVoteEnd(true)}
          route={route}
          navigation={navigation}
          onPressModalOpen={onPressModalOpen}
          onPressModalClose={onPressModalClose}
        />
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

export default VoteForm;
