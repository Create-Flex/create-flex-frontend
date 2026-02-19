import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';
import * as S from './Chat.styled';
import { chatService } from '../api/ChatService';
import { useAuthStore } from '../../auth/model/useAuthStore';

export const ChatPage = () => {
  const { user, token } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Stomp Client Ref
  const stompClient = useRef(null);

  //  초기 채팅방 목록 로드
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const rooms = await chatService.findAllRooms();
      if (Array.isArray(rooms)) {
        setChats(rooms);
      } else {
        console.warn("채팅방 목록이 배열이 아닙니다:", rooms);
        setChats([]);
      }
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error);
      setChats([]);
    }
  };

  // WebSocket 연결 설정
  useEffect(() => {
    if (!token) return;

    const client = new Client({
      // brokerURL: 'ws://localhost:8888/ws-stomp', // SockJS 사용 시 brokerURL 대신 webSocketFactory 사용
      webSocketFactory: () => new SockJS('http://localhost:8888/ws-stomp'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.log('Stomp Connected!');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [token]);

  //  채팅방 선택 시 구독 및 메시지 로드
  useEffect(() => {
    if (!selectedChatId || !stompClient.current || !isConnected) return;

    // 이전 메시지 로드
    loadMessages(selectedChatId);

    // 구독 설정
    const subscription = stompClient.current.subscribe(`/sub/chat/room/${selectedChatId}`, (message) => {
      const receivedMsg = JSON.parse(message.body);

      if (!receivedMsg.sendDate) {
        receivedMsg.sendDate = new Date().toISOString();
      }
      setMessages(prev => [...prev, receivedMsg]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChatId, isConnected]);

  const loadMessages = async (roomId) => {
    try {
      const pastMessages = await chatService.getMessages(roomId);
      setMessages(pastMessages);
    } catch (error) {
      console.error("메시지 로드 실패:", error);
    }
  };

  const handleSendMessage = (messageText) => {
    if (!stompClient.current || !isConnected || !selectedChatId) return;

    const messageDto = {
      type: 'TALK',
      roomId: selectedChatId,
      sender: user?.memberName || user?.name,
      senderId : user?.memberId,
      message: messageText
    };

    stompClient.current.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(messageDto),
    });
  };

  const handleCreateRoom = async (selectedMembers) => {
    if (!user || selectedMembers.length === 0) return;

    // 내 이름(또는 닉네임) 가져오기
    const myName = user.memberName || user.name || 'Unknown';
    const myId = user.memberId || user.id;

    // 방 이름"
    const allNames = [myName, ...selectedMembers.map(m => m.memberName)];
    const roomName = allNames.join(',');

    // 참여자 ID 리스트
    const memberIds = [myId, ...selectedMembers.map(m => m.memberId)];

    try {

      const newRoom = await chatService.createRoom(roomName, memberIds);

      setChats(prev => [newRoom, ...prev]);
      setSelectedChatId(newRoom.roomId);
    } catch (error) {
      console.error("방 생성 실패:", error);
      alert("방 생성에 실패했습니다.");
    }
  };


  const formatRoomName = (chatOrName) => {
    const myName = user?.name || user?.memberName || 'Unknown';


    if (typeof chatOrName === 'object' && chatOrName.members) {
      const otherMembers = chatOrName.members.filter(m => m.memberName !== myName);
      if (otherMembers.length > 0) {
        return otherMembers.map(m => m.memberName).join(', ');
      }
      // 나 혼자면 그냥 방 이름 or 내 이름
      return chatOrName.name || myName;
    }

    const rawName = typeof chatOrName === 'string' ? chatOrName : chatOrName.name;

    if (!rawName) return "Room";
    if (rawName.includes(',')) {
      const names = rawName.split(',');
      const otherNames = names.filter(n => n.trim() !== myName);
      return otherNames.length > 0 ? otherNames.join(', ') : rawName;
    }
    return rawName;
  };

  const selectedChat = Array.isArray(chats) ? chats.find(chat => chat.roomId === selectedChatId) : null;

  return (
    <S.ChatContainer>
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        onCreateRoom={handleCreateRoom}
        formatRoomName={formatRoomName}
        currentUserId={user?.memberId || user?.id}
      />
      <ChatRoom
        chat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUserName={user?.memberName || user?.name}
        formatRoomName={formatRoomName}
      />
    </S.ChatContainer>
  );
};
