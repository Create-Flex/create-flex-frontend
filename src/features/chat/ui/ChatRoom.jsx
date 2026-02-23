import React, { useState, useRef, useEffect } from 'react';
import * as S from './Chat.styled';
import { Send, Edit2, Users, X } from 'lucide-react';
import { chatService } from '../api/ChatService';

export const ChatRoom = ({ chat, messages, onSendMessage, currentUserName, formatRoomName, onRefreshRooms }) => {
  const [inputValue, setInputValue] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chat) {
      setNewRoomName(chat.name || '');
    }
  }, [chat]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpdateName = async () => {
    if (!newRoomName.trim() || newRoomName === (chat?.name || '')) {
      setIsEditingName(false);
      return;
    }
    try {
      await chatService.updateRoomName(chat.roomId, newRoomName);
      setIsEditingName(false);
      onRefreshRooms();
    } catch (error) {
      console.error("이름 수정 실패", error);
      alert("이름 수정에 실패했습니다.");
    }
  };

  if (!chat) {
    return (
      <S.ChatMain>
        <S.EmptyState>
          <p>채팅방을 선택해주세요.</p>
        </S.EmptyState>
      </S.ChatMain>
    );
  }

  const displayName = formatRoomName ? formatRoomName(chat) : (chat.name || 'Room');

  return (
    <S.ChatMain style={{ flexDirection: 'row' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <S.ChatHeader>
          <S.HeaderInfo>
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <S.SearchInput
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onBlur={handleUpdateName}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
                  autoFocus
                  style={{ width: '200px', height: '32px' }}
                />
              </div>
            ) : (
              <>
                <S.HeaderName>{displayName}</S.HeaderName>
                <S.IconButton
                  onClick={() => setIsEditingName(true)}
                  title="이름 수정"
                  style={{ marginLeft: '8px' }}
                >
                  <Edit2 size={14} />
                </S.IconButton>
              </>
            )}
          </S.HeaderInfo>
          <S.IconButton
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            title="참여자 목록"
          >
            <Users size={20} />
          </S.IconButton>
        </S.ChatHeader>

        <S.MessageList>
          {messages && messages.map((msg, index) => {
            const isMine = msg.sender?.trim() === currentUserName?.trim();

            let timeString = '';
            if (msg.sendDate) {
              try {
                const date = new Date(msg.sendDate);
                timeString = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
              } catch (e) { }
            }

            if (msg.type === 'ENTER') return null;

            return (
              <S.MessageGroup key={index} $isMine={isMine}>
                {!isMine && <div style={{ fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>{msg.sender}</div>}
                <S.MessageBubble $isMine={isMine}>
                  {msg.message}
                </S.MessageBubble>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginLeft: '4px', marginRight: '4px' }}>
                  <S.MessageTime $isMine={isMine} style={{ display: 'flex', alignItems: 'center' }}>
                    {isMine && msg.unreadCount > 0 && (
                      <span style={{ color: '#fd7272', fontSize: '0.7rem', marginRight: '5px', fontWeight: 'bold' }}>
                        {msg.unreadCount}
                      </span>
                    )}
                    {timeString}
                    {!isMine && msg.unreadCount > 0 && (
                      <span style={{ color: '#fd7272', fontSize: '0.7rem', marginLeft: '5px', fontWeight: 'bold' }}>
                        {msg.unreadCount}
                      </span>
                    )}
                  </S.MessageTime>
                </div>
              </S.MessageGroup>
            );
          })}
          <div ref={messagesEndRef} />
        </S.MessageList>

        <S.InputArea>
          <S.InputWrapper>
            <S.MessageInput
              placeholder="메시지를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <S.SendButton onClick={handleSend} disabled={!inputValue.trim()}>
              <Send size={18} />
            </S.SendButton>
          </S.InputWrapper>
        </S.InputArea>
      </div>

      <S.ParticipantListPanel $isOpen={isParticipantsOpen}>
        <S.ParticipantHeader>
          <S.ParticipantTitle>참여자 ({chat.members?.length || 0})</S.ParticipantTitle>
          <S.IconButton onClick={() => setIsParticipantsOpen(false)}>
            <X size={18} />
          </S.IconButton>
        </S.ParticipantHeader>
        <S.ParticipantScrollArea>
          {chat.members?.map(member => (
            <S.ParticipantItem key={member.memberId}>
              <S.ParticipantAvatar>
                <Users size={16} />
              </S.ParticipantAvatar>
              <S.ParticipantName>{member.memberName}</S.ParticipantName>
            </S.ParticipantItem>
          ))}
        </S.ParticipantScrollArea>
      </S.ParticipantListPanel>
    </S.ChatMain>
  );
};
