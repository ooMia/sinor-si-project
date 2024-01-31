import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import TextInput from '@/components/TextInput';
import Text from '@/components/Text';
import Button from '@/components/Button';
import Switch from '@/components/Switch';
import Modal from '@/components/Modal';
import CheckBox, { CircleCheckBox } from '@/components/CheckBox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme, voteTheme } from '@/theme/color';
import useModal from '@/hooks/useModal.js';
import getFormatDate from '@/utils/formdate';
import { useQueryClient } from '@tanstack/react-query';

const BackBtn = () => {
  return <Image source={require('@/assets/icons/cancel.png')} />;
};

export default function CreateVote({ navigation, route }) {
  const {
    params = {
      vote: {
        voteItems: [{ content: null }, { content: null }],
        isAnonymous: false,
        isMultiple: false,
        validUntil: new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000,
        ).toString(),
      },
      type: true,
    },
  } = route;

  const [items, setItems] = useState(params.vote.voteItems);
  const [type, setType] = useState(params.type);
  const [option, setOption] = useState({
    anonymous: params.vote.isAnonymous,
    multiSelect: params.vote.isMultiple,
  });
  const [endDate, setEndDate] = useState(new Date(params.vote.validUntil));
  const [open, setOpen] = useState({ open: false, id: null });
  const [
    isModal,
    modalType,
    onPressModalOpen,
    onPressModalClose,
    confirm,
    cancel,
  ] = useModal();

  useEffect(() => {
    // headerRight 첨부 버튼
    navigation.setOptions({
      headerRight: () => (
        <Button
          style={{ backgroundColor: theme.background }}
          color={{ color: theme.main, fontSize: 20 }}
          text="첨부"
          onPress={handleSubmitVote}
        />
      ),
      headerLeft: () => (
        <Button
          style={{
            backgroundColor: theme.background,
          }}
          text={<BackBtn />}
          color={{ fontSize: 30 }}
          onPress={() =>
            onPressModalOpen(
              'closeVote',
              () => onPressModalClose(),
              () => navigation.goBack(),
            )
          }
        />
      ),
    });
  }, [navigation, items, endDate, option]);
  const queryClient = useQueryClient();
  const board = queryClient.getQueryData(['board']);
  const boardId = board?.id;

  const handleSubmitVote = () => {
    // 투표 항목 최소 2개 이상 입력 확인
    if (items.filter((item) => item.content).length < 2) {
      return onPressModalOpen('checkVote', () => onPressModalClose());
    }
    const data = JSON.stringify({
      boardId: boardId,
      validUntil: endDate,
      isAnonymous: option.anonymous,
      isMultiple: option.multiSelect,
      voteItems: items.filter((item) => item.content),
    });
    navigation.navigate('글 작성하기', { vote: data, type: type });
  };

  const onDateChange = useCallback(
    (event, selectDate) => {
      if (event.type === 'set' && open.id === -1) {
        const currentDate = new Date();
        if (
          Math.abs(currentDate.getMonth() - selectDate.getMonth()) === 0 &&
          selectDate.getDate() - currentDate.getDate() >= 1 &&
          selectDate.getDate() - currentDate.getDate() <= 7
        ) {
          setEndDate(selectDate);
        } else {
          setOpen(() => false);
          onPressModalOpen('endDate', () => onPressModalClose());
          return;
        }
      } else if (event.type === 'set' && open.id !== -1) {
        setItems(() =>
          items.map((e, i) =>
            i === open.id ? { content: getFormatDate(selectDate) } : e,
          ),
        );
      }
      setOpen(false);
    },
    [open],
  );
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ ...styles.container, paddingVertical: 20 }}>
          <View style={styles.checkBox}>
            <CheckBox
              label={`텍스트`}
              onParentState={() => {
                setType(true);
                setItems((prevState) =>
                  Array.from(Array(prevState.length), () => ({
                    content: '',
                  })),
                );
              }}
              open={type}
            />
            <CheckBox
              label={`날짜`}
              onParentState={() => {
                setType(false);
                setItems((prevState) =>
                  Array.from(Array(prevState.length), () => ({
                    content: '',
                  })),
                );
              }}
              open={!type}
            />
          </View>
          <View style={styles.itemContainer}>
            {items.map((item, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
                key={index + 1}
              >
                <CircleCheckBox number={index + 1} />
                {type ? (
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderRadius: 11,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flex: 9,
                    }}
                    onChangeValue={(content) => {
                      setItems(
                        items.map((e, i) => (i === index ? { content } : e)),
                      );
                    }}
                    value={item.content}
                    placeholder={'항목 입력'}
                  />
                ) : (
                  <Button
                    style={{
                      backgroundColor: theme.background,
                      borderWidth: 1,
                      borderRadius: 11,
                      borderColor: 'lightgray',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      height: 54.1,
                      flex: 9,
                    }}
                    color={
                      item.content
                        ? { color: voteTheme.optionText }
                        : { color: voteTheme.itemText }
                    }
                    text={item.content ? item.content : '날짜 선택'}
                    onPress={() => setOpen({ open: true, id: index })}
                  />
                )}
              </View>
            ))}
          </View>
          <Button
            style={styles.addItem}
            text={'+ 항목 추가'}
            color={{ color: voteTheme.addItemText }}
            onPress={() => setItems([...items, { content: null }])}
          />
        </View>
        <View
          style={{
            ...styles.container,
            borderTopColor: voteTheme.divColor,
            borderTopWidth: 10,
          }}
        >
          <View style={styles.options}>
            <Text style={styles.optionText}>익명 투표</Text>
            <Switch
              onParentState={(isEnabled) =>
                setOption({
                  anonymous: isEnabled,
                  multiSelect: option.multiSelect,
                })
              }
              value={option.anonymous}
            />
          </View>
          <View
            style={{
              ...styles.options,
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: voteTheme.numberCheckBox,
            }}
          >
            <Text style={styles.optionText}>복수 선택 허용</Text>
            <Switch
              onParentState={(isEnabled) =>
                setOption({
                  anonymous: option.anonymous,
                  multiSelect: isEnabled,
                })
              }
              value={option.multiSelect}
            />
          </View>
          <View style={styles.options}>
            <Text style={styles.optionText}>종료일</Text>
            <Button
              style={{ backgroundColor: theme.background, padding: 0 }}
              color={{ color: voteTheme.optionSwitchFalseText }}
              text={getFormatDate(endDate)}
              onPress={() => setOpen({ open: true, id: -1 })}
            />
          </View>
        </View>
      </ScrollView>
      {open.open && (
        <DateTimePicker
          mode="date"
          value={endDate}
          onChange={onDateChange}
          timeZoneName={'Asia/Seoul'}
          negativeButton={{ label: '취소', textColor: 'red' }}
        />
      )}
      {isModal && (
        <Modal
          confirmCallback={confirm}
          modalType={modalType}
          cancelCallback={cancel}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    marginTop: 20,
  },
  addItem: {
    borderRadius: 11,
    backgroundColor: voteTheme.addItemBackground,
    paddingHorizontal: 34,
    paddingVertical: 12,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  optionText: {
    color: voteTheme.optionText,
  },
});
