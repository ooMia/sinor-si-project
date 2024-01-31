import React, { useImperativeHandle, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Svg, { G, Circle } from 'react-native-svg';
import SvgIcon from '@/components/SvgIcon';
import { rouletteTheme } from '@/theme/color';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  withDecay,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const RouletteInfo = (props) => {
  const { type, text } = props;

  if (type)
    return (
      <Text style={styles.info}>
        "결과는 {<Text style={{ fontWeight: 'bold' }}>{text}</Text>} 입니다!"
      </Text>
    );
  else {
    if (text === '당첨')
      return (
        <Text style={styles.info}>
          "축하합니다{' '}
          {
            <Text style={{ color: rouletteTheme.winColor, fontWeight: 'bold' }}>
              {text}
            </Text>
          }{' '}
          입니다!"
        </Text>
      );
    return (
      <Text style={styles.info}>
        "아쉽지만{' '}
        {
          <Text style={{ color: rouletteTheme.loseColor, fontWeight: 'bold' }}>
            {text}
          </Text>
        }{' '}
        입니다"
      </Text>
    );
  }
};

// 현재는 360를 랜덤으로 받는데, 나중에는 서버에서 받은 값의 영역에 해당하는 각도를 추가해줘야함.
const END_ROTATION = 360;
const START_ROTATION = 0;
const BASE_ROTATION = 7200 + START_ROTATION;
const TOTAL_ROTATION = BASE_ROTATION + END_ROTATION;
const ROTATION_TIME = 5000;
const Roulette = React.forwardRef((props, ref) => {
  const { items, type = true, isEnd = false, onSubmit = () => {} } = props;
  const refs = useRef();
  // BASE_ROTATION <= random <= END_ROTATION, 현재는 7200 <= random <= 7560
  const random = Math.random() * END_ROTATION;
  const rotationAngle =
    BASE_ROTATION + Math.floor(random % 2 ? random + 1 : random);
  // 애니메이션
  const rotation = useSharedValue(0);
  const strength = useSharedValue(0);
  const [text, setText] = useState('"돌림판을 돌려주세요!"');
  const [target, setTarget] = useState(0);
  const [isRoulette, setRoulette] = useState(false);
  // 움직이는 룰렛 컴포넌트의 스타일을 정의합니다.
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  // 핸들러를 부모 컴포넌트에 노출시킵니다.
  useImperativeHandle(ref, () => ({
    handleRotateRoulette,
  }));

  const handleRotateRoulette = () => {
    rotation.value = withTiming(rotationAngle, {
      duration: ROTATION_TIME,
      easing: Easing.inOut(Easing.circle),
    });
    getCurrentColor();
  };

  const getCurrentColor = (addTime = 0) => {
    setText(() => '"돌림판 돌아가는 중..."');
    setTimeout(() => setText(() => ''), ROTATION_TIME + addTime);
    setTarget(() => findTargetIndex(rotationAngle));
    setRoulette(() => true);
    onSubmit();
  };

  const findTargetIndex = (currentRotationAngle) => {
    const newItems = items.slice();
    const rangeArr = [...newItems.map((_, i) => angle(i)), 360];
    const range = Math.abs(currentRotationAngle - TOTAL_ROTATION);
    let targetIndex = 0;

    for (let i = 0; i < rangeArr.length - 1; i++) {
      const diff = rangeArr[i] <= range && range < rangeArr[i + 1];
      if (diff) targetIndex = i;
    }
    return targetIndex;
  };

  // gesture handler
  const pan = Gesture.Pan()
    .onStart((e) => {
      strength.value = Math.abs(e.velocityY) / 7;
    })
    .onUpdate((e) => {
      if (!isRoulette && !isEnd) {
        if (strength.value < 120) {
          rotation.value = withSequence(
            withTiming(
              strength.value,
              {
                duration: 500,
                easing: Easing.linear,
              },
              () => runOnJS(setText)('"돌림판을 더 쌔게 돌려주세요!"'),
            ),
            withTiming(rotation.value, {
              duration: 500,
              easing: Easing.linear,
            }),
          );
        } else {
          runOnJS(getCurrentColor)(500);
          rotation.value = withSequence(
            withTiming(Math.abs(e.velocityY) / 7 + rotation.value, {
              duration: 500,
              easing: Easing.linear,
            }),
            withTiming(rotationAngle, {
              duration: ROTATION_TIME,
              easing: Easing.bezier(0.2, 0.8, 0.7, 1),
            }),
          );
        }
      }
    });

  // 기본 roulette 정보
  const radius = 40;
  const circleCircumference = 2 * Math.PI * radius;
  const total = items.reduce((acc, cur) => acc + cur.ratio, 0);
  const percentage = (i) => (items[i].ratio / total) * 100;
  const strokeDashoffset = (i) => {
    return circleCircumference - (circleCircumference * percentage(i)) / 100;
  };
  const angle = (i) =>
    (items.reduce((acc, cur, index) => (index < i ? acc + cur.ratio : acc), 0) /
      total) *
    360;

  return (
    <>
      {!isEnd && ref && (
        <>
          {text === '' ? (
            <RouletteInfo type={type} text={items[target].text} />
          ) : (
            <Text style={styles.info}>{text}</Text>
          )}
        </>
      )}
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={{ position: 'absolute', zIndex: 10, top: -10 }}>
            <SvgIcon name="ArrowIcon" size={36} />
          </View>
          <View style={styles.graphWrapper}>
            <GestureDetector gesture={pan}>
              <Animated.View style={animatedStyles}>
                <Svg height="320" width="320" viewBox="0 0 180 180">
                  <G ref={ref ?? refs} rotation={-90} originX="90" originY="90">
                    {total === 0 ? (
                      <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="#F1F6F9"
                        fill="transparent"
                        strokeWidth="10"
                      />
                    ) : (
                      items.map((element, index) => (
                        <Circle
                          key={index}
                          cx="50%"
                          cy="50%"
                          r={radius}
                          stroke={element.color}
                          fill="transparent"
                          strokeWidth="80"
                          strokeDasharray={circleCircumference}
                          strokeDashoffset={strokeDashoffset(index)}
                          rotation={angle(index)}
                          originX="90"
                          originY="90"
                        />
                      ))
                    )}
                  </G>
                </Svg>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      </GestureHandlerRootView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {items.map((element, index) => (
          <Text key={+index}>
            <Svg height="11" width="11">
              <Circle cx="5" cy="5" r="5" fill={element.color} />
            </Svg>
            {element.text ?? `${index + 1}번 항목`}
          </Text>
        ))}
      </View>
    </>
  );
});

export default Roulette;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
