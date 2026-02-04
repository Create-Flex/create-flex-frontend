import { create } from 'zustand';

export const useCreatorStore = create((set, get) => ({
  creators: [],
  creatorEvents: [], 
  supportRequests: [], 
  isLoading: false,
  error: null,

  // 크리에이터 목록 설정
  setCreators: (creators) => set({ creators }),

  // 크리에이터 추가
  addCreator: (newCreator) => set((state) => ({
    creators: [newCreator, ...state.creators]
  })),

  // 크리에이터 업데이트
  updateCreator: (creatorId, updatedData) => set((state) => ({
    creators: state.creators.map(creator =>
      creator.id === creatorId
        ? { ...creator, ...updatedData }
        : creator
    )
  })),

  // 크리에이터 삭제
  removeCreator: (creatorId) => set((state) => ({
    creators: state.creators.filter(creator => creator.id !== creatorId)
  })),

  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 에러 초기화
  clearError: () => set({ error: null }),

  // 특정 크리에이터 찾기
  getCreatorById: (creatorId) => {
    const state = get();
    return state.creators.find(creator => creator.id === creatorId);
  }
}));