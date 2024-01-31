import React, { useRef, useState, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Text from '@/components/Text';
import Svg, { Line } from 'react-native-svg';
import { rouletteTheme, theme } from '@/theme/color';
import { CircleCheckBox } from '@/components/CheckBox';
const WIDTH = Dimensions.get('window').width;

const GhostLeg = React.forwardRef((props, ref) => {
  const { items, hidden = false, legData } = props;
  const svgWidth =
    WIDTH / items.length >= 150
      ? 150 * (items.length + 1)
      : 38 * (items.length + 1);
  const itemWidth = WIDTH / items.length >= 150 ? 150 : 38;

  const total = items.length;

  useImperativeHandle(ref, () => ({
    MatchUserToItem,
  }));

  // 정렬된 다리 좌표 데이터
  const sortLegData = legData.map((arr) =>
    arr.sort((a, b) => a.value - b.value),
  );

  // 각 라인의 왼쪽, 오른쪽으로 부터 오는 다리 좌표의 총 데이터
  const totalSortLegData = [];

  for (let i = 0; i < total; i++) {
    const indexSortLegData = sortLegData
      .flat()
      .filter((v) => v.to === i || v.from === i)
      .sort((a, b) => a.value - b.value);
    totalSortLegData.push(indexSortLegData);
  }

  // 다음 target user 라인에 있는 좌표 중 y축의 높이 비교해서 가장 작은 값의 좌표 반환
  const findNextTarget = (targetIdx, current) => {
    const findTargetList = totalSortLegData[targetIdx];
    if (findTargetList.filter((v) => current < v.value).length) {
      return findTargetList.filter((v) => current < v.value)[0];
    } else {
      return { value: null };
    }
  };

  // 다음 target item 라인에 있는 좌표 중 y축의 높이 비교해서 가장 큰 값의 좌표 반환
  const findNextTargetItems = (targetIdx, current) => {
    const findTargetList = totalSortLegData[targetIdx];
    const filterArr = findTargetList.filter((v) => current > v.value);
    if (filterArr.length) {
      return filterArr[filterArr.length - 1];
    } else {
      return { value: null };
    }
  };

  // 해당 user와 item의 라인 좌표
  const getCenterX = (i) => (itemWidth / 2) * (i * 2 + 1) + 8 * i;

  // 오른쪽으로 이동할 라인 좌표
  const getDestinationX = (i, direction = 1) =>
    (itemWidth / 2) * ((i + 1 * direction) * 2 + 1) + 8 * (i + 1 * direction);

  // 활성화 된 사다리 경로 데이터
  const colorLegData = useRef([]);
  // ref 값인 colorLegData에 사다리 경로가 추가 되면 리렌더링해주기 위한 트리거
  const [isActive, setActive] = useState(false);
  // 이미 활성화 된 user or item 인덱스
  const activeUserIndexArr = useRef(new Set());
  const activeItemIndexArr = useRef(new Set());

  const autoDfs = (nextTarget, currentValue, isClickItem = false) => {
    const { from, to, value } = findNextTarget(nextTarget, currentValue);
    if (value === null) {
      return nextTarget;
    }
    if (nextTarget === from) {
      // 오른쪽으로 이동해야 함
      return autoDfs(to, value, isClickItem);
    } else if (nextTarget === to) {
      // 왼쪽으로 이동해야함
      return autoDfs(from, value, isClickItem);
    }
  };
  const MatchUserToItem = () => {
    const data = [];
    for (let i = 0; i < total; i++) {
      const itemIdx = autoDfs(i, 0);
      data.push({
        name: items[i].name,
        text: items[itemIdx].text,
      });
    }
    return data;
  };
  // 사다리 경로 탐색 로직
  const dfs = (nextTarget, currentValue, isClickItem = false) => {
    const { from, to, value } = isClickItem
      ? findNextTargetItems(nextTarget, currentValue)
      : findNextTarget(nextTarget, currentValue);

    if (hidden) return;
    colorLegData.current.push({
      x1: getCenterX(nextTarget),
      x2: getCenterX(nextTarget),
      y1: currentValue,
      y2: value ?? (isClickItem ? 0 : 175),
      target: nextTarget,
    });
    if (value === null) {
      isClickItem
        ? activeUserIndexArr.current.add(nextTarget)
        : activeItemIndexArr.current.add(nextTarget);

      setActive(!isActive);
      return;
    }
    if (nextTarget === from) {
      // 오른쪽으로 이동해야 함
      colorLegData.current.push({
        x1: getCenterX(from),
        x2: getDestinationX(from),
        y1: value,
        y2: value,
      });
      dfs(to, value, isClickItem);
    } else if (nextTarget === to) {
      // 왼쪽으로 이동해야함
      colorLegData.current.push({
        x1: getCenterX(to),
        x2: getDestinationX(to, -1),
        y1: value,
        y2: value,
      });

      dfs(from, value, isClickItem);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.ghostLegWrapper}>
          {items.map((item, index) => (
            <View key={index}>
              {WIDTH / items.length >= 150 ? (
                <Pressable
                  onPress={() => {
                    if (!activeUserIndexArr.current.has(index)) {
                      colorLegData.current = [];
                      activeUserIndexArr.current.add(index);
                      dfs(index, 0);
                    }
                  }}
                >
                  <Text
                    style={{
                      borderWidth: 2,
                      borderColor: activeUserIndexArr.current.has(index)
                        ? theme.main
                        : '#D7D7D7',
                      width: 150,
                      height: 38,
                    }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              ) : (
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 4,
                    borderColor: activeUserIndexArr.current.has(index)
                      ? theme.main
                      : '#D7D7D7',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    padding: 4,
                  }}
                >
                  <CircleCheckBox
                    style={{
                      borderWidth: 0,
                      backgroundColor: rouletteTheme[`color${index + 1}`],
                      marginRight: -10,
                    }}
                    onPress={() => {
                      if (!activeUserIndexArr.current.has(index)) {
                        colorLegData.current = [];
                        activeUserIndexArr.current.add(index);
                        dfs(index, 0);
                      }
                    }}
                  />
                </View>
              )}
              <Svg height={175} width={itemWidth}>
                <Line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="175"
                  stroke="#D7D7D7"
                  strokeWidth="2"
                />
              </Svg>
              <Pressable
                onPress={() => {
                  if (!activeItemIndexArr.current.has(index)) {
                    colorLegData.current = [];
                    activeItemIndexArr.current.add(index);
                    dfs(index, 175, true);
                  }
                }}
              >
                <Text
                  style={{
                    borderWidth: 2,
                    borderRadius: 4,
                    borderColor: activeItemIndexArr.current.has(index)
                      ? theme.main
                      : '#D7D7D7',
                    color: activeItemIndexArr.current.has(index) && theme.main,
                    width: itemWidth,
                    fontSize: 12,
                    height: 38,
                  }}
                >
                  {hidden ? '?' : item.text}
                </Text>
              </Pressable>
            </View>
          ))}
          <View style={{ position: 'absolute', top: 38 }}>
            <Svg height={175} width={svgWidth}>
              {legData.map((item, i) =>
                item.map((leg, index) => (
                  <Line
                    key={i * leg.value + index * leg.value * leg.value}
                    x1={getCenterX(i)}
                    y1={leg.value}
                    x2={getDestinationX(i)}
                    y2={leg.value}
                    stroke="#D7D7D7"
                    strokeWidth="2"
                  />
                )),
              )}
            </Svg>
          </View>
          <View style={{ position: 'absolute', top: 38, zIndex: 11 }}>
            <Svg height={175} width={svgWidth}>
              {colorLegData.current.map((item, i) => (
                <Line
                  key={
                    i * item.x1 * item.x2 * item.y1 * item.y2 + Math.random()
                  }
                  x1={item.x1}
                  y1={item.y1}
                  x2={item.x2}
                  y2={item.y2}
                  stroke={theme.main}
                  strokeWidth="2"
                />
              ))}
            </Svg>
          </View>
        </View>
      </View>
    </>
  );
});

export default GhostLeg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ghostLegWrapper: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  graphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderWidth: 8,
    borderColor: rouletteTheme.rouletteBorder,
    borderRadius: 160,
  },
  info: {
    color: rouletteTheme.infoText,
    marginBottom: 24,
  },
});
