import React, { useState } from 'react';
import { Search, Plus, Briefcase, X, User, Trash2, UserPlus, CheckCircle2, Monitor } from 'lucide-react';
import {
    Container, Header, SearchWrapper, SearchInput, SearchIconWrapper, TeamGrid, TeamCard, TeamCardHeader, IconBox, DeleteButton,
    TeamName, TeamDescription, TeamCardFooter, MemberCount, AvatarGroup, AvatarSmall, AvatarMore, AddTeamCard, AddTeamText, StyledPlusIcon,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalBodyGrid, LeftPanel, RightPanel,
    SectionTitle, FormField, FormLabel, FormInput, FormTextarea, TeamInfoSection, MemberList, MemberItem,
    MemberInfo, MemberAvatar, MemberDetails, MemberName, MemberSubText, IconButton, EmptyState,
    TabContainer, TabButton, AddMemberSearchWrapper, MemberListScrollable, ModalFooter, FooterButton
} from './TeamManagement.styled';

export const TeamManagement = ({ teams, onUpdateTeams, employees, creators = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [managingTeam, setManagingTeam] = useState(null);

    // Form States
    const [teamForm, setTeamForm] = useState({ name: '', description: '', memberIds: [] });
    const [addMemberSearch, setAddMemberSearch] = useState('');

    // Tab State for "Add Member" Pane
    const [activeAddTab, setActiveAddTab] = useState('employee');

    const filteredTeams = teams.filter(t => t.name.includes(searchQuery) || t.description.includes(searchQuery));

    // Combine employees and creators for selection logic reference
    const allMembers = [...employees, ...creators];

    const openModal = (team) => {
        if (team) {
            setManagingTeam(team);
            setTeamForm({
                name: team.name,
                description: team.description,
                memberIds: [...team.memberIds]
            });
        } else {
            setManagingTeam(null);
            setTeamForm({ name: '', description: '', memberIds: [] });
        }
        setAddMemberSearch('');
        setActiveAddTab('employee'); // Default to employee tab
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!teamForm.name) return alert('팀 이름을 입력해주세요.');

        const updatedData = {
            name: teamForm.name,
            description: teamForm.description,
            memberIds: teamForm.memberIds
        };

        if (managingTeam) {
            onUpdateTeams(teams.map(t => t.id === managingTeam.id ? { ...t, ...updatedData } : t));
        } else {
            onUpdateTeams([...teams, { id: `t${Date.now()}`, ...updatedData }]);
        }
        setIsModalOpen(false);
    };

    // 팀 삭제 처리 핸들러
    const handleDeleteTeam = (e, id) => {
        e.stopPropagation(); // 카드 클릭 시 발생하는 모달 열림 방지
        if (window.confirm('정말로 이 팀을 삭제하시겠습니까?\n소속 멤버 정보는 삭제되지 않습니다.')) {
            onUpdateTeams(teams.filter(t => t.id !== id));
            alert('팀이 삭제되었습니다.');
        }
    };

    // Member Management Handlers
    const addMember = (id) => {
        if (!teamForm.memberIds.includes(id)) {
            setTeamForm(prev => ({ ...prev, memberIds: [...prev.memberIds, id] }));
        }
    };

    const removeMember = (id) => {
        setTeamForm(prev => ({ ...prev, memberIds: prev.memberIds.filter(mid => mid !== id) }));
    };

    // Derived Lists for Modal
    const currentMembers = teamForm.memberIds
        .map(id => allMembers.find(m => m.id === id))
        .filter((m) => m !== undefined);

    // Separate lists for filtering
    const availableEmployees = employees.filter(e =>
        !teamForm.memberIds.includes(e.id) &&
        (e.name.includes(addMemberSearch) || e.dept.includes(addMemberSearch) || e.role.includes(addMemberSearch))
    );

    const availableCreators = creators.filter(c =>
        !teamForm.memberIds.includes(c.id) &&
        (c.name.includes(addMemberSearch) || (c.category || '').includes(addMemberSearch))
    );

    const renderMemberInfo = (member) => {
        if ('dept' in member) {
            // It's an Employee
            return (
                <MemberDetails>
                    <MemberName>{member.name}</MemberName>
                    <MemberSubText>{member.dept} · {member.role}</MemberSubText>
                </MemberDetails>
            );
        } else {
            // It's a Creator
            return (
                <MemberDetails>
                    <MemberName>{member.name}</MemberName>
                    <MemberSubText>{member.platform} · {member.category}</MemberSubText>
                </MemberDetails>
            );
        }
    };

    const getMemberAvatar = (member) => {
        if (member.avatarUrl) {
            return <img src={member.avatarUrl} alt={member.name} />;
        }
        if ('dept' in member) {
            return member.name[0];
        } else {
            return <Monitor size={14} color="#c084fc" />;
        }
    };

    const renderMemberItem = (member) => (
        <MemberItem key={member.id} $selectable onClick={() => addMember(member.id)}>
            <MemberInfo>
                <MemberAvatar>
                    {getMemberAvatar(member)}
                </MemberAvatar>
                {renderMemberInfo(member)}
            </MemberInfo>
            <IconButton $add>
                <Plus size={16} />
            </IconButton>
        </MemberItem>
    );

    return (
        <Container>
            <Header>
                <SearchWrapper>
                    <SearchIconWrapper>
                        <Search size={14} />
                    </SearchIconWrapper>
                    <SearchInput
                        type="text"
                        placeholder="팀 이름 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchWrapper>
            </Header>

            <TeamGrid>
                {filteredTeams.map(team => (
                    <TeamCard key={team.id} onClick={() => openModal(team)}>
                        <TeamCardHeader>
                            <IconBox>
                                <Briefcase size={20} />
                            </IconBox>
                            <DeleteButton
                                onClick={(e) => handleDeleteTeam(e, team.id)}
                                title="팀 삭제"
                            >
                                <Trash2 size={18} />
                            </DeleteButton>
                        </TeamCardHeader>
                        <TeamName>{team.name}</TeamName>
                        <TeamDescription>{team.description}</TeamDescription>
                        <TeamCardFooter>
                            <MemberCount>멤버 {team.memberIds.length}명</MemberCount>
                            <AvatarGroup>
                                {team.memberIds.slice(0, 3).map(id => {
                                    const mem = allMembers.find(m => m.id === id);
                                    return (
                                        <AvatarSmall key={id}>
                                            {mem?.avatarUrl ? <img src={mem.avatarUrl} alt="" /> : mem?.name?.[0]}
                                        </AvatarSmall>
                                    )
                                })}
                                {team.memberIds.length > 3 && <AvatarMore>+{team.memberIds.length - 3}</AvatarMore>}
                            </AvatarGroup>
                        </TeamCardFooter>
                    </TeamCard>
                ))}
                <AddTeamCard onClick={() => openModal()}>
                    <StyledPlusIcon>
                        <Plus size={32} />
                    </StyledPlusIcon>
                    <AddTeamText>새 팀 추가</AddTeamText>
                </AddTeamCard>
            </TeamGrid>

            {isModalOpen && (
                <ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{managingTeam ? '팀 정보 및 멤버 관리' : '새 팀 생성'}</ModalTitle>
                            <CloseButton onClick={() => setIsModalOpen(false)}><X size={20} /></CloseButton>
                        </ModalHeader>

                        <ModalBodyGrid>
                            {/* Left: Team Info & Current Members */}
                            <LeftPanel>
                                <SectionTitle>
                                    <Briefcase size={14} /> 팀 기본 정보
                                </SectionTitle>
                                <TeamInfoSection>
                                    <FormField>
                                        <FormLabel>팀 이름</FormLabel>
                                        <FormInput
                                            value={teamForm.name}
                                            onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                                            placeholder="팀 이름을 입력하세요"
                                        />
                                    </FormField>
                                    <FormField>
                                        <FormLabel>팀 설명</FormLabel>
                                        <FormTextarea
                                            value={teamForm.description}
                                            onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                                            placeholder="팀에 대한 설명을 입력하세요"
                                        />
                                    </FormField>
                                </TeamInfoSection>

                                <SectionTitle>
                                    <User size={14} /> 현재 팀원 ({currentMembers.length})
                                </SectionTitle>
                                <MemberList>
                                    {currentMembers.length > 0 ? currentMembers.map(member => (
                                        <MemberItem key={member.id}>
                                            <MemberInfo>
                                                <MemberAvatar>
                                                    {getMemberAvatar(member)}
                                                </MemberAvatar>
                                                {renderMemberInfo(member)}
                                            </MemberInfo>
                                            <IconButton
                                                $delete
                                                onClick={() => removeMember(member.id)}
                                                title="팀에서 제외"
                                            >
                                                <Trash2 size={14} />
                                            </IconButton>
                                        </MemberItem>
                                    )) : (
                                        <EmptyState>
                                            등록된 팀원이 없습니다.
                                        </EmptyState>
                                    )}
                                </MemberList>
                            </LeftPanel>

                            {/* Right: Add Members (Tabs & Search) */}
                            <RightPanel>
                                <SectionTitle>
                                    <UserPlus size={14} /> 팀원 추가
                                </SectionTitle>

                                {/* Tabs */}
                                <TabContainer>
                                    <TabButton
                                        $active={activeAddTab === 'employee'}
                                        onClick={() => setActiveAddTab('employee')}
                                    >
                                        직원 ({availableEmployees.length})
                                    </TabButton>
                                    <TabButton
                                        $active={activeAddTab === 'creator'}
                                        onClick={() => setActiveAddTab('creator')}
                                    >
                                        크리에이터 ({availableCreators.length})
                                    </TabButton>
                                </TabContainer>

                                <AddMemberSearchWrapper>
                                    <SearchIconWrapper>
                                        <Search size={14} />
                                    </SearchIconWrapper>
                                    <SearchInput
                                        type="text"
                                        placeholder={activeAddTab === 'employee' ? "직원 이름, 부서 검색..." : "크리에이터 이름, 카테고리 검색..."}
                                        value={addMemberSearch}
                                        onChange={(e) => setAddMemberSearch(e.target.value)}
                                        style={{ width: '100%' }} // Override fixed width
                                    />
                                </AddMemberSearchWrapper>

                                <MemberListScrollable>
                                    {/* Employees Tab Content */}
                                    {activeAddTab === 'employee' && (
                                        availableEmployees.length > 0 ? (
                                            availableEmployees.map(member => renderMemberItem(member))
                                        ) : (
                                            <EmptyState $py8>
                                                {addMemberSearch ? '검색 결과가 없습니다.' : '추가 가능한 직원이 없습니다.'}
                                            </EmptyState>
                                        )
                                    )}

                                    {/* Creators Tab Content */}
                                    {activeAddTab === 'creator' && (
                                        availableCreators.length > 0 ? (
                                            availableCreators.map(member => renderMemberItem(member))
                                        ) : (
                                            <EmptyState $py8>
                                                {addMemberSearch ? '검색 결과가 없습니다.' : '추가 가능한 크리에이터가 없습니다.'}
                                            </EmptyState>
                                        )
                                    )}
                                </MemberListScrollable>
                            </RightPanel>
                        </ModalBodyGrid>

                        <ModalFooter>
                            <FooterButton onClick={() => setIsModalOpen(false)}>취소</FooterButton>
                            <FooterButton $primary onClick={handleSave}>
                                <CheckCircle2 size={16} /> 저장하기
                            </FooterButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
