import axios from '../../../api/axios';

export const departmentService = {
    // 모든 부서 목록 조회
    getAllDepartments: () => axios.get('/admin/departments'),

    // 부서 상세 및 멤버 조회
    getDepartmentDetail: (id) => axios.get(`/admin/departments/${id}`),

    // 부서 생성
    createDepartment: (data) => axios.post('/admin/departments', data),

    // 부서 수정
    updateDepartment: (id, data) => axios.patch(`/admin/departments/${id}`, data),

    // 부서 삭제
    deleteDepartment: (id) => axios.delete(`/admin/departments/${id}`)
};