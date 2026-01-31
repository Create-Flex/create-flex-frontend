import { create } from 'zustand';

export const useAdvertisementStore = create((set, get) => ({
  advertisements: [],
  isLoading: false,
  error: null,

  // 광고 목록 설정
  setAdvertisements: (ads) => set({ advertisements: ads }),

  // 광고 추가
  addAdvertisement: (newAd) => set((state) => ({
    advertisements: [newAd, ...state.advertisements]
  })),

  // 광고 상태 업데이트
  updateAdvertisementStatus: (adId, status) => set((state) => ({
    advertisements: state.advertisements.map(ad =>
      ad.promotionId === adId
        ? { ...ad, promotionStatus: status }
        : ad
    )
  })),

  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 에러 초기화
  clearError: () => set({ error: null })
}));