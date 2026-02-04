import { create } from 'zustand';

export const useLegalTaxStore = create((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  // 법률/세무 요청 목록 설정
  setRequests: (requests) => set({ requests }),

  // 법률/세무 요청 추가
  addRequest: (newRequest) => set((state) => ({
    requests: [newRequest, ...state.requests]
  })),

  // 법률/세무 요청 상태 업데이트
  updateRequestStatus: (requestId, status) => set((state) => ({
    requests: state.requests.map(req =>
      req.id === requestId
        ? { ...req, status }
        : req
    )
  })),

  // 법률/세무 요청 삭제 (필요시)
  removeRequest: (requestId) => set((state) => ({
    requests: state.requests.filter(req => req.id !== requestId)
  })),

  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 에러 초기화
  clearError: () => set({ error: null }),

  // 특정 요청 찾기
  getRequestById: (requestId) => {
    const state = get();
    return state.requests.find(req => req.id === requestId);
  }
}));