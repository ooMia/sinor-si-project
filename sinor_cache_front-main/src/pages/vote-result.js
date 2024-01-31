import { StyleSheet, View, Image, FlatList, Dimensions } from 'react-native';
import { theme, voteTheme } from '@/theme/color';
import React, { useState } from 'react';
import Text, { TitleText } from '@/components/Text';
import { getData } from '@/utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const windowWidth = Dimensions.get('window').width;
const GRIDCOLUMN = 2;
const Item = React.memo(({ voter, width }) => {
  const { data: member, isPending } = useQuery({
    queryKey: ['member', voter?.memberId],
    queryFn: () => getData(`/member/${voter?.memberId}`),
  });
  if (isPending) return;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: width }}>
      <Image
        source={{
          uri: member?.profile ?? 'https://picsum.photos/200',
        }}
        style={{ width: 32, height: 32, borderRadius: 50 }}
      />
      <Text style={{ fontWeight: 'bold', marginLeft: 8 }}>
        {member?.name ?? 'guest'}
      </Text>
    </View>
  );
});

export default function VoteResultPage({ navigation, route }) {
  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const result = JSON.parse(route.params?.result);
  const voteLogs = JSON.parse(route.params?.voteLogs);
  return (
    <FlatList
      data={result.voteItems}
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      keyExtractor={(_, i) => i}
      renderItem={({ item, index }) => (
        <View style={index !== result.voteItems.length - 1 && styles.divider}>
          <TitleText style={{ marginBottom: 16 }}>
            {item.content}{' '}
            <Text style={{ color: theme.main, fontWeight: 'bold' }}>
              {voteLogs[index].length}명
            </Text>
          </TitleText>
          {voteLogs[index].length ? (
            <FlatList
              data={voteLogs[index]}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
              renderItem={({ item }) => (
                <Item voter={item} width={containerWidth / GRIDCOLUMN} />
              )}
              numColumns={GRIDCOLUMN}
            />
          ) : (
            <Text style={{ color: voteTheme.addItemText, marginLeft: 8 }}>
              투표한 모임원이 없습니다.
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  divider: {
    borderBottomColor: voteTheme.grayBorder,
    borderBottomWidth: 0.5,
    paddingBottom: 16,
    marginBottom: 24,
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
