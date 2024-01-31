import { ScrollView, StyleSheet, View } from 'react-native';
import { TitleText } from '@/components/Text';
import TextInput, { MultilineTextInput } from '@/components/TextInput';
import { theme } from '@/theme/color';
import BottomTab from '@/components/BottomTab';
import VotePreview from '@/components/Vote/preview';
import RoulettePreview from '@/components/Roulette/preview';
import GhostLegPreview from '@/components/GhostLeg/preview';
import Button from '@/components/Button';
import { useEffect } from 'react';
import getLegData from '../utils/randomLeg';
import { API_URL } from '@env';
import { useQueryClient } from '@tanstack/react-query';

export default function BoardPage({ navigation, route }) {
  const queryClient = useQueryClient();
  const board = queryClient.getQueryData(['board']);
  const boardId = board?.id;
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          style={{ backgroundColor: theme.background }}
          color={{ color: theme.main, fontSize: 20 }}
          text="완료"
          onPress={handleSubmitBoard}
        />
      ),
    });
  });

  const handleSubmitBoard = async () => {
    navigation.setParams({
      boardId: (route.params.boardId = boardId),
    });

    if (route.params?.ghostLeg?.items) {
      const legData = getLegData(route.params?.ghostLeg?.items);
      navigation.setParams({
        legData: (route.params.legData = legData),
      });
    }

    if (route.params.vote) {
      const res = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: route.params.vote,
      });
    }
    navigation.navigate('Vote', route.params);
  };
  const resetParams = (deleteParam) => {
    navigation.setParams({
      vote:
        deleteParam === 'vote' &&
        ((route.params.vote = null), (route.params.type = null)),
      roulette: deleteParam === 'roulette' && (route.params.roulette = null),
      ghostLeg: deleteParam === 'ghostLeg' && (route.params.ghostLeg = null),
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TitleText>제목</TitleText>
        <TextInput maxLength={30} placeholder={'제목을 입력하세요.'} />
        <TitleText>내용</TitleText>
        <MultilineTextInput
          maxLength={1000}
          placeholder={`*에티켓을 준수해주세요.\n*유익한 공간을 만들어가요.`}
        />
        {route.params?.vote && (
          <VotePreview
            resetParams={resetParams}
            navigation={navigation}
            route={route}
          />
        )}
        {route.params?.roulette && (
          <RoulettePreview
            resetParams={resetParams}
            navigation={navigation}
            route={route}
          />
        )}
        {route.params?.ghostLeg && (
          <GhostLegPreview
            resetParams={resetParams}
            navigation={navigation}
            route={route}
          />
        )}
      </View>
      <BottomTab navigation={navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
});
