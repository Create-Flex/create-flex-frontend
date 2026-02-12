import api, { fileApi } from '../../../api/axios';
import axios from 'axios';

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
  },

  // 전체 직원 목록 조회
  getAllMembers: () => api.get('/employees/')
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

//프로필 파일 업로드
export const postMyProfile = (formData) => {
  return fileApi.post("/members/upload", formData);
};

export const putMyProfile = async (file, presignedUrl) => {
  return axios.put(presignedUrl, file, {
    headers: { 'Content-Type' : file.type}
  });
};

//프로필 파일 삭제
export const deleteMyProfile = () =>{
  return api.delete('/members/delete');
};

export const deleteMyProfileS3 = (presignedUrl) => {
  return axios.delete(presignedUrl);
}