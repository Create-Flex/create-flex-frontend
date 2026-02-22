import React, { useState, useRef, useEffect } from 'react';
import * as S from './Chat.styled';
import { Send, Smile, Paperclip } from 'lucide-react';

export const ChatRoom = ({ chat, messages, onSendMessage, currentUserName, formatRoomName }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  if (!chat) {
    return (
      <S.ChatMain>
        <S.EmptyState>
          <p>채팅방을 선택해주세요.</p>
        </S.EmptyState>
      </S.ChatMain>
    );
  }

  // 이름 표시용 (방 이름 포맷팅)
  const displayName = formatRoomName ? formatRoomName(chat.name) : chat.name;

  return (
    <S.ChatMain>
      <S.ChatHeader>
        <S.HeaderInfo>
          <S.HeaderName>{displayName}</S.HeaderName>
        </S.HeaderInfo>
      </S.ChatHeader>

      <S.MessageList>
        {messages && messages.map((msg, index) => {

          const isMine = msg.sender?.trim() === currentUserName?.trim();

          // 시간 파싱 (2024-02-13T10:00:00 -> 오전 10:00)
          let timeString = '';
          if (msg.sendDate) {
            try {
              const date = new Date(msg.sendDate);
              timeString = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            } catch (e) { }
          }

          if (msg.type === 'ENTER') {
            return null;
          }

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
          <Paperclip size={20} color="#999" style={{ cursor: 'pointer', marginRight: '10px' }} />
          <S.MessageInput
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Smile size={20} color="#999" style={{ cursor: 'pointer', marginRight: '10px' }} />
          <S.SendButton onClick={handleSend} disabled={!inputValue.trim()}>
            <Send size={18} />
          </S.SendButton>
        </S.InputWrapper>
      </S.InputArea>
    </S.ChatMain>
  );
};
