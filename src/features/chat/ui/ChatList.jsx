import React from 'react';
import * as S from './Chat.styled';

export const ChatList = ({ chats, selectedChatId, onSelectChat }) => {
  return (
    <S.ChatSidebar>
      <S.ChatSidebarHeader>
        <S.Title>채팅</S.Title>
      </S.ChatSidebarHeader>
      <S.SearchBar>
        <S.SearchInput placeholder="대화상대 검색" />
      </S.SearchBar>
      <S.ChatList>
        {chats.map(chat => (
          <S.ChatListItem
            key={chat.id}
            $active={selectedChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
          >
            <S.Avatar src={chat.avatar} />
            <S.ChatInfo>
              <S.ChatName>{chat.name}</S.ChatName>
              <S.LastMessage>{chat.lastMessage}</S.LastMessage>
            </S.ChatInfo>
            <S.ChatMeta>
              <S.Time>{chat.timestamp}</S.Time>
              {chat.unread > 0 && <S.UnreadBadge>{chat.unread}</S.UnreadBadge>}
            </S.ChatMeta>
          </S.ChatListItem>
        ))}
      </S.ChatList>
    </S.ChatSidebar>
  );
};
