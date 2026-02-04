import api from './axios';

export const legalTaxService = {
  // 법률/세무 상담 신청 (크리에이터가 직접 또는 매니저가 대신)
  createRequest: async (requestData) => {
    try {
      const response = await api.post('/legaltax', {
        creator_id: requestData.creatorId,
        legal_tax_type: requestData.type.toUpperCase(), // 'LEGAL' or 'TAX'
        legal_tax_name: requestData.title,
        legal_tax_detail: requestData.content
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      return response.data;
    } catch (error) {
      console.error('법률/세무 상담 신청 에러:', error);
      throw error;
    }
  },

  // 전체 상담 신청 목록 조회 (관리자 전용)
  getAllRequests: async (type = null, status = null) => {
    try {
      const params = {};
      if (type) params.type = type.toUpperCase();
      if (status) params.status = status.toUpperCase();

      const response = await api.get('/legaltax/admin/all', {
        params,
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('전체 상담 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('전체 상담 목록 조회 에러:', error);
      throw error;
    }
  },

  // 내 담당 크리에이터의 상담 신청 목록 조회 (매니저 전용)
  getMyRequests: async (type = null, status = null) => {
    try {
      const params = {};
      if (type) params.type = type.toUpperCase();
      if (status) params.status = status.toUpperCase();

      const response = await api.get('/legaltax/my', {
        params,
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('내 담당 상담 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('내 담당 상담 목록 조회 에러:', error);
      throw error;
    }
  },

  // 상담 완료 처리 (관리자 전용)
  completeRequest: async (legalTaxId) => {
    try {
      const response = await api.patch(`/legaltax/${legalTaxId}/complete`, null, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('상담 완료 처리 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('상담 완료 처리 에러:', error);
      throw error;
    }
  },

  // 내가 담당하는 크리에이터 목록 조회 (매니저 전용)
  getMyCreators: async () => {
    try {
      const response = await api.get('/creators/my', {
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('내 담당 크리에이터 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('내 담당 크리에이터 목록 조회 에러:', error);
      throw error;
    }
  }
};