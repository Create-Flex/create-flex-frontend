import { create } from 'zustand';

export const useUIStore = create((set) => ({
    // 뷰 상태
    currentView: 'mypage',
    currentDate: new Date(),

    // 모달 상태
    isChatOpen: false,
    isVacationModalOpen: false,
    isPhqModalOpen: false,

    // 뷰 관리
    setCurrentView: (view) => set({ currentView: view }),
    setCurrentDate: (date) => set({ currentDate: date }),

    // 채팅 관리
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

    // 휴가 모달 관리
    openVacationModal: () => set({ isVacationModalOpen: true }),
    closeVacationModal: () => set({ isVacationModalOpen: false }),

    // PHQ 모달 관리
    openPhqModal: () => set({ isPhqModalOpen: true }),
    closePhqModal: () => set({ isPhqModalOpen: false })
}));
