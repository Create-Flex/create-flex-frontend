import api from '../../../api/axios';

export const staffService = {
    // 직원 전체 목록 및 검색
    getEmployees: (name = '') => {
        const url = name ? `/employees/?name=${encodeURIComponent(name)}` : '/employees/';
        return api.get(url);
    },
    // 직원 상세 정보 조회
    getEmployeeDetail: (memberid) => {
        return api.get(`/employees/${memberid}`);
    },
    // 부서 목록 조회
    getDepartments: () => {
        return api.get('/admin/departments');
    },
    // 직원 등록
    registerEmployee: (employeeData) => {
        return api.post('/employees/insert', employeeData);
    },
    //직원 수정
    updateEmployee: (memberId, data) => {
        return api.patch(`/employees/${memberId}`, data);
    }
};