import axios from './axios';

export const teamService = {
    // 팀 생성 (TeamCreateRequest 사용)
    createTeam: (data) => axios.post('/admin/teams', data),
    
    // 전체 팀 목록 조회
    getAllTeams: () => axios.get('/admin/teams'),
    
    // 팀 상세 정보 및 소속 멤버 조회
    getTeamDetail: (teamId) => axios.get(`/admin/teams/${teamId}`),
    
    // 팀 정보 수정 (이름, 설명 등)s
    updateTeam: (teamId, data) => axios.patch(`/admin/teams/${teamId}`, data),
    
    // 팀 멤버 업데이트 (TeamMemberUpdateRequest 사용)
    updateTeamMembers: (teamId, memberIds) => 
        axios.put(`admin/teams/${teamId}/members`, { memberIds }),
    
    // 팀 삭제
    deleteTeam: (teamId) => axios.delete(`/admin/teams/${teamId}`),

    getEmployeeTeams: () => axios.get('/employees/team')
};