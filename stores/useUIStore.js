import { create } from 'zustand';

export const useUIStore = create((set) => ({
    currentView: 'mypage',
    currentDate: new Date(2026, 0, 1),
    isChatOpen: false,
    isVacationModalOpen: false,
    isPhqModalOpen: false,

    // Vacation Form State
    vacationForm: {
        type: '연차', startDate: '', endDate: '', reason: '',
        location: '', emergencyContact: '', workGoals: '', handover: '',
        relationship: '', eventType: '', symptoms: '', hospital: ''
    },

    setCurrentView: (view) => set({ currentView: view }),
    setCurrentDate: (date) => set({ currentDate: date }),
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
    openVacationModal: () => set({ isVacationModalOpen: true }),
    closeVacationModal: () => set({ isVacationModalOpen: false }),
    openPhqModal: () => set({ isPhqModalOpen: true }),
    closePhqModal: () => set({ isPhqModalOpen: false }),
    setVacationForm: (form) => set({ vacationForm: form }),
    resetVacationForm: () => set({
        vacationForm: {
            type: '연차', startDate: '', endDate: '', reason: '',
            location: '', emergencyContact: '', workGoals: '', handover: '',
            relationship: '', eventType: '', symptoms: '', hospital: ''
        }
    })
}));
