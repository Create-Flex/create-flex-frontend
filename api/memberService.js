import api from './axios';

export const memberService = {
  // 매니저 목록 조회
  getAllManagers: async () => {
    try {
      const response = await api.get('/members/managers', {
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('매니저 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('매니저 목록 조회 에러:', error);
      throw error;
    }
  }
};

// 백엔드 매니저 데이터를 프론트엔드 형식으로 변환
export const mapManagerFromBackend = (backendManager) => {
  const managerId = backendManager.manager_id ?? backendManager.managerId;
  const managerName = backendManager.manager_name ?? backendManager.managerName;
  const managerAccount = backendManager.manager_account ?? backendManager.managerAccount;
  const departmentName = backendManager.department_name ?? backendManager.departmentName;

  return {
    id: managerId,
    name: managerName,
    account: managerAccount,
    dept: departmentName || '부서 미지정',
    role: 'MANAGER'
  };
};