import axios from 'axios';

// 기본 URL 설정 (백엔드 포트 확인 필요, 프록시 설정이 없다면 직접 지정)
const BASE_URL = 'http://localhost:8888';

// 토큰 가져오기 헬퍼
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const chatService = {
    // 채팅방 생성 (이름 + 참여자 ID 목록)
    createRoom: async (name, memberIds) => {
        const response = await axios.post(`${BASE_URL}/chat/room`, {
            name,
            memberIds
        }, getAuthHeaders());
        return response.data;
    },

    // 내 채팅방 목록 조회
    findAllRooms: async () => {
        const response = await axios.get(`${BASE_URL}/chat/rooms/my`, getAuthHeaders());
        return response.data;
    },

    // 특정 채팅방의 메시지 내역 조회
    getMessages: async (roomId) => {
        const response = await axios.get(`${BASE_URL}/chat/room/${roomId}/messages`, getAuthHeaders());
        return response.data;
    },

    // 모든 멤버 조회 (채팅방 생성 시 선택용 - /api/members/all 엔드포인트 사용)
    getAllMembers: async () => {
        const response = await axios.get(`${BASE_URL}/api/members/all`, getAuthHeaders());
        return response.data;
    },

    // 채팅방 이름 수정
    updateRoomName: async (roomId, name) => {
        const response = await axios.patch(`${BASE_URL}/chat/room/${roomId}/name`, {
            name
        }, getAuthHeaders());
        return response.data;
    },

    // 채팅방 나가기
    leaveRoom: async (roomId) => {
        const response = await axios.delete(`${BASE_URL}/chat/room/${roomId}/leave`, getAuthHeaders());
        return response.data;
    }
};