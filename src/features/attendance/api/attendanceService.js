import api from '../../../api/axios';

export const attendanceService = {
    // 내 근태 기록 조회
    getMyAttendance: async (params = {}) => {
        try {
            const { startDate, endDate, status } = params;
            const response = await api.get('/attendance', {
                params: { startDate, endDate, status }
            });
            return response.data;
        } catch (error) {
            console.error('내 근태 기록 조회 에러:', error);
            throw error;
        }
    },

    // 내 근태 통계 조회 (대시보드용)
    getMyDashboardStats: async () => {
        try {
            const response = await api.get('/attendance/dashboard/my');
            return response.data;
        } catch (error) {
            console.error('내 근태 통계 조회 에러:', error);
            throw error;
        }
    },

    // 전사 근태 통계 조회 (관리자용)
    getCompanyDashboardStats: async () => {
        try {
            const response = await api.get('/attendance/dashboard/company');
            return response.data;
        } catch (error) {
            console.error('전사 근태 통계 조회 에러:', error);
            throw error;
        }
    },

    // 전체 직원 근태 기록 조회 (관리자용)
    getAllAttendance: async (params = {}) => {
        try {
            const { startDate, endDate, status, name } = params;
            const response = await api.get('/attendance/all', {
                params: { startDate, endDate, status, name }
            });
            return response.data;
        } catch (error) {
            console.error('전체 직원 근태 기록 조회 에러:', error);
            throw error;
        }
    },

    // 출근 처리
    checkIn: async () => {
        try {
            const response = await api.post('/attendance/check-in');
            return response.data;
        } catch (error) {
            console.error('출근 처리 에러:', error);
            throw error;
        }
    },

    // 퇴근 처리
    checkOut: async () => {
        try {
            const response = await api.post('/attendance/check-out');
            return response.data;
        } catch (error) {
            console.error('퇴근 처리 에러:', error);
            throw error;
        }
    }
};
