import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatService } from '../api/ChatService';

export const useChatStore = create((set, get) => ({
    chats: [],
    selectedChatId: null,
    messages: [],
    isConnected: false,
    stompClient: null,

    currentUserId: null,

    // Actions
    setChats: (chats) => set({ chats }),
    setSelectedChatId: (id) => set({ selectedChatId: id }),
    setMessages: (messages) => set({ messages }),

    // 웹소켓 연결 초기화
    connect: (token, userId) => {
        set({ currentUserId: userId });

        if (get().stompClient && get().stompClient.active) return; // 이미 연결됨

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
        const client = new Client({
            webSocketFactory: () => new SockJS(`${baseUrl}/ws-stomp`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Stomp Connected (Zustand)!');
                set({ isConnected: true });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });

        client.activate();
        set({ stompClient: client });
    },

    disconnect: () => {
        const client = get().stompClient;
        if (client) {
            client.deactivate();
        }
        set({ stompClient: null, isConnected: false });
    },

    // Load Chat Rooms
    loadRooms: async () => {
        try {
            const rooms = await chatService.findAllRooms();
            if (Array.isArray(rooms)) {
                set({ chats: rooms });
            }
        } catch (error) {
            console.error("Failed to load rooms:", error);
        }
    },

    // Create Room
    createRoom: async (roomName, memberIds) => {
        try {
            const newRoom = await chatService.createRoom(roomName, memberIds);
            set((state) => ({
                chats: [newRoom, ...state.chats],
                selectedChatId: newRoom.roomId
            }));
            return newRoom;
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    },

    // Select Room & Subscribe
    enterRoom: async (roomId, senderName) => {
        const { stompClient, isConnected } = get();

        //  상태 업데이트
        set({ selectedChatId: roomId });

        //  메시지 로드 (HTTP)
        await get().loadMessages(roomId);

        // 구독 설정 (이미 연결된 경우)
        if (stompClient && isConnected) {
            get().subscribeToRoom(roomId, senderName);
        }
    },

    loadMessages: async (roomId) => {
        try {
            const pastMessages = await chatService.getMessages(roomId);
            set({
                messages: pastMessages,
                hasMoreOlder: pastMessages.length >= 20
            });
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    },

    loadOlderMessages: async (roomId) => {
        const { messages, hasMoreOlder } = get();
        if (!hasMoreOlder || messages.length === 0) return;

        const firstMsg = messages[0];
        if (!firstMsg || !firstMsg.id) {
            console.warn("Missing first message ID for paging");
            return;
        }

        try {
            const olderMessages = await chatService.getOlderMessages(roomId, firstMsg.id);

            if (olderMessages.length > 0) {
                set((state) => ({
                    messages: [...olderMessages, ...state.messages],
                    hasMoreOlder: olderMessages.length >= 20
                }));
            } else {
                set({ hasMoreOlder: false });
            }
        } catch (error) {
            console.error("Failed to load older messages:", error);
        }
    },

    subscribeToRoom: (roomId, senderName) => {
        const { stompClient } = get();
        if (!stompClient || !stompClient.active) return;

        const currentSub = get().currentSubscription;
        if (currentSub) {
            currentSub.unsubscribe();
        }

        const subscription = stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
            const receivedMsg = JSON.parse(message.body);

            if (receivedMsg.type === 'READ') {
                // 메시지 목록 갱신을 통한 안읽은 숫자 업데이트
                get().loadMessages(roomId);
                return;
            }

            // 일반 메시지 처리
            if (!receivedMsg.sendDate) {
                receivedMsg.sendDate = new Date().toISOString();
            }

            set((state) => ({
                messages: [...state.messages, receivedMsg]
            }));
        });


        const enterMessage = {
            type: 'ENTER',
            roomId: roomId,
            sender: senderName,
            senderId: get().currentUserId,
            message: ''
        };

        stompClient.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify(enterMessage),
        });


        setTimeout(() => {
            get().loadMessages(roomId);
        }, 300);

        set({ currentSubscription: subscription });
    },

    sendMessage: (roomId, senderName, senderId, messageText) => {
        const { stompClient, isConnected } = get();
        if (!stompClient || !isConnected) return;

        const messageDto = {
            type: 'TALK',
            roomId: roomId,
            sender: senderName,
            senderId: senderId,
            message: messageText
        };

        stompClient.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify(messageDto),
        });
    },

    // Leave Room
    leaveRoom: async (roomId, senderName, senderId) => {
        const { stompClient, isConnected } = get();
        try {
            //  서버 DB에서 삭제 API 호출
            await chatService.leaveRoom(roomId);

            // 퇴장 메시지 발행 (EXIT 타입)
            if (stompClient && isConnected) {
                const exitMessage = {
                    type: 'EXIT',
                    roomId: roomId,
                    sender: senderName,
                    senderId: senderId,
                    message: `${senderName}님이 퇴장하셨습니다.`
                };
                stompClient.publish({
                    destination: '/pub/chat/message',
                    body: JSON.stringify(exitMessage),
                });
            }

            // 로컬 상태 업데이트
            set((state) => ({
                chats: state.chats.filter(c => c.roomId !== roomId),
                selectedChatId: state.selectedChatId === roomId ? null : state.selectedChatId,
                messages: state.selectedChatId === roomId ? [] : state.messages
            }));

        } catch (error) {
            console.error("Failed to leave room:", error);
            throw error;
        }
    }

}));
