import api from './axios';

export const staffService = {
    // 직원 전체 목록 및 검색
    getEmployees: (name = '') => {
        const url = name ? `/employees/?name=${encodeURIComponent(name)}` : '/employees/';
        return api.get(url);
    },
    // 직원 상세 정보 조회
    getEmployeeDetail: (memberid) => {
        return api.get(`/employees/${memberid}`);
    }
};