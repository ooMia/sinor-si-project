import { StyleSheet, View, FlatList } from 'react-native';
import { theme, voteTheme, rouletteTheme } from '@/theme/color';
import Text, { TitleText } from '@/components/Text';
import { CircleCheckBox } from '@/components/CheckBox';

export default function GhostLegResultPage({ navigation, route }) {
  const result = JSON.parse(route.params?.result);
  return (
    <FlatList
      data={result.items}
      style={styles.container}
      keyExtractor={(_, i) => i}
      renderItem={({ item, index }) => (
        <View style={styles.divider}>
          <CircleCheckBox
            style={{
              borderWidth: 0,
              width: 20,
              height: 20,
              backgroundColor: rouletteTheme[`color${index + 1}`],
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TitleText style={{}}>{item.name}</TitleText>
            <TitleText
              style={{
                color:
                  item.text === '당첨' ? theme.main : rouletteTheme.infoText,
                fontWeight: 'bold',
              }}
            >
              {item.text}
            </TitleText>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  divider: {
    borderBottomColor: voteTheme.grayBorder,
    borderBottomWidth: 0.5,
    paddingBottom: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: voteTheme.voteBadgeBackground,
    color: voteTheme.voteBadgeText,
    width: 52,
    height: 30,
    borderRadius: 10,
    marginRight: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  grayText: {
    color: '#9E9E9E',
  },
});
