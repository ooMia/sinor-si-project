import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { TitleText } from '@/components/Text';
import { theme, voteTheme } from '@/theme/color';
import VoteForm from '@/components/Vote';
import RouletteForm from '@/components/Roulette/form';
import GhostLegForm from '@/components/GhostLeg/form';
import { useEffect, useState, useRef } from 'react';
import Text from '@/components/Text';
import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { TabModal } from '@/components/Modal';

const text = {
  vote: {
    tag: '투표',
    title: '모임 일정 투표 부탁드립니다.',
    content:
      '올해 마지막 정모를 계획중입니다. 다들 가능한 일정에 투표 부탁드립니다.^^',
  },
  roulette: {
    tag: '돌림판',
    title: '돌림판 돌려 상품 얻어가세요.',
    content:
      '크리스마스를 기념하며, 모임장이 선물을 가져왔습니다. 돌림판을 돌려 당첨된 분에게는 소소한 상품을 전달 드리겠습니다 ^^',
  },
  ghostLeg: {
    tag: '사다리 타기',
    title: '사다리 타기로 벌칙 정하겠습니다.',
    content: '사다리 타기로 당첨된 사람이 다음 회식 장소 정해주세요.',
  },
};

export default function VotePage({ navigation, route }) {
  const [isDrop, setDrop] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Button
            style={{ backgroundColor: theme.background }}
            text={<SvgIcon name="KebabMenuIcon" />}
            onPress={() => setDrop(!isDrop)}
          />
        </>
      ),
      title: '아차산 산책 모임',
    });
  }, []);

  const content = useRef({});
  if (route.params?.vote) {
    content.current = text.vote;
  } else if (route.params?.roulette) {
    content.current = text.roulette;
  } else if (route.params?.ghostLeg) {
    content.current = text.ghostLeg;
  }

  const handleChangeWriter = (bool) => {
    navigation.setParams({
      vote: route.params?.vote,
      writer: bool,
    });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.badge}>{content.current.tag}</Text>
            <Text style={{ fontWeight: 'bold' }}>{content.current.title}</Text>
          </View>
          <View
            style={{
              ...styles.row,
              paddingVertical: 16,
              borderBottomColor: voteTheme.grayBorder,
              borderBottomWidth: 0.5,
              marginBottom: 20,
            }}
          >
            <Image source={require('@/assets/icons/user-thumbnail.png')} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <TitleText>친절한 사장님</TitleText>
              <View
                style={{
                  ...styles.row,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.grayText}>2023년 12월 1일 09:17</Text>
                <Text style={styles.grayText}>조회 251</Text>
              </View>
            </View>
          </View>
          <Text style={{ textAlign: 'left' }}>
            <Text style={{ color: theme.main }}>{content.current.tag} </Text>
            {content.current.content}
          </Text>

          {route.params?.vote && (
            <VoteForm navigation={navigation} route={route} />
          )}
          {route.params?.roulette && (
            <RouletteForm navigation={navigation} route={route} />
          )}
          {route.params?.ghostLeg && (
            <GhostLegForm navigation={navigation} route={route} />
          )}
        </View>
      </ScrollView>
      <TabModal
        isModal={isDrop}
        setModal={() => setDrop(false)}
        handler={handleChangeWriter}
        isWriter={route.params?.writer}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: voteTheme.voteBadgeBackground,
    color: voteTheme.voteBadgeText,
    paddingHorizontal: 5,
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
