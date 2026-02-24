import api from '../../../api/axios';

export const creatorService = {
  // 크리에이터 목록 조회 (전체 또는 이름 검색)
  getAllCreators: async (name = null, page = 0, size = 10) => {
    try {
      const params = { page, size };
      if (name) params.name = name;
      const response = await api.get('/creators', {
        params,
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });

      console.log('크리에이터 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('크리에이터 목록 조회 에러:', error);
      throw error;
    }
  },

  // 크리에이터 상세 조회
  getCreatorById: async (creatorId) => {
    try {
      const response = await api.get(`/creators/${creatorId}`, {
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });

      console.log('크리에이터 상세 조회 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('크리에이터 상세 조회 에러:', error);
      throw error;
    }
  },

  // 크리에이터 등록
  createCreator: async (creatorData) => {
    try {
      const response = await api.post('/creators', {
        member_name: creatorData.name,
        creator_platform: creatorData.platform.toUpperCase(),
        creator_subscribe: creatorData.subscribers,
        creator_category: creatorData.category,
        member_account: creatorData.loginId,
        member_password: creatorData.password,
        member_manager_id: creatorData.managerId || null,
        creator_status: mapStatusToBackend(creatorData.status),
        creator_main_contact: creatorData.contactInfo
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      console.log('크리에이터 등록 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('크리에이터 등록 에러:', error);
      throw error;
    }
  },

  // 크리에이터 정보 수정
  updateCreator: async (creatorId, creatorData) => {
    try {
      const requestBody = {};

      // 변경된 필드만 포함
      if (creatorData.name) requestBody.member_name = creatorData.name;
      if (creatorData.platform) requestBody.creator_platform = creatorData.platform.toUpperCase();
      if (creatorData.subscribers) requestBody.creator_subscribe = creatorData.subscribers;
      if (creatorData.category) requestBody.creator_category = creatorData.category;
      if (creatorData.loginId) requestBody.member_account = creatorData.loginId;
      if (creatorData.password) requestBody.member_password = creatorData.password;
      if (creatorData.managerId !== undefined) requestBody.member_manager_id = creatorData.managerId || null;
      if (creatorData.status) requestBody.creator_status = mapStatusToBackend(creatorData.status);
      if (creatorData.contactInfo) requestBody.creator_main_contact = creatorData.contactInfo;

      const response = await api.patch(`/creators/${creatorId}`, requestBody, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      console.log('크리에이터 수정 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('크리에이터 수정 에러:', error);
      throw error;
    }
  },

  // 크리에이터 삭제
  deleteCreator: async (creatorId) => {
    try {
      const response = await api.delete(`/creators/${creatorId}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      console.log('크리에이터 삭제 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('크리에이터 삭제 에러:', error);
      throw error;
    }
  },

  // 매니저별 크리에이터 조회
  getMyCreators: async (managerId) => {
    try {
      const response = await api.get(`/creators/manager/${managerId}`, {
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });

      console.log('담당 크리에이터 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('담당 크리에이터 목록 조회 에러:', error);
      throw error;
    }
  },
};

// 프론트엔드 상태를 백엔드 형식으로 변환
export const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    '활동중': 'ACTIVE',
    '은퇴': 'RETREAT',
    '휴식중': 'RESTING'
  };
  return statusMap[frontendStatus] || 'ACTIVE';
};