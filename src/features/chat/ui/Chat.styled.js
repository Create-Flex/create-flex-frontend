import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: #f8f9fa;
  overflow: hidden;
`;

export const ChatSidebar = styled.div`
  width: 350px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

export const ChatSidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const SearchBar = styled.div`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    background-color: #ffffff;
    border-color: #00C471;
  }
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ChatListItem = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.$active ? '#eefbf4' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? '#00C471' : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$active ? '#eefbf4' : '#f9f9f9'};
  }
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 15px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LastMessage = styled.div`
  font-size: 0.85rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 10px;
`;

export const Time = styled.span`
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 6px;
`;

export const UnreadBadge = styled.span`
  background-color: #ff5252;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

export const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

export const ChatHeader = styled.div`
  padding: 15px 25px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const HeaderDetail = styled.span`
  font-size: 0.85rem;
  color: #888;
  margin-left: 10px;
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 25px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f8f9fa;
`;

export const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMine ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
`;

export const MessageBubble = styled.div`
  max-width: 65%;
  padding: 12px 16px;
  border-radius: 18px;
  border-top-left-radius: ${props => props.$isMine ? '18px' : '4px'};
  border-top-right-radius: ${props => props.$isMine ? '4px' : '18px'};
  background-color: ${props => props.$isMine ? '#00C471' : '#ffffff'};
  color: ${props => props.$isMine ? '#ffffff' : '#333'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  word-break: break-word;
`;

export const MessageTime = styled.span`
  font-size: 0.7rem;
  color: #aaa;
  margin-top: 4px;
  margin-left: ${props => props.$isMine ? '0' : '5px'};
  margin-right: ${props => props.$isMine ? '5px' : '0'};
`;

export const InputArea = styled.div`
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 24px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  max-width: 87%;
  margin: 0 auto;

  &:focus-within {
    border-color: #00C471;
    background-color: #fff;
  }
`;

export const MessageInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  font-size: 0.95rem;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

export const SendButton = styled.button`
  background-color: ${props => props.disabled ? '#e0e0e0' : '#00C471'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  margin-left: 10px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#00a860'};
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
  }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    
    svg {
        margin-bottom: 20px;
        color: #ddd;
    }
    
    p {
        font-size: 1.1rem;
    }
`;
