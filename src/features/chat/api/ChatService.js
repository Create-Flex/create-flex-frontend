import axios from 'axios';
import { API_CONFIG } from '../../../api/config';

const BASE_URL = API_CONFIG.BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const chatService = {
    // 채팅방 생성
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

    // 모든 멤버 조회
    getAllMembers: async () => {
        const response = await axios.get(`${BASE_URL}/members/all`, getAuthHeaders());
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
    },

    // 이전 메시지 조회
    getOlderMessages: async (roomId, lastId, size = 20) => {
        const response = await axios.get(`${BASE_URL}/chat/room/${roomId}/messages/older`, {
            params: { lastId, size },
            ...getAuthHeaders()
        });
        return response.data;
    }
};