import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Client } from '@stomp/stompjs';
import { useEffect, useState, useRef } from 'react';
import { voteTheme, theme } from '@/theme/color';
import { VoteCheckBox } from '@/components/CheckBox';
import ActiveItemBar from '@/components/ActiveItemBar';
import SvgIcon from '@/components/SvgIcon';
import { useQueryClient } from '@tanstack/react-query';

const serverHost = 'ws://13.125.66.243:15674/ws'; // Personal EC2
// const serverHost = 'ws://43.201.65.76:15674/ws';
// const serverHost = 'https://echo.websocket.org/.sse';
// const voteId = 2;
const connectionHeaders = {
  login: 'server',
  passcode: 'verysecret',
};

const Stomp = (props) => {
  const {
    res,
    voteEnd,
    setVoteEnd,
    route,
    navigation,
    onPressModalOpen,
    onPressModalClose,
  } = props;
  const [type, setType] = useState(
    Array.from(Array(res?.votes[0]?.voteItems.length), () => false),
  );
  const [isSelect, setSelect] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isVote, setVote] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [voteText, setVoteText] = useState('투표하기');
  const [selectVoteId, setVoteId] = useState([]);
  const postParseDataArr = useRef([]).current;
  const deleteParseDataArr = useRef([]).current;
  // 투표 클릭 하기 전에 MESSAGE 받으면 update 되는 것을 방지
  const isClick = useRef(false);
  const why = useRef(false);
  const test = useRef(0);

  const [voteLogs, setVoteLogs] = useState(
    res?.votes[0]?.voteItems.map((item) => item.voteLogs),
  );

  const initVoteId = res?.votes[0]?.voteItems[0]?.id;
  const [voteLog, setVoteLogDto] = useState([]);

  const queryClient = useQueryClient();
  const member = queryClient.getQueryData(['member']);
  queryClient.setQueryData(['member'], member);
  const memberId = member?.id;
  const total = voteLogs.reduce((acc, cur) => acc + cur.length, 0);
  const memberTotal = new Set(voteLogs.flat().map((obj) => obj.memberId));
  console.log('memberTotal!!!!:', memberTotal.size, total, memberTotal);
  const postVoteLogs = (data) => {
    console.log('Postparse', data);
    console.log('is???', isVote, isEnd, isClick.current);
    data.forEach((parseData) => {
      setVoteLogs((prevVoteLogs) => {
        console.log('////////?????????????', prevVoteLogs);
        return prevVoteLogs.map((voteLog, index) => {
          if (
            initVoteId + index === parseData.voteItemId &&
            !voteLog.some(
              (log) =>
                log.memberId === parseData.memberId &&
                log.voteItemId === parseData.voteItemId,
            )
          ) {
            return [...voteLog, parseData];
          } else {
            return voteLog;
          }
        });
      });
    });
    isClick.current && (setUpdate(() => true), setEnd(() => false));
  };

  const deleteVoteLogs = (data) => {
    console.log('Deleteparse', data);
    data.forEach((parseData) => {
      setVoteLogs((prevVoteLogs) => {
        return prevVoteLogs.map((voteLog, index) => {
          console.log(
            'dfdfdf?????dddddd',
            initVoteId + index,
            parseData.voteItemId,
            selectVoteId,
          );
          if (initVoteId + index === parseData.voteItemId) {
            return [
              ...voteLog.filter(
                (log) =>
                  log.memberId !== parseData.memberId &&
                  log.id !== parseData.id,
              ),
            ];
          } else {
            return voteLog;
          }
        });
      });
    });
  };

  const valid = (parseData) => {
    return voteLogs.map(
      (voteLog) =>
        voteLog.filter(
          (log) =>
            log.memberId === parseData.memberId &&
            log.voteItemId === parseData.voteItemId,
        ).length,
    );
  };

  const voteId = res?.votes[0]?.id;

  const client = new Client({
    brokerURL: serverHost,
    connectHeaders: connectionHeaders,
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,
    webSocketFactory: () => new global.WebSocket(serverHost),

    onConnect: () => {
      console.log('connecting....', voteLogs, voteId);
      client.subscribe(`/exchange/vote.client/${voteId}.#`, (message) => {
        const parseData = JSON.parse(message.body);

        if (message.headers['method'] === 'post') {
          postParseDataArr.push(parseData);
          if (message.headers['Number-Data-Remains'] === '0') {
            isClick.current = why.current && true;
            postVoteLogs(postParseDataArr);

            postParseDataArr.splice(0, postParseDataArr.length);
          }
        } else if (message.headers['method'] === 'delete') {
          deleteParseDataArr.push(parseData);
          if (message.headers['Number-Data-Remains'] === '0') {
            deleteVoteLogs(deleteParseDataArr);
            why.current = false;
            setEnd(() => false);
            deleteParseDataArr.splice(0, deleteParseDataArr.length);
          }
        }

        console.log(`header: ${message.headers['method']}`);
        console.log(
          `header: ${message.headers['Number-Data-Remains']} ${typeof message
            .headers['Number-Data-Remains']}`,
        );
        console.log(`body: ${message.body}`);
        console.log('voteLogs: ', voteLogs);
        console.log('memberId: ', memberId);
      });

      if (!isVote && test.current) {
        selectVoteId.forEach((voteItemId, index) => {
          if (
            !valid({
              voteItemId: voteItemId,
              memberId: memberId,
            })[voteItemId - initVoteId]
          ) {
            console.log(
              'post!!!!!!!!!!!!',
              {
                voteItemId: voteItemId,
                memberId: memberId,
              },
              selectVoteId,
            );
            client.publish({
              headers: {
                method: 'post',
                'Number-Data-Remains': `${selectVoteId.length - index - 1}`,
              },
              destination: `/exchange/vote.server/${voteId}`,
              body: JSON.stringify({
                voteItemId: voteItemId,
                memberId: memberId,
              }),
            });
            test.current = 0;
            setVoteLogDto((pre) => [
              { voteItemId: voteItemId, memberId: memberId },
              ...pre,
            ]);
          }
        });
        client.deactivate();
      } else if (isVote && test.current) {
        if (client.connected) {
          console.log(
            'dleelte !!!!!!!!!!!!!',
            client.connected,
            selectVoteId,
            memberId,
            isVote,
            voteLog,
          );
          voteLog.forEach((log, index) => {
            console.log('delete!!!', log);
            client.publish({
              headers: {
                method: 'delete',
                'Number-Data-Remains': `${voteLog.length - index - 1}`,
              },
              destination: `/exchange/vote.server/${voteId}`,
              body: JSON.stringify(log),
            });
          });
          setVoteLogDto([]);
          test.current = 0;
        } else {
          console.log('Client is not connected.');
        }
        client.deactivate();
      }
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });
  useEffect(() => {
    client.activate();
    console.log('useEffect', voteLogs);
    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    if (res?.votes && type.length !== res.votes[0]?.voteItems.length)
      setType(Array.from(Array(res?.votes[0]?.voteItems.length), () => false));
    const count = type.filter((v) => v).length;

    // 투표 항목 1개라도 선택 시 투표하기 활성화
    if (count) setSelect(true);
    else setSelect(false);
  }, [type]);

  const selectCount = (selectIndex) => {
    const count = type.filter((v) => v).length + 1;
    // 복수 선택 가능 옵션이 true이면 복수 선택 가능하고 아닌데 복수 선택하려면 모달 띄우기
    // 선택한 투표 취소가 가능해야함
    if (count >= 2 && !res?.votes[0]?.isMultiple && !type[selectIndex]) {
      onPressModalOpen('impossibleMultiSelect', () => onPressModalClose());
      return false;
    }
    return true;
  };

  const handleClickItem = (voteId, index) => {
    setVoteId((prevVoteId) => {
      if (res?.votes[0]?.isMultiple) {
        if (prevVoteId.includes(voteId)) {
          return [...prevVoteId.filter((id) => id !== voteId)];
        }
        return [...prevVoteId, voteId];
      } else if (!res?.votes[0]?.isMultiple) {
        return [...prevVoteId];
      } else {
        return [voteId];
      }
    });
    console.log(voteId);
    setType(
      type.map((v, i) =>
        i === index && selectCount(index) ? !type[index] : v,
      ),
    );
  };

  const handleSubmitVote = () => {
    client.activate();
    console.log('test:', test, client.state, isVote, isEnd);
    test.current = 1;
    if (isVote) {
      deleteVoteLogs(voteLog);
      isClick.current = false;

      setUpdate(() => false);
      setVote(false);
      setVoteText('투표하기');
    } else {
      setVote(true);
      why.current = true;
      setVoteText('다시 투표하기');
    }
    setEnd(() => true);
  };

  const handleClickEndVote = () => {
    setVoteEnd();
    setEnd(true);

    onPressModalClose();
  };

  console.log('update????', isUpdate, isVote, isEnd);
  return (
    <View style={{ flex: 1, gap: 8, marginTop: 16 }}>
      {voteLogs.map((item, index) => (
        <View
          style={{
            backgroundColor: voteTheme.addItemBackground,
            borderRadius: 11,
            position: 'relative',
          }}
          key={index}
        >
          {(voteEnd || (isUpdate && isVote)) && (
            <ActiveItemBar ratio={(item.length / total) * 100} />
          )}
          <View style={styles.voteItem}>
            {voteEnd || (isUpdate && isVote) ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {type[index] && <SvgIcon name="CheckedIcon" />}
                  <Button
                    disabled
                    style={{ backgroundColor: 'transparent' }}
                    text={
                      <Text style={styles.voteItemText}>
                        {res?.votes[0]?.voteItems[index]?.content}
                      </Text>
                    }
                  />
                </View>
                <Text>{`${item.length}명`}</Text>
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <VoteCheckBox
                  onParentState={() =>
                    handleClickItem(res?.votes[0]?.voteItems[index]?.id, index)
                  }
                  open={type[index]}
                />
                <Button
                  onPress={() =>
                    handleClickItem(res?.votes[0]?.voteItems[index]?.id, index)
                  }
                  style={{ backgroundColor: 'transparent' }}
                  text={
                    <Text style={styles.voteItemText}>
                      {res?.votes[0]?.voteItems[index]?.content}
                    </Text>
                  }
                />
              </View>
            )}
          </View>
        </View>
      ))}
      {/* 투표하기 버튼 */}
      {!voteEnd && (
        <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
          <Button
            style={{
              ...styles.button,
              backgroundColor: isSelect
                ? voteTheme.voteSubmitBtn
                : voteTheme.PreviewModifyAndDeleteBtn,
            }}
            text={isEnd && !isUpdate ? <ActivityIndicator /> : voteText}
            color={{
              color: isSelect ? theme.main : voteTheme.addItemText,
              fontSize: 20,
            }}
            onPress={() => handleSubmitVote()}
            disabled={!isSelect || (isEnd && !isUpdate)}
          />
          {route.params?.writer && (
            <Button
              style={{
                ...styles.button,
                backgroundColor: voteTheme.voteSubmitBtn,
              }}
              text={'투표 종료'}
              color={{
                color: theme.main,
                fontSize: 20,
              }}
              onPress={() =>
                onPressModalOpen(
                  'endVote',
                  () => handleClickEndVote(),
                  () => onPressModalClose(),
                )
              }
            />
          )}
        </View>
      )}
      {!res?.votes[0]?.isAnonymous && (
        <Button
          style={{ backgroundColor: 'transparent', alignItems: 'flex-end' }}
          text={
            <Text
              style={{
                textAlign: 'right',
                marginTop: 10,
                fontSize: 15,
                color: voteTheme.addItemText,
              }}
            >
              {memberTotal.size}명 참여 {'>'}
            </Text>
          }
          onPress={() =>
            navigation.navigate('VoteResult', {
              result: JSON.stringify(res?.votes[0]),
              voteLogs: JSON.stringify(voteLogs),
            })
          }
        />
      )}
    </View>
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

export default Stomp;
