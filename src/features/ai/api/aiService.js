import api from '../../../api/axios';

export const aiService = {
    /**
     * AI 챗봇에게 메시지를 보내고 응답을 받습니다.
     * @param {string} message - 사용자 메시지
     * @returns {Promise<string>} AI 응답 텍스트
     */
    sendMessage: async (message) => {
        try {
            const response = await api.post('/ai/chat', { message }, { timeout: 60000 }); // 60초 타임아웃
            return response.data.reply;
        } catch (error) {
            console.error('AI 챗봇 에러:', error);
            throw error;
        }
    }
};
