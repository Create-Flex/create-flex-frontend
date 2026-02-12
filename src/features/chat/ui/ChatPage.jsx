import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';
import * as S from './Chat.styled';

export const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);

  // Mock initial data
  const chats = [
    { id: 1, name: '김철수', lastMessage: '알겠습니다!', timestamp: '오후 2:35', unread: 0, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: '이영희', lastMessage: '회의 자료 부탁드립니다.', timestamp: '오전 11:20', unread: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: '박민수', lastMessage: '점심 같이 드실래요?', timestamp: '오전 10:45', unread: 0, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: '정지원', lastMessage: '프로젝트 일정 공유합니다.', timestamp: '어제', unread: 0, avatar: 'https://i.pravatar.cc/150?u=4' },
  ];

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <S.ChatContainer>
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
      />
      <ChatRoom chat={selectedChat} />
    </S.ChatContainer>
  );
};
