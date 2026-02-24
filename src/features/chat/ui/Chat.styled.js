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

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: background-color 0.2s;

  &:hover {
      background-color: #f0f0f0;
      color: #333;
  }
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
  background-color: #f0f0f0;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #eee;
  color: #999;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

export const SystemMessage = styled.div`
  align-self: center;
  background-color: #e9ecef;
  color: #6c757d;
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 12px;
  margin: 10px 0;
  text-align: center;
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 420px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

export const ModalContent = styled.div`
  padding: 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const ModalSearchArea = styled.div`
  padding: 16px 24px 8px;
`;

export const UserList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
`;

export const UserItem = styled.div`
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  background-color: ${props => props.$isSelected ? '#f0f9f6' : 'transparent'};

  &:hover {
    background-color: ${props => props.$isSelected ? '#f0f9f6' : '#f8f9fa'};
  }
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #eee;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 2px;
`;

export const UserDetail = styled.div`
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CheckCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.$isSelected ? '#00C471' : '#ddd'};
  background-color: ${props => props.$isSelected ? '#00C471' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-left: 10px;

  &::after {
    content: '';
    display: block;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-top: -2px;
    opacity: ${props => props.$isSelected ? 1 : 0};
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.disabled ? '#e0e0e0' : '#00C471'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(0, 196, 113, 0.2)'};

  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#00a860'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ParticipantListPanel = styled.div`
  width: ${props => props.$isOpen ? '260px' : '0'};
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
`;

export const ParticipantHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ParticipantTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

export const ParticipantScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

export const ParticipantItem = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const ParticipantAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #eee;
  flex-shrink: 0;
  color: #999;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ParticipantName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
