import React, { useState, useEffect } from 'react';
import * as S from './Chat.styled';
import { Plus, X } from 'lucide-react';
import { chatService } from '../api/ChatService';

// 간단한 모달 스타일 
const ModalOverlay = ({ children, onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '8px', width: '400px',
        maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {children}
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} onClick={onClose} />
    </div>
  );
};

export const ChatList = ({ chats, selectedChatId, onSelectChat, onCreateRoom, formatRoomName, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // 다중 선택을 위한 상태
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      loadMembers();
      setSelectedMembers([]);
    }
  }, [isModalOpen]);

  const loadMembers = async () => {
    try {
      const allMembers = await chatService.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error("멤버 목록 로드 실패", error);
    }
  };

  const handleToggleMember = (member) => {
    if (selectedMembers.find(m => m.memberId === member.memberId)) {
      setSelectedMembers(selectedMembers.filter(m => m.memberId !== member.memberId));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleCreateGroupChat = () => {
    if (selectedMembers.length === 0) return;
    onCreateRoom(selectedMembers);
    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(m =>
    (m.memberName?.includes(searchTerm) || m.departmentName?.includes(searchTerm)) &&
    m.memberId !== currentUserId
  );

  return (
    <S.ChatSidebar>
      <S.ChatSidebarHeader>
        <S.Title>채팅</S.Title>
        <S.IconButton onClick={() => setIsModalOpen(true)} title="새 채팅">
          <Plus size={20} />
        </S.IconButton>
      </S.ChatSidebarHeader>
      <S.SearchBar>
        <S.SearchInput placeholder="대화상대 검색" />
      </S.SearchBar>
      <S.ChatList>
        {chats.map(chat => (
          <S.ChatListItem
            key={chat.roomId}
            $active={selectedChatId === chat.roomId}
            onClick={() => onSelectChat(chat.roomId)}
          >
            <S.Avatar />
            <S.ChatInfo>
              {/* 포맷팅된 방 이름 사용 */}
              <S.ChatName>{formatRoomName(chat)}</S.ChatName>
              <S.LastMessage>메시지를 확인하세요</S.LastMessage>
            </S.ChatInfo>
          </S.ChatListItem>
        ))}
      </S.ChatList>

      {isModalOpen && (
        <ModalOverlay onClose={() => setIsModalOpen(false)}>
          <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>새 채팅 시작</h3>
            <div onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}><X size={20} /></div>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="이름 또는 부서 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
            {filteredMembers.map(member => {
              const isSelected = selectedMembers.some(m => m.memberId === member.memberId);
              return (
                <div
                  key={member.memberId}
                  onClick={() => handleToggleMember(member)}
                  style={{
                    padding: '10px', borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    backgroundColor: isSelected ? '#e6f7ff' : 'transparent' // 선택 시 배경색 변경
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', marginRight: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isSelected ? '#1890ff' : 'white'
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee', marginRight: '10px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{member.memberName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{member.departmentName} {member.task && `· ${member.task}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCreateGroupChat}
              disabled={selectedMembers.length === 0}
              style={{
                padding: '8px 16px', backgroundColor: selectedMembers.length > 0 ? '#00C471' : '#ccc', color: 'white',
                border: 'none', borderRadius: '4px', cursor: selectedMembers.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              {selectedMembers.length}명 초대하여 시작
            </button>
          </div>
        </ModalOverlay>
      )}
    </S.ChatSidebar>
  );
};
