import React, { useState, useRef, useEffect } from 'react';
import * as S from './Chat.styled';
import { Send, Smile, Paperclip } from 'lucide-react';

export const ChatRoom = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 요청하신 자료 보냈습니다.', isMine: false, time: '오후 2:30' },
    { id: 2, text: '네, 확인해보겠습니다. 감사합니다.', isMine: true, time: '오후 2:31' },
    { id: 3, text: '혹시 추가 자료 필요하시면 말씀해 주세요.', isMine: false, time: '오후 2:32' },
    { id: 4, text: '알겠습니다!', isMine: true, time: '오후 2:35' },
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    setMessages([...messages, {
      id: Date.now(),
      text: message,
      isMine: true,
      time: timeString
    }]);
    setMessage('');
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

  return (
    <S.ChatMain>
      <S.ChatHeader>
        <S.HeaderInfo>
          <S.HeaderName>{chat.name}</S.HeaderName>
          <S.HeaderDetail>{chat.department || '개발팀'}</S.HeaderDetail>
        </S.HeaderInfo>
      </S.ChatHeader>

      <S.MessageList>
        {messages.map((msg) => (
          <S.MessageGroup key={msg.id} $isMine={msg.isMine}>
            <S.MessageBubble $isMine={msg.isMine}>
              {msg.text}
            </S.MessageBubble>
            <S.MessageTime $isMine={msg.isMine}>{msg.time}</S.MessageTime>
          </S.MessageGroup>
        ))}
        <div ref={messagesEndRef} />
      </S.MessageList>

      <S.InputArea>
        <S.InputWrapper>
          <Paperclip size={20} color="#999" style={{ cursor: 'pointer', marginRight: '10px' }} />
          <S.MessageInput
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Smile size={20} color="#999" style={{ cursor: 'pointer', marginRight: '10px' }} />
          <S.SendButton onClick={handleSend} disabled={!message.trim()}>
            <Send size={18} />
          </S.SendButton>
        </S.InputWrapper>
      </S.InputArea>
    </S.ChatMain>
  );
};
