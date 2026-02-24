import React, { useEffect } from 'react';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';
import * as S from './Chat.styled';
import { useAuthStore } from '../../auth/model/useAuthStore';
import { useChatStore } from '../model/useChatStore';

export const ChatPage = () => {
  const { user, token } = useAuthStore();
  const {
    chats, selectedChatId, messages,
    connect, disconnect, loadRooms, enterRoom, createRoom, sendMessage,
    setSelectedChatId
  } = useChatStore();

  //  초기 연결 및 방 목록 로드
  useEffect(() => {
    if (token && user) {
      connect(token, user.memberId || user.id);
      loadRooms();
    }
    return () => {

    };
  }, [token, user, connect, loadRooms]);

  // 방 선택 변경 시 진입 처리
  useEffect(() => {
    if (selectedChatId && user) {
      const userName = user.memberName || user.name || 'Unknown';
      enterRoom(selectedChatId, userName);
    }
  }, [selectedChatId, user, enterRoom]);

  const handleCreateRoom = async (selectedMembers, customRoomName) => {
    if (!user || selectedMembers.length === 0) return;

    const myName = user.memberName || user.name || 'Unknown';
    const myId = user.memberId || user.id;

    // 방 이름 결정
    let roomName = customRoomName;
    if (!roomName || roomName.trim() === '') {
      const allNames = [myName, ...selectedMembers.map(m => m.memberName)];
      roomName = allNames.join(',');
    }

    // 참여자 ID 리스트
    const memberIds = [myId, ...selectedMembers.map(m => m.memberId)];

    await createRoom(roomName, memberIds);
  };

  const handleSendMessage = (messageText) => {
    if (!selectedChatId) return;
    sendMessage(
      selectedChatId,
      user?.memberName || user?.name,
      user?.memberId,
      messageText
    );
  };

  const handleLeaveRoom = async (roomId) => {
    if (!window.confirm("정말 이 채팅방을 나가시겠습니까? 나가면 대화 내용이 모두 삭제되고 목록에서 사라집니다.")) return;

    try {
      const { leaveRoom } = useChatStore.getState();
      await leaveRoom(roomId, user?.memberName || user?.name, user?.memberId || user?.id);
    } catch (error) {
      alert("방 나가기에 실패했습니다.");
    }
  };

  const formatRoomName = (chatOrName) => {
    const myName = user?.name || user?.memberName || 'Unknown';

    if (typeof chatOrName === 'object' && chatOrName !== null) {
      const dbName = chatOrName.name;

      if (!dbName) return "Room";

      if (dbName.includes(',')) {
        const names = dbName.split(',').map(n => n.trim());
        if (names.includes(myName)) {
          const otherNames = names.filter(n => n !== myName);
          return otherNames.length > 0 ? otherNames.join(', ') : dbName;
        }
      }

      return dbName;
    }

    const rawName = typeof chatOrName === 'string' ? chatOrName : 'Room';
    if (rawName.includes(',')) {
      const names = rawName.split(',').map(n => n.trim());
      const otherNames = names.filter(n => n !== myName);
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
        onRefreshRooms={loadRooms}
        onLeaveRoom={() => handleLeaveRoom(selectedChatId)}
      />
    </S.ChatContainer>
  );
};
