import {
  TouchableOpacity as RNButton,
  Pressable as RNPressabble,
} from 'react-native';
import Text from '@/components/Text';
import { theme, modalTheme } from '@/theme/color';
const Button = (props) => {
  const { style, onPress, text, color = 'white', ...prop } = props;
  return (
    <RNButton
      style={[
        {
          alignItems: 'center',
          backgroundColor: theme.main,
          padding: 10,
        },
        style,
      ]}
      onPress={onPress}
      {...prop}
    >
      {text && <Text style={color}>{text}</Text>}
    </RNButton>
  );
};

export const ModalButton = (props) => {
  const { style, cancel, confirm, text, onPress } = props;
  return (
    <RNButton
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
          // paddingHorizontal: 10,
          // paddingVertical: 24,
        },
        style,
      ]}
      onPress={onPress}
    >
      {cancel && (
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: modalTheme.cancelText,
          }}
        >
          {text}
        </Text>
      )}
      {confirm && (
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: modalTheme.confirmText,
          }}
        >
          {text}
        </Text>
      )}
    </RNButton>
  );
};

export default Button;
