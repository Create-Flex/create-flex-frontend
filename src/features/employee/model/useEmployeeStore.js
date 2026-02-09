import { create } from 'zustand';
import { departmentService } from '../../organization/api/departmentService';
import { teamService } from '../../organization/api/teamService';
import { memberService } from '../api/memberService';

export const useEmployeeStore = create((set, get) => ({
    // State
    employees: [],
    teams: [],
    departments: [],
    isLoading: false,
    error: null,

    // 전체 직원 목록 조회
    fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await memberService.getAllMembers();

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedEmployees = response.data.list.map(member => ({
                id: member.memberid,
                name: member.memberName,
                engName: member.engName || '',
                nickname: member.nickname || member.memberName,
                email: member.corporEmail || member.memberAccount,
                personalEmail: member.personalEmail || '',
                phone: member.personalCall || '',
                dept: member.departmentName || '무소속',
                role: member.task || '-',
                rank: member.memberRole === 'ADMINISTRATOR' ? '관리자' :
                    member.memberRole === 'MANAGER' ? '매니저' : '사원',
                workStatus: member.attendanceStatus || '미출근',
                joinDate: member.hireDate || '',
                avatarUrl: member.profileImage || '',
                coverUrl: member.profileBanner || '',
                memberRole: member.memberRole,
                vacationRemainder: member.vacationRemainder || 0
            }));

            set({ employees: mappedEmployees, isLoading: false });
        } catch (error) {
            console.error('직원 목록 조회 실패:', error);
            set({
                error: error.response?.data?.message || '직원 목록을 불러오는데 실패했습니다.',
                isLoading: false
            });
        }
    },

    // 직원 추가
    addEmployee: async (employeeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await memberService.createMember(employeeData);

            // 새로운 직원 추가 후 목록 새로고침
            await get().fetchEmployees();

            set({ isLoading: false });
            return response.data;
        } catch (error) {
            console.error('직원 추가 실패:', error);
            set({
                error: error.response?.data?.message || '직원 추가에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 직원 수정
    updateEmployee: async (id, updateData) => {
        set({ isLoading: true, error: null });
        try {
            await memberService.updateMember(id, updateData);

            // 수정 후 목록 새로고침
            await get().fetchEmployees();

            set({ isLoading: false });
        } catch (error) {
            console.error('직원 수정 실패:', error);
            set({
                error: error.response?.data?.message || '직원 정보 수정에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 직원 삭제
    deleteEmployee: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await memberService.deleteMember(id);

            // 삭제 후 목록에서 제거
            set(state => ({
                employees: state.employees.filter(emp => emp.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('직원 삭제 실패:', error);
            set({
                error: error.response?.data?.message || '직원 삭제에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 프로필에서 직원 정보 업데이트
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
    })),

    // 전체 팀 목록 조회 (관리자용)
    fetchTeams: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await teamService.getAllTeams();

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedTeams = response.data.map(team => ({
                id: team.teamId,
                teamName: team.teamName,
                teamDescription: team.teamDetail,
                memberIds: team.memberIds || []
            }));

            set({ teams: mappedTeams, isLoading: false });
        } catch (error) {
            console.error('팀 목록 조회 실패:', error);
            set({
                error: error.response?.data?.message || '팀 목록을 불러오는데 실패했습니다.',
                isLoading: false
            });
        }
    },

    // 팀 목록 직접 설정 (외부에서 호출용)
    setTeams: (teams) => set({ teams }),

    // 팀 추가
    addTeam: async (teamData) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.createTeam(teamData);

            // 팀 추가 후 목록 새로고침
            await get().fetchTeams();

            set({ isLoading: false });
        } catch (error) {
            console.error('팀 추가 실패:', error);
            set({
                error: error.response?.data?.message || '팀 추가에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 팀 수정
    updateTeam: async (teamId, memberIds) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.updateTeamMembers(teamId, memberIds);

            // 팀 수정 후 목록 새로고침
            await get().fetchTeams();

            set({ isLoading: false });
        } catch (error) {
            console.error('팀 수정 실패:', error);
            set({
                error: error.response?.data?.message || '팀 수정에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 팀 삭제
    deleteTeam: async (teamId) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.deleteTeam(teamId);

            // 삭제 후 목록에서 제거
            set(state => ({
                teams: state.teams.filter(team => team.id !== teamId),
                isLoading: false
            }));
        } catch (error) {
            console.error('팀 삭제 실패:', error);
            set({
                error: error.response?.data?.message || '팀 삭제에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },

    // 부서 목록 조회
    fetchDepartments: async () => {
        set({ isLoading: true, error: null });
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
            set({ departments: mappedDepts, isLoading: false });
        } catch (error) {
            console.error("부서 목록 로딩 실패:", error);
            set({
                error: error.response?.data?.message || '부서 목록을 불러오는데 실패했습니다.',
                isLoading: false
            });
        }
    },

    // 부서 삭제
    removeDepartment: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await departmentService.deleteDepartment(id);
            set(state => ({
                departments: state.departments.filter(d => d.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error("부서 삭제 실패:", error);
            set({
                error: error.response?.data?.message || '부서 삭제에 실패했습니다.',
                isLoading: false
            });
            throw error;
        }
    },
    setDepartments: (departments) => set({ departments }),
    // 에러 초기화
    clearError: () => set({ error: null })
}));