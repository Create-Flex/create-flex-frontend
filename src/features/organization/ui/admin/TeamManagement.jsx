import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Briefcase, X, User, Trash2, UserPlus, CheckCircle2, Monitor } from 'lucide-react';
import {
    Container, Header, SearchWrapper, SearchInput, SearchIconWrapper, TeamGrid, TeamCard, TeamCardHeader, IconBox, DeleteButton,
    TeamName, TeamDescription, TeamCardFooter, MemberCount, AvatarGroup, AvatarSmall, AvatarMore, AddTeamCard, AddTeamText, StyledPlusIcon,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalBodyGrid, LeftPanel, RightPanel,
    SectionTitle, FormField, FormLabel, FormInput, FormTextarea, TeamInfoSection, MemberList, MemberItem,
    MemberInfo, MemberAvatar, MemberDetails, MemberName, MemberSubText, IconButton, EmptyState,
    TabContainer, TabButton, AddMemberSearchWrapper, MemberListScrollable, ModalFooter, FooterButton
} from './TeamManagement.styled';
import { useEffect } from 'react';
import { teamService } from '../../api/teamService';
import { useEmployeeStore } from '../../../employee/model/useEmployeeStore';
import { useCreatorStore } from '../../../creator/model/useCreatorStore';

export const TeamManagement = () => {
    const { teams, fetchTeams, employees, fetchEmployees } = useEmployeeStore();
    const { creators, fetchCreators } = useCreatorStore();

    useEffect(() => {
        const initData = async () => {
            await Promise.all([
                fetchEmployees(),
                fetchCreators(),
                fetchTeams()
            ]);
        };
        initData();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [managingTeam, setManagingTeam] = useState(null);

    // Form States
    const [teamForm, setTeamForm] = useState({ name: '', description: '', memberIds: [] });
    const [addMemberSearch, setAddMemberSearch] = useState('');

    // Tab State for "Add Member" Pane
    const [activeAddTab, setActiveAddTab] = useState('employee');

    const filteredTeams = teams.filter(t =>
        (t.teamName?.includes(searchQuery)) ||
        (t.teamDescription?.includes(searchQuery))
    );

    // Combine employees and creators for selection logic reference
    const allMembers = [...employees, ...creators];

    const openModal = (team) => {
        if (team) {
            setManagingTeam(team);
            setTeamForm({
                name: team.teamName,
                description: team.teamDescription,
                // team.memberIds가 null/undefined일 경우를 대비해 빈 배열([]) 할당
                memberIds: Array.isArray(team.memberIds) ? [...team.memberIds] : []
            });
        } else {
            setManagingTeam(null);
            setTeamForm({ name: '', description: '', memberIds: [] });
        }
        setAddMemberSearch('');
        setActiveAddTab('employee'); // Default to employee tab
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!teamForm.name) return toast.error('팀 이름을 입력해주세요.');

        const teamData = {
            teamName: teamForm.name,
            teamDetail: teamForm.description,
            memberIds: teamForm.memberIds // 생성 시 멤버도 함께 전달
        };

        try {
            let teamId = managingTeam?.id;

            if (managingTeam) {
                // 기존 팀 정보 수정 (이름, 상세)
                await teamService.updateTeam(teamId, teamData);
                // 멤버 변경 사항 업데이트 (교체 방식)
                await teamService.updateTeamMembers(teamId, teamForm.memberIds);
            } else {
                // 새 팀 생성
                const response = await teamService.createTeam(teamData);
                teamId = response.data; // 이제 백엔드에서 ID를 반환함
            }

            toast.success('저장되었습니다.');
            fetchTeams(); // 목록 새로고침
            setIsModalOpen(false);
        } catch (error) {
            console.error('팀 저장 오류:', error);
            toast.error('팀 저장 중 오류가 발생했습니다.');
        }
    };

    // 팀 삭제 처리 핸들러
    const handleDeleteTeam = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('정말로 이 팀을 삭제하시겠습니까?')) {
            try {
                await teamService.deleteTeam(id); // 서버 삭제 요청
                toast.success('팀이 삭제되었습니다.');
                fetchTeams(); // 삭제 후 목록 다시 불러오기
            } catch (error) {
                toast.error('삭제에 실패했습니다. (소속 멤버가 있는지 확인해주세요)');
            }
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
        .map(id => allMembers.find(m => m.id == id)) // Use loose equality for safety
        .filter((m) => m !== undefined);

    // Separate lists for filtering
    const availableEmployees = employees.filter(e =>
        !teamForm.memberIds.some(mid => mid == e.id) && // Use some with loose equality
        ((e.name || '').includes(addMemberSearch) || (e.dept || '').includes(addMemberSearch) || (e.role || '').includes(addMemberSearch))
    );

    const availableCreators = creators.filter(c =>
        !teamForm.memberIds.some(mid => mid == c.id) && // Use some with loose equality
        ((c.name || '').includes(addMemberSearch) || (c.category || '').includes(addMemberSearch))
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
            return (member.name ? member.name[0] : '?');
        } else {
            return <Monitor size={14} color="#c084fc" />;
        }
    };

    const renderMemberItem = (member) => (
        <MemberItem
            key={member.id || `member-${member.name}-${Math.random()}`}
            $selectable
            onClick={() => addMember(member.id)}
        >
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
                    <TeamCard key={team.id || `temp-${team.teamName}`} onClick={() => openModal(team)}>
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
                        <TeamName>{team.teamName}</TeamName>
                        <TeamDescription>{team.teamDescription}</TeamDescription>
                        <TeamCardFooter>
                            <MemberCount>멤버 {team.memberIds?.length || 0}명</MemberCount>
                            <AvatarGroup>
                                {/* memberIds가 존재할 때만 slice를 실행하도록 수정 */}
                                {team.memberIds?.slice(0, 3).map(id => {
                                    const mem = allMembers.find(m => m.id == id);
                                    return (
                                        <AvatarSmall key={id}>
                                            {mem?.avatarUrl ? <img src={mem.avatarUrl} alt="" /> : (mem?.name ? mem.name[0] : '?')}
                                        </AvatarSmall>
                                    )
                                })}
                                {(team.memberIds?.length > 3) && <AvatarMore>+{team.memberIds.length - 3}</AvatarMore>}
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
                                        <MemberItem key={member.id || `current-${member.name}-${Math.random()}`}>
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