import api from '../../../api/axios';

export const staffService = {
    // 직원 전체 목록 및 검색 (name만 입력하거나, { name, page, size } 객체 입력 가능)
    getEmployees: (params) => {
        let url = '/employees/';
        const queryParams = [];

        if (typeof params === 'string') {
            if (params) queryParams.push(`name=${encodeURIComponent(params)}`);
        } else if (typeof params === 'object' && params !== null) {
            const { name, page, size } = params;
            if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
            if (page !== undefined && page !== null) queryParams.push(`page=${page}`);
            if (size !== undefined && size !== null) queryParams.push(`size=${size}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

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
    },
    // 직원 퇴사 처리
    quitEmployee: (id, leavingReason) => {
        return api.post(`/employees/quit/${id}`, { leavingReason });
    }
};