import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import React, { useEffect } from 'react';
import { voteTheme } from '@/theme/color';

// 애니메이션 적용한 투표 항목 컴포넌트
const ActiveItemBar = React.memo((props) => {
  const { ratio } = props;
  const width = useSharedValue('0%');
  useEffect(() => {
    (() => {
      width.value = withTiming(`${ratio}%`, {
        duration: 500,
        easing: Easing.linear,
      });
    })();
    return () => {
      width.value = '0%';
    };
  }, [ratio]);

  return (
    <Animated.View
      style={{
        backgroundColor: voteTheme.voteSubmitBtn,
        position: 'absolute',
        width: width,
        height: '100%',
        borderRadius: 11,
      }}
    ></Animated.View>
  );
});

export default ActiveItemBar;
