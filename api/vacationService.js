import api from './axios';

// 프론트엔드 휴가 유형 → 백엔드 enum 매핑
const VACATION_TYPE_MAP = {
  '연차': 'ANNUAL',
  '반차': 'HALF',
  '경조사': 'FAMILY',
  '병가': 'SICK',
  '워케이션': 'WORKATION'
};

export const vacationService = {
  // 휴가 신청
  createVacation: async (formData, memberId) => {
    try {
      const type = VACATION_TYPE_MAP[formData.type];

      // 공통 필드
      const requestBody = {
        memberId: memberId,
        vacationStart: formData.startDate,
        vacationEnd: formData.endDate,
        vacationDetail: formData.reason || ''
      };

      // 경조사 추가 필드
      if (type === 'FAMILY') {
        requestBody.familyRelation = formData.relationship || '';
        requestBody.familyDetail = formData.eventType || '';
      }

      // 병가 추가 필드
      if (type === 'SICK') {
        requestBody.sickDetail = formData.symptoms || '';
        requestBody.sickHospital = formData.hospital || '';
      }

      // 워케이션 추가 필드
      if (type === 'WORKATION') {
        requestBody.workationWhere = formData.location || '';
        requestBody.workationContact = formData.emergencyContact || '';
        requestBody.workationPlan = formData.workGoals || '';
        requestBody.workationHandover = formData.handover || '';
      }

      const response = await api.post(`/vacations?type=${type}`, requestBody);
      return response.data;
    } catch (error) {
      console.error('휴가 신청 에러:', error);
      throw error;
    }
  },

  // 내 휴가 목록 조회
  getMyVacations: async (memberId, filters = {}) => {
    try {
      const params = { memberId };

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = VACATION_TYPE_MAP[filters.type] || filters.type;

      const response = await api.get('/vacations/my', { params });
      return response.data;
    } catch (error) {
      console.error('휴가 목록 조회 에러:', error);
      throw error;
    }
  },

  // 휴가 상세 조회
  getVacationDetail: async (vacationId) => {
    try {
      const response = await api.get(`/vacations/my/${vacationId}`);
      return response.data;
    } catch (error) {
      console.error('휴가 상세 조회 에러:', error);
      throw error;
    }
  },

  // 잔여 연차 조회
  getMyVacationRemainder: async (memberId) => {
    try {
      const response = await api.get('/vacations/my/remainder', {
        params: { memberId }
      });
      return response.data;
    } catch (error) {
      console.error('잔여 연차 조회 에러:', error);
      throw error;
    }
  },

  // ==================== HR/관리자용 API ====================

  // HR 휴가 목록 조회 (전체 직원) - AdminVacationListResponseDTO
  getAllVacations: async (filters = {}) => {
    try {
      const params = {};

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = VACATION_TYPE_MAP[filters.type] || filters.type;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/admin/vacations', { params });
      return response.data;
    } catch (error) {
      console.error('HR 휴가 목록 조회 에러:', error);
      throw error;
    }
  },

  // HR 휴가 통계 조회
  getVacationStats: async () => {
    try {
      const response = await api.get('/admin/vacations/statistics');
      return response.data;
    } catch (error) {
      console.error('휴가 통계 조회 에러:', error);
      throw error;
    }
  },

  // 휴가 상세 조회 (관리자용) - VacationDetailResponseDTO
  getVacationDetailAdmin: async (vacationId) => {
    try {
      const response = await api.get(`/admin/vacations/${vacationId}`);
      return response.data;
    } catch (error) {
      console.error('휴가 상세 조회 에러:', error);
      throw error;
    }
  },

  // 휴가 승인
  approveVacation: async (vacationId) => {
    try {
      const response = await api.patch(`/admin/vacations/${vacationId}/approve`);
      return response.data;
    } catch (error) {
      console.error('휴가 승인 에러:', error);
      throw error;
    }
  },

  // 휴가 반려
  rejectVacation: async (vacationId, reason) => {
    try {
      const response = await api.patch(`/admin/vacations/${vacationId}/reject`, {
        rejectReason: reason
      });
      return response.data;
    } catch (error) {
      console.error('휴가 반려 에러:', error);
      throw error;
    }
  }
};
