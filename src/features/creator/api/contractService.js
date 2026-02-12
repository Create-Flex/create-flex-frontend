import api, { fileApi } from '../../../api/axios';
import axios from 'axios';

// 계약 관련 API 서비스
const contractService = {
    // 전체 계약 목록 조회 (또는 이름 검색)
    getAllContracts: async (name = null) => {
        const params = {};
        if (name) params.name = name;
        const response = await api.get('/contracts', { params });
        return response.data;
    },

    // 새 계약 등록
    createContract: async (contractData) => {
        const response = await fileApi.post('/contracts', contractData);
        return response.data;
    },

    // S3에 파일 직접 업로드 (Presigned URL 사용)
    uploadFileToS3: async (file, presignedUrl) => {
        if (!file || !presignedUrl) return null;

        return axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type
            }
        });
    }
};

export default contractService;