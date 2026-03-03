import React, { useState, useEffect } from 'react';
import * as S from './Chat.styled';
import { Plus, X, Users, User } from 'lucide-react';
import { chatService } from '../api/ChatService';

export const ChatList = ({ chats, selectedChatId, onSelectChat, onCreateRoom, formatRoomName, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // 다중 선택을 위한 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      loadMembers();
      setSelectedMembers([]);
      setRoomName('');
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
    onCreateRoom(selectedMembers, roomName);
    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(m =>
    (m.memberName?.includes(searchTerm) || m.departmentName?.includes(searchTerm)) &&
    m.memberId !== currentUserId
  );

  // 유저 디폴트 프로필 저장 (2026.03.02 추가)
  const DEFAULT_AVATAR = 'https://i.postimg.cc/bJSGpBqg/Gemini-Generated-Image-s33rl9s33rl9s33r-(1).png';

  // 채팅방 이미지 렌더링 로직
  const renderChatAvatar = (chat) => {
    if (!chat.members || chat.members.length === 0) {
      return <S.Avatar><User size={24} /></S.Avatar>;
    }

    // 나를 제외한 다른 멤버들
    const otherMembers = chat.members.filter(m => m.memberId !== currentUserId);

    if (otherMembers.length === 0) {
      // 나 혼자 있는 방 (나와의 채팅 등)
      const myProfile = chat.members.find(m => m.memberId === currentUserId)?.profileImage;
      return (
        <S.Avatar>
          {myProfile ? <img src={myProfile} alt="Me" /> : <User size={24} />}
        </S.Avatar>
      );
    }

    if (otherMembers.length === 1) {
      // 1:1 채팅
      const targetMember = otherMembers[0];
      return (
        <S.Avatar>
          {targetMember.profileImage ? (
            <img src={targetMember.profileImage} alt={targetMember.memberName} />
          ) : (
            <User size={24} />
          )}
        </S.Avatar>
      );
    }

    // 단체 채팅 (3명 이상)
    return (
      <S.Avatar>
        <Users size={24} />
      </S.Avatar>
    );
  };

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
            {renderChatAvatar(chat)}
            <S.ChatInfo>
              {/* 포맷팅된 방 이름 사용 */}
              <S.ChatName>{formatRoomName(chat)}</S.ChatName>
              <S.LastMessage>메시지를 확인하세요</S.LastMessage>
            </S.ChatInfo>
          </S.ChatListItem>
        ))}
      </S.ChatList>

      {isModalOpen && (
        <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
          <S.ModalContainer onClick={e => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>새 채팅 시작</S.ModalTitle>
              <S.CloseButton onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </S.CloseButton>
            </S.ModalHeader>

            <S.ModalSearchArea>
              <S.SearchInput
                placeholder="이름 또는 부서 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </S.ModalSearchArea>


            <S.UserList>
              {filteredMembers.map(member => {
                const isSelected = selectedMembers.some(m => m.memberId === member.memberId);
                return (
                  <S.UserItem
                    key={member.memberId}
                    onClick={() => handleToggleMember(member)}
                    $isSelected={isSelected}
                  >
                    <S.UserAvatar>
                      {member.profileImage ? (
                        <img src={member.profileImage || DEFAULT_AVATAR} onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                      }}  alt={member.memberName} />
                      ) : (
                        <User size={20} />
                      )}
                    </S.UserAvatar>
                    <S.UserInfo>
                      <S.UserName>{member.memberName}</S.UserName>
                      <S.UserDetail>{member.departmentName} {member.task && `· ${member.task}`}</S.UserDetail>
                    </S.UserInfo>
                    <S.CheckCircle $isSelected={isSelected} />
                  </S.UserItem>
                );
              })}
            </S.UserList>

            <S.ModalFooter style={{ flexDirection: 'column', gap: '12px' }}>
              {selectedMembers.length > 0 && (
                <S.SearchInput
                  placeholder="채팅방 이름 (미지정 시 유저 이름으로 설정)"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  style={{ width: '100%', marginBottom: '4px' }}
                />
              )}
              <S.ActionButton
                onClick={handleCreateGroupChat}
                disabled={selectedMembers.length === 0}
                style={{ width: '100%' }}
              >
                {selectedMembers.length > 0 ? `${selectedMembers.length}명 초대하여 시작` : '대화상대 선택'}
              </S.ActionButton>
            </S.ModalFooter>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.ChatSidebar>
  );
};
