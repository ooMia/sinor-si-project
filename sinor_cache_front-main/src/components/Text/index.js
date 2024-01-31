import { Text as RNText } from 'react-native';

const DEFAULT_FONTSIZE = 17;
const DEFAULT_FONTWEIGHT = 400;

const Text = (props) => {
  const { children, style } = props;
  return (
    <RNText
      style={[
        {
          fontSize: DEFAULT_FONTSIZE,
          fontWeight: DEFAULT_FONTWEIGHT,
          textAlign: 'center',
          textAlignVertical: 'center',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

export const TitleText = (props) => {
  const { children, style } = props;
  return (
    <RNText
      style={[
        {
          fontSize: 20,
          fontWeight: 'bold',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
export default Text;
