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
  }
};
