import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postData } from '@/utils/customFetch';

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postData('/board', {}),
    onSuccess: (data) => {
      // 여기서 data는 생성된 board id의 정보 가지고 있음
      // Mutation이 성공한 후에 cache 업데이트
      console.log('mutation Data', data);
      queryClient.setQueryData(['board'], data);
    },
    onError: (error, variables, context) => {
      console.log(`rolling back optimistic update with id ${context.id}`);
    },
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      postData('/member', {
        name: 'guest',
        profile: 'https://picsum.photos/200',
      }),
    onSuccess: (data) => {
      console.log('mutation Data Member', data);
      queryClient.setQueryData(['member'], data);
    },
    onError: (error, variables, context) => {
      console.log(`rolling back optimistic update with id ${context.id}`);
    },
  });
}
