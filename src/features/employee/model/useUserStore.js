import { create } from 'zustand';

export const useUserStore = create((set) => ({
    userProfile: null,  // 백엔드에서 데이터 로드 전까지 null

    setUserProfile: (profile) => set({ userProfile: profile }),

    updateProfile: (updatedProfile) => {
        set({ userProfile: updatedProfile });
    }
}));
