import axios from './axios';

export const creatorService = {
    // 크리에이터 상세 조회
    async getCreatorById(creatorId) {
        try {
            const response = await axios.get(`/creators/${creatorId}`);
            return response.data;
        } catch (error) {
            console.error('크리에이터 상세 조회 에러:', error);
            throw error;
        }
    },

    // 크리에이터 전체 목록 조회
    async getAllCreators(name = null) {
        try {
            const params = name ? { name } : {};
            const response = await axios.get('/creators', { params });
            return response.data;
        } catch (error) {
            console.error('크리에이터 목록 조회 에러:', error);
            throw error;
        }
    },

    // 매니저별 크리에이터 조회
    async getMyCreators(managerId) {
        try {
            const response = await axios.get(`/creators/manager/${managerId}`);
            return response.data;
        } catch (error) {
            console.error('매니저별 크리에이터 조회 에러:', error);
            throw error;
        }
    },

    // 크리에이터 등록
    async createCreator(request) {
        try {
            const response = await axios.post('/creators', request);
            return response.data;
        } catch (error) {
            console.error('크리에이터 등록 에러:', error);
            throw error;
        }
    },

    // 크리에이터 수정
    async updateCreator(creatorId, request) {
        try {
            const response = await axios.patch(`/creators/${creatorId}`, request);
            return response.data;
        } catch (error) {
            console.error('크리에이터 수정 에러:', error);
            throw error;
        }
    },

    // 크리에이터 삭제
    async deleteCreator(creatorId) {
        try {
            const response = await axios.delete(`/creators/${creatorId}`);
            return response.data;
        } catch (error) {
            console.error('크리에이터 삭제 에러:', error);
            throw error;
        }
    }
};
