import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '@/pages/home';
import LogoTitle from '@/components/LogoTitle';
import BoardPage from '@/pages/board';
import VotePage from '@/pages/vote';
import VoteResultPage from '@/pages/vote-result';
import CreateVote from '@/components/Vote/create';
import CreateRoulette from '@/pages/create-roulette';
import CreateGhostLeg from '@/pages/create-ghost-leg';
import ActiveGhostLeg from '@/pages/active-ghost-leg';
import GhostLegResultPage from '@/pages/ghost-leg-result';
import { TextEncoder, TextDecoder } from 'text-encoding';

// React Native의 전역 객체에 TextEncoder와 TextDecoder 폴리필을 할당
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator id="MainStack" initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{
              headerTitle: (props) => <LogoTitle {...props} />,
            }}
          />
          <Stack.Screen
            name="글 작성하기"
            component={BoardPage}
            options={{
              title: '게시글 작성',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleAlign: 'center',
              headerIconColor: 'black',
              textColor: 'black',
              headerTintColor: 'black',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="투표 만들기"
            component={CreateVote}
            options={{
              headerTitleAlign: 'center',
              // headerBackImageSource:
              //   Platform.OS === 'android'
              //     ? require('@/assets/icons/cancel.png')
              //     : { uri: 'back', width: 24, height: 24 },
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="CreateRoulette"
            component={CreateRoulette}
            options={{
              title: '돌림판 만들기',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="CreateGhostLeg"
            component={CreateGhostLeg}
            options={{
              title: '사다리 설정',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="ActiveGhostLeg"
            component={ActiveGhostLeg}
            options={{
              title: '사다리 타기',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="Vote"
            component={VotePage}
            options={{
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
          <Stack.Screen
            name="VoteResult"
            component={VoteResultPage}
            options={{
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
              title: '결과 확인',
            }}
          />
          <Stack.Screen
            name="GhostLegResult"
            component={GhostLegResultPage}
            options={{
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'black',
              },
              title: '결과 확인',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
