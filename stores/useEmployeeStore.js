import { create } from 'zustand';
import {
    INITIAL_TEAMS,
    INITIAL_EMPLOYEES,
    INITIAL_DEPARTMENTS
} from '../constants';

export const useEmployeeStore = create((set) => ({
    employees: INITIAL_EMPLOYEES,
    teams: [],
    departments: INITIAL_DEPARTMENTS,

    setEmployees: (employees) => set({ employees }),
    setTeams: (teams) => set({ teams }),
    setDepartments: (departments) => set({ departments }),

    updateEmployee: (updatedEmployee) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
        )
    })),

    updateEmployeeFromProfile: (profile) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === profile.employeeId
                ? {
                    ...emp,
                    name: profile.name,
                    engName: profile.engName,
                    nickname: profile.nickname,
                    email: profile.email,
                    personalEmail: profile.personalEmail,
                    phone: profile.phone,
                    avatarUrl: profile.avatarUrl,
                    coverUrl: profile.coverUrl
                }
                : emp
        )
    }))
}));
