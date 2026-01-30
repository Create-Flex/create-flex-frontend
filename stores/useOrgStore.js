import { create } from 'zustand';
import {
    EMPLOYEE_PROFILE_DATA,
    INITIAL_TEAMS,
    INITIAL_EMPLOYEES,
    INITIAL_DEPARTMENTS,
    INITIAL_HEALTH_RECORDS
} from '../constants';
import { useAuthStore } from './useAuthStore';

export const useOrgStore = create((set, get) => ({
    userProfile: EMPLOYEE_PROFILE_DATA,
    employees: INITIAL_EMPLOYEES,
    teams: INITIAL_TEAMS,
    departments: INITIAL_DEPARTMENTS,

    // Shared States (Global)
    employeeHealthRecords: INITIAL_HEALTH_RECORDS,
    attendanceLogs: [], // Initialized dynamically in App usually, but we can init here or via action

    setUserProfile: (profile) => set({ userProfile: profile }),

    updateProfile: (updatedProfile) => {
        set((state) => ({
            userProfile: updatedProfile,
            employees: state.employees.map(emp =>
                emp.id === updatedProfile.employeeId
                    ? {
                        ...emp,
                        name: updatedProfile.name,
                        engName: updatedProfile.engName,
                        nickname: updatedProfile.nickname,
                        email: updatedProfile.email,
                        personalEmail: updatedProfile.personalEmail,
                        phone: updatedProfile.phone,
                        avatarUrl: updatedProfile.avatarUrl,
                        coverUrl: updatedProfile.coverUrl
                    }
                    : emp
            )
        }));
    },

    setEmployees: (employees) => set({ employees }),
    setTeams: (teams) => set({ teams }),
    setDepartments: (departments) => set({ departments }),

    setAttendanceLogs: (logs) => set({ attendanceLogs: logs }),
    addAttendanceLog: (log) => set((state) => {
        const existingIndex = state.attendanceLogs.findIndex(l => l.date === log.date && l.name === log.name);
        if (existingIndex >= 0) {
            const newLogs = [...state.attendanceLogs];
            newLogs[existingIndex] = { ...newLogs[existingIndex], ...log };
            return { attendanceLogs: newLogs };
        }
        return { attendanceLogs: [log, ...state.attendanceLogs] };
    }),

    addHealthRecord: (newRecord) => set((state) => ({
        employeeHealthRecords: [newRecord, ...state.employeeHealthRecords]
    })),

    // Logic to initialize attendance logs (migrated from App.jsx)
    initAttendanceLogs: () => {
        const { employees } = get();
        const logs = [];
        const todayStr = new Date().toISOString().split('T')[0];

        employees.forEach(emp => {
            if (emp.name === '이채연') return; // Skip current user in mock generation (hardcoded logic from App.jsx)
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
