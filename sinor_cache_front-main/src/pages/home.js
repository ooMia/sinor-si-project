import { StyleSheet, Text, View, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCreateBoard } from '@/hooks/useCreateBoard';
import Roulette from '@/components/Roulette';

const TopTab = createMaterialTopTabNavigator();

const Test = ({ route, navigation }) => {
  const { mutate: createBoard } = useCreateBoard();
  const { itemName } = route.params;

  return (
    <View style={styles.container}>
      <Text>{itemName} 페이지</Text>
      {route.name === '게시판' ? (
        <>
          <Button
            title="투표 게시글 보기"
            color="black"
            onPress={() => {
              navigation.navigate({
                name: 'Vote',
                params: { boardId: 1, vote: {} },
              });
            }}
          />
          <Button
            title="게시글 작성하기"
            onPress={() => {
              createBoard();
              navigation.navigate('글 작성하기');
            }}
          />
        </>
      ) : (
        <></>
      )}
      {route.name === '룰렛' && <Roulette />}
    </View>
  );
};

export default function HomePage({ route, navigation }) {
  return (
    <>
      <TopTab.Navigator>
        <TopTab.Screen
          name={'공지'}
          component={Test}
          initialParams={{ itemName: '공지' }}
        />
        <TopTab.Screen
          name={'일정'}
          component={Test}
          initialParams={{ itemName: '일정' }}
        />
        <TopTab.Screen
          name={'게시판'}
          component={Test}
          initialParams={{ itemName: '게시판' }}
        />
      </TopTab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
