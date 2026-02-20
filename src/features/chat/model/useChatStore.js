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

    // Initialize & Connect WebSocket
    connect: (token, userId) => {
        set({ currentUserId: userId }); // Always update userId

        if (get().stompClient && get().stompClient.active) return; // 이미 연결됨


        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8888/ws-stomp'),
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
    enterRoom: async (roomId) => {
        const { stompClient, isConnected } = get();

        //  상태 업데이트
        set({ selectedChatId: roomId });

        //  메시지 로드 (HTTP)
        await get().loadMessages(roomId);

        // 구독 설정 (이미 연결된 경우)
        if (stompClient && isConnected) {
            get().subscribeToRoom(roomId);
        }
    },

    loadMessages: async (roomId) => {
        try {
            const pastMessages = await chatService.getMessages(roomId);
            set({ messages: pastMessages });
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    },

    subscribeToRoom: (roomId) => {
        const { stompClient } = get();
        if (!stompClient || !stompClient.active) return;

    

        const currentSub = get().currentSubscription;
        if (currentSub) {
            currentSub.unsubscribe();
        }

        const subscription = stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
            const receivedMsg = JSON.parse(message.body);

            if (receivedMsg.type === 'READ') {
                const myId = get().currentUserId;
                if (String(receivedMsg.senderId) === String(myId)) {
                    return;
                }
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
    }

}));
