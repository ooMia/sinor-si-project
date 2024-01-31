import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import TextInput from '@/components/TextInput';
import Text from '@/components/Text';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import CheckBox, { CircleCheckBox } from '@/components/CheckBox';
import { theme, voteTheme, rouletteTheme } from '@/theme/color';
import useModal from '@/hooks/useModal.js';
import Roulette from '@/components/Roulette';

const BackBtn = () => {
  return <Image source={require('@/assets/icons/cancel.png')} />;
};

const MAX_ITEM = 8;

export default function CreateRoulette({ navigation, route }) {
  const {
    params = {
      roulette: {
        items: [
          { text: null, ratio: '1' },
          { text: null, ratio: '1' },
        ],
        type: true,
      },
    },
  } = route;

  const [items, setItems] = useState(params.roulette.items);
  const [type, setType] = useState(params.roulette.type);
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
              'closeRoulette',
              () => onPressModalClose(),
              () => navigation.goBack(),
            )
          }
        />
      ),
    });
  }, [navigation, items]);

  const handleSubmitVote = () => {
    if (items.filter((item) => item.text === null).length) {
      return onPressModalOpen('checkVote', () => onPressModalClose());
    }
    const data = {
      items: items.filter((item) => item.text),
      type: type,
    };
    navigation.navigate('글 작성하기', { roulette: data });
  };
  const handleDeleteItem = (itemIndex) => {
    if (itemIndex === items.length - 1)
      setItems(() => items.slice(0, itemIndex));
    else
      setItems(() =>
        items.slice(0, itemIndex).concat(items.slice(itemIndex + 1)),
      );
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ ...styles.container, paddingVertical: 20 }}>
          <View style={styles.checkBox}>
            <CheckBox
              label={`직접 입력`}
              onParentState={() => {
                setType(true);
                setItems((prevState) =>
                  Array.from(Array(prevState.length), () => ({
                    text: null,
                    ratio: '1',
                  })),
                );
              }}
              open={type}
            />
            <CheckBox
              label={`당첨자 추첨`}
              onParentState={() => {
                setType(false);
                setItems((prevState) =>
                  Array.from(Array(prevState.length), (_, index) => ({
                    text: index ? '꽝' : '당첨',
                    ratio: '1',
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
                  flex: 1,
                }}
                key={index + 1}
              >
                <CircleCheckBox
                  style={{
                    borderWidth: 0,
                    backgroundColor: rouletteTheme[`color${index + 1}`],
                  }}
                />
                {type ? (
                  <>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 11,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        marginRight: 4,
                        flex: 1,
                      }}
                      onChangeValue={(text) => {
                        setItems(
                          items.map((e, i) =>
                            i === index ? { text, ratio: e.ratio } : e,
                          ),
                        );
                      }}
                      value={item.text}
                      placeholder={'항목 입력'}
                    />
                    <View style={{ flexDirection: 'row', flex: 1, gap: 4 }}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 11,
                          paddingLeft: 14,
                          paddingVertical: 12,
                          flex: 1,
                        }}
                        onChangeValue={(text) => {
                          setItems(
                            items.map((e, i) =>
                              i === index ? { text: e.text, ratio: text } : e,
                            ),
                          );
                        }}
                        value={item.ratio}
                        placeholder={'1'}
                      />
                      <Button
                        style={{
                          backgroundColor: rouletteTheme.deleteBtn,
                          borderRadius: 11,
                          justifyContent: 'center',
                        }}
                        color={{ color: rouletteTheme.deleteBtnText }}
                        text="삭제"
                        onPress={() => handleDeleteItem(index)}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 11,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        marginRight: 4,
                        flex: 1,
                      }}
                      onChangeValue={(text) => {
                        console.log('???', text);
                        setItems(
                          items.map((e, i) =>
                            i === index ? { text, ratio: e.ratio } : e,
                          ),
                        );
                      }}
                      value={item.text}
                      placeholder={'항목 입력'}
                    />
                    <View style={{ flexDirection: 'row', flex: 1, gap: 4 }}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 11,
                          paddingLeft: 14,
                          paddingVertical: 12,
                          flex: 1,
                        }}
                        onChangeValue={(text) => {
                          setItems(
                            items.map((e, i) =>
                              i === index ? { text: e.text, ratio: text } : e,
                            ),
                          );
                        }}
                        value={item.ratio}
                        placeholder={'1'}
                      />
                      <Button
                        style={{
                          backgroundColor: rouletteTheme.deleteBtn,
                          borderRadius: 11,
                          justifyContent: 'center',
                        }}
                        color={{ color: rouletteTheme.deleteBtnText }}
                        text="삭제"
                        onPress={() => handleDeleteItem(index)}
                      />
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
          {items.length < MAX_ITEM && (
            <Button
              style={styles.addItem}
              text={'+ 항목 추가'}
              color={{ color: voteTheme.addItemText }}
              onPress={() =>
                setItems([...items, { text: type ? null : '꽝', ratio: '1' }])
              }
            />
          )}
        </View>
        <View
          style={{
            ...styles.container,
            borderTopColor: voteTheme.divColor,
            borderTopWidth: 10,
          }}
        >
          <View style={styles.options}>
            <Text style={styles.optionText}>미리 보기</Text>
          </View>
          <Roulette
            items={items
              .map((item, index) => {
                return {
                  text: item.text,
                  ratio: +item.ratio,
                  color: rouletteTheme[`color${index + 1}`],
                };
              })
              .sort((a, b) => a.ratio - b.ratio)}
          />
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
