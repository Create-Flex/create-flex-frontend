import api from './axios';

export const advertisementService = {
  // 광고 캠페인 등록
  createAdvertisement: async (advertisementData) => {
    try {
      const response = await api.post('/advertisements', {
        creator_id: advertisementData.creatorId,
        promotion_client: advertisementData.brandName,
        promotion_name: advertisementData.campaignTitle,
        promotion_fee: advertisementData.budget,
        promotion_detail: advertisementData.description,
        promotion_target_date: advertisementData.targetDate
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      return response.data;
    } catch (error) {
      console.error('광고 캠페인 등록 에러:', error);
      throw error;
    }
  },

  // 내 담당 크리에이터의 광고 캠페인 목록 조회
  getMyAdvertisements: async (filter = 'all') => {
    try {
      const response = await api.get('/advertisements', {
        params: { filter },
        headers: {
          'Accept': 'application/json; charset=UTF-8'
        }
      });
      
      // 응답 데이터 로깅
      console.log('광고 목록 응답:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('광고 캠페인 목록 조회 에러:', error);
      throw error;
    }
  },

  // 광고 캠페인 상태 변경 (수락/거절)
  updateAdvertisementStatus: async (advertisementId, status) => {
    try {
      const response = await api.patch(`/advertisements/${advertisementId}`, null, {
        params: { status },
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      
      console.log('상태 변경 응답:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('광고 캠페인 상태 변경 에러:', error);
      throw error;
    }
  }
};