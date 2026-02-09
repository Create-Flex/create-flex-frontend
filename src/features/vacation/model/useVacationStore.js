import { create } from 'zustand';
import { INITIAL_VACATION_LOGS } from '../../../constants';

const INITIAL_VACATION_FORM = {
    type: '연차',
    startDate: '',
    endDate: '',
    reason: '',
    location: '',
    emergencyContact: '',
    workGoals: '',
    handover: '',
    relationship: '',
    eventType: '',
    symptoms: '',
    hospital: ''
};

export const useVacationStore = create((set) => ({
    vacationLogs: INITIAL_VACATION_LOGS,
    vacationForm: INITIAL_VACATION_FORM,
    refreshKey: 0,

    // 휴가 로그 관리
    setVacationLogs: (logs) => set({ vacationLogs: logs }),
    addVacationLog: (log) => set((state) => ({
        vacationLogs: [log, ...state.vacationLogs]
    })),

    // 휴가 폼 관리
    setVacationForm: (form) => set({ vacationForm: form }),
    updateVacationForm: (field, value) => set((state) => ({
        vacationForm: { ...state.vacationForm, [field]: value }
    })),
    resetVacationForm: () => set({ vacationForm: INITIAL_VACATION_FORM }),

    // 리프레시 트리거
    triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 }))
}));
