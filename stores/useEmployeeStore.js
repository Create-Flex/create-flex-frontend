import { create } from 'zustand';
import { departmentService } from '../api/departmentService';
import {
    INITIAL_EMPLOYEES
} from '../constants';

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    teams: [],
    departments: [],

    setEmployees: (employees) => set({ employees }),
    setTeams: (teams) => set({ teams }),
    setDepartments: (departments) => set({ departments }),

    updateEmployee: (updatedEmployee) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
        )
    })),


    fetchDepartments: async () => {
        try {
            const response = await departmentService.getAllDepartments();
            // 백엔드 필드명을 프론트엔드 UI 코드에서 사용하는 필드명으로 매핑
            const mappedDepts = response.data.map(dept => ({
                id: dept.departmentId,
                name: dept.departmentName,
                phone: dept.departmentCall,
                description: dept.departmentDetail,
                color: dept.departmentColor
            }));
            set({ departments: mappedDepts });
        } catch (error) {
            console.error("부서 목록 로딩 실패:", error);
        }
    },

    // 부서 삭제 (서버 연동)
    removeDepartment: async (id) => {
        try {
            await departmentService.deleteDepartment(id);
            set(state => ({
                departments: state.departments.filter(d => d.id !== id)
            }));
        } catch (error) {
            alert("부서 삭제에 실패했습니다.");
        }
    }
    // ... create, update 함수도 유사하게 구현
}));

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