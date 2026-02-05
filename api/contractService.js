import api from './axios';

/**
 * 계약 관련 API 서비스
 */
const contractService = {
    /**
     * 전체 계약 목록 조회
     */
    getAllContracts: async () => {
        const response = await api.get('/contracts');
        return response.data;
    },

    /**
     * 새 계약 등록
     */
    createContract: async (contractData) => {
        const response = await api.post('/contracts', contractData);
        return response.data;
    },
};

export default contractService;