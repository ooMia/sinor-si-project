import { TextInput as RNTextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Text from '@/components/Text';
import { theme } from '@/theme/color';

const DEFAULT_FONTSIZE = 17;

const TextInput = (props) => {
  const {
    style,
    placeholder = '',
    keyboardType,
    maxLength,
    children,
    onChangeValue,
    value = '',
    ...prop
  } = props;
  const [text, setText] = useState(value);
  const [focus, setFocus] = useState(false);
  const onChnageText = (text) => setText(text);
  useEffect(() => {
    if (onChangeValue) onChangeValue(text);
  }, [text]);
  useEffect(() => {
    setText(value);
  }, [value]);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          borderColor: focus ? theme.focus : 'lightgray',
          borderBottomWidth: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        },
        style,
      ]}
    >
      <RNTextInput
        style={{
          fontSize: DEFAULT_FONTSIZE,
          width: '100%',
          maxWidth: '90%',
        }}
        value={text}
        maxLength={maxLength}
        onChangeText={onChnageText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...prop}
      />
      {maxLength && (
        <Text
          style={{
            color: 'gray',
          }}
        >
          {text.length}/{maxLength}
        </Text>
      )}
      {children}
    </View>
  );
};

export const MultilineTextInput = (props) => {
  const {
    style,
    placeholder = '',
    keyboardType,
    maxLength = 30,
    padding = 20,
  } = props;
  const [text, onChangeText] = useState('');
  const [focus, setFocus] = useState(false);
  return (
    <View
      style={{
        borderColor: focus ? theme.focus : 'lightgray',
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'flex-end',
        width: '100%',
        padding: padding,
      }}
    >
      <RNTextInput
        style={[
          {
            textAlignVertical: 'top',
            minHeight: 300,
            width: '100%',
            maxWidth: 'inherit',
            fontSize: DEFAULT_FONTSIZE,
          },
          style,
        ]}
        value={text}
        maxLength={maxLength}
        multiline
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <Text
        style={{
          color: 'lightgray',
        }}
      >
        ({text.length}/{maxLength})
      </Text>
    </View>
  );
};

export default TextInput;
