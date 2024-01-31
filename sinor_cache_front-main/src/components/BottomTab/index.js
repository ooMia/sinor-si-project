import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { theme } from '@/theme/color';
import SvgIcon from '@/components/SvgIcon';

function GhostLeg() {
  return (
    <View>
      <Text>사다리타기</Text>
    </View>
  );
}

const BottomTab = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        borderTopColor: '#DBDBDB',
        borderTopWidth: 1,
        maxHeight: 56,
      }}
    >
      <Button
        style={styles.tab}
        color={{ color: '#3F3F3F' }}
        text={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgIcon name="VoteIcon" size={24} />
            <Text>투표 만들기</Text>
          </View>
        }
        onPress={() => navigation.push('투표 만들기')}
      />
      <Button
        style={styles.tab}
        color={{ color: '#3F3F3F' }}
        text={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgIcon name="GhostLegIcon" size={24} />
            <Text>사다리 타기</Text>
          </View>
        }
        onPress={() => navigation.push('CreateGhostLeg')}
      />
      <Button
        style={styles.tab}
        color={{ color: '#3F3F3F' }}
        text={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgIcon name="RouletteIcon" size={24} />
            <Text>룰렛 만들기</Text>
          </View>
        }
        onPress={() => navigation.push('CreateRoulette')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
  },
});

export default BottomTab;
