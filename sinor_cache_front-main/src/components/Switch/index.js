import { Switch as RNSwitch } from 'react-native';
import { theme, voteTheme } from '@/theme/color';
import { useEffect, useState } from 'react';

const Switch = (props) => {
  const { onParentState, value = false } = props;
  const [isEnabled, setIsEnabled] = useState(value);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  useEffect(() => {
    if (onParentState) onParentState(isEnabled);
  }, [isEnabled]);
  return (
    <RNSwitch
      trackColor={{
        false: voteTheme.optionSwitchFalseBackground,
        true: theme.main,
      }}
      thumbColor={voteTheme.optionSwitchTrueText}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};

export default Switch;
