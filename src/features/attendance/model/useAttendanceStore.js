import { create } from 'zustand';
import { useEmployeeStore } from '../../employee/model/useEmployeeStore';

export const useAttendanceStore = create((set, get) => ({
    attendanceLogs: [],
    refreshKey: 0,

    setAttendanceLogs: (logs) => set({ attendanceLogs: logs }),

    addAttendanceLog: (log) => set((state) => {
        const existingIndex = state.attendanceLogs.findIndex(
            l => l.date === log.date && l.name === log.name
        );
        if (existingIndex >= 0) {
            const newLogs = [...state.attendanceLogs];
            newLogs[existingIndex] = { ...newLogs[existingIndex], ...log };
            return { attendanceLogs: newLogs };
        }
        return { attendanceLogs: [log, ...state.attendanceLogs] };
    }),

    triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    initAttendanceLogs: () => {
        const employees = useEmployeeStore.getState().employees;
        const logs = [];
        const todayStr = new Date().toISOString().split('T')[0];

        employees.forEach(emp => {
            if (emp.name === '이채연') return;
            logs.push({
                id: `${emp.id}-${todayStr}`,
                employeeId: emp.id,
                name: emp.name,
                date: todayStr,
                clockIn: '08:55',
                clockOut: '18:10',
                status: '정상',
                type: 'office'
            });
        });
        set({ attendanceLogs: logs });
    }
}));
