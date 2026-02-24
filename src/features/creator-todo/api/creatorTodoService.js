import api from '../../../api/axios';

export const creatorTodoService = {
  // 보드 조회 (컬럼 + Todo 목록)
  getBoard: async (creatorId) => {
    const response = await api.get(`/creator-todo/${creatorId}`);
    return response.data;
  },

  // Todo 생성
  createTodo: async ({ creatorId, columnId, content }) => {
    const response = await api.post('/creator-todo', { creatorId, columnId, content });
    return response.data;
  },

  // Todo 수정
  updateTodo: async ({ todoId, content }) => {
    const response = await api.put('/creator-todo', { todoId, content });
    return response.data;
  },

  // Todo 삭제
  deleteTodo: async (todoId) => {
    const response = await api.delete(`/creator-todo/${todoId}`);
    return response.data;
  },
};
