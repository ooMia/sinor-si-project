import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/theme/color';
import Text from '@/components/Text';
import SvgIcon from '@/components/SvgIcon';

const CheckBox = (props) => {
  const { label, style, children, onParentState, open } = props;
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          {
            ...styles.checkBox,
            backgroundColor: open ? theme.main : 'white',
            borderColor: open ? theme.main : 'lightgray',
          },
          style,
        ]}
        value={open}
        onPress={onParentState}
      >
        {open ? <SvgIcon name="CheckIcon" /> : <></>}
      </Pressable>
      {label ? <Text style={styles.text}>{label}</Text> : <></>}
      {children}
    </View>
  );
};

export const VoteCheckBox = (props) => {
  const { label, style, children, onParentState, open } = props;
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          {
            ...styles.checkBox,
            backgroundColor: open ? theme.main : 'lightgray',
            borderWidth: 0,
          },
          style,
        ]}
        value={open}
        onPress={onParentState}
      >
        <SvgIcon name="CheckIcon" />
      </Pressable>
      {label ? <Text style={styles.text}>{label}</Text> : <></>}
      {children}
    </View>
  );
};

export const CircleCheckBox = (props) => {
  const { style, number, onPress } = props;
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          {
            ...styles.checkBox,
            backgroundColor: 'white',
            borderColor: 'lightgray',
          },
          style,
        ]}
        onPress={onPress}
      >
        <Text style={{ color: '#CDCDCD' }}>{number}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  checkBox: {
    borderWidth: 2,
    borderRadius: 50,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'left',
    color: '#797979',
    marginLeft: 10,
  },
});

export default CheckBox;
