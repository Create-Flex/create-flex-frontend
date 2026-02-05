import axios from './axios';

export const teamService = {
    // 전체 팀 목록 조회
    getAllTeams: () => axios.get('/admin/teams'),

    // 팀 상세 정보 및 소속 멤버 조회
    getTeamDetail: (teamId) => axios.get(`/admin/teams/${teamId}`),

    // 팀 생성 (TeamCreateRequest 사용)
    createTeam: (data) => axios.post('/admin/teams', {
        teamName: data.teamName,
        teamDetail: data.teamDetail,
        memberIds: data.memberIds
    }),

    // 팀 기본 정보 업데이트 (TeamCreateRequest 사용)
    updateTeam: (teamId, data) =>
        axios.patch(`/admin/teams/${teamId}/info`, {
            teamName: data.teamName,
            teamDetail: data.teamDetail
        }),

    // 팀 멤버 업데이트 (TeamMemberUpdateRequest 사용)
    updateTeamMembers: (teamId, memberIds) =>
        axios.patch(`/admin/teams/${teamId}`, { memberIds }),

    // 팀 삭제
    deleteTeam: (teamId) => axios.delete(`/admin/teams/${teamId}`),
    // 내 소속 팀 목록 조회
    getMyTeams: () => axios.get('/employees/teams'),

    // 내 팀 상세 정보 조회
    getMyTeamDetail: (teamId) => axios.get(`/employees/teams/${teamId}`)
};