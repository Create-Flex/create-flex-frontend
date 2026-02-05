import React, { useState, useEffect } from 'react';
import { ProfileView } from './ProfileView';
import * as S from './TeamView.styled';
import { Search, Users, ChevronLeft, ArrowRight, Monitor } from 'lucide-react';

import { useAuthStore } from '../stores/useAuthStore';
import { useEmployeeStore } from '../stores/useEmployeeStore';
import { useCreatorStore } from '../stores/useCreatorStore';
import { teamService } from '../api/teamService';

export const TeamView = () => {
    const { user } = useAuthStore();
    const { employees, fetchEmployees } = useEmployeeStore();
    const { creators, fetchCreators } = useCreatorStore();

    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [myTeams, setMyTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Safety check for user
    if (!user) return null;

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                // 병렬로 모든 데이터 로드
                await Promise.all([
                    fetchEmployees(),
                    fetchCreators && fetchCreators(),
                    loadMyTeams()
                ]);
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [fetchEmployees, fetchCreators]);

    // 내 팀 목록 불러오기 함수 분리
    const loadMyTeams = async () => {
        try {
            const response = await teamService.getMyTeams();
            console.log('내 팀 목록 응답:', response.data);

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedTeams = response.data.map(team => ({
                id: team.teamId,
                name: team.teamName,
                description: team.teamDetail,
                memberIds: team.teamMembers?.map(m => m.memberId) || []
            }));

            console.log('매핑된 팀 목록:', mappedTeams);
            setMyTeams(mappedTeams);
        } catch (error) {
            console.error('내 팀 목록 로드 실패:', error);
            setMyTeams([]);
        }
    };

    // Helper to convert Employee to UserProfile for display
    const mapEmployeeToProfile = (emp) => ({
        name: emp.name,
        engName: emp.engName,
        nickname: emp.nickname || emp.name,
        email: emp.email,
        personalEmail: emp.personalEmail || `${emp.id}@example.com`,
        phone: emp.phone,
        employeeId: emp.id,
        joinDate: emp.joinDate,
        tenure: '계산 필요',
        groupJoinDate: emp.joinDate,
        org: emp.dept,
        job: emp.role,
        rank: emp.rank || '직급 정보 없음',
        avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`,
        coverUrl: emp.coverUrl
    });

    // Helper to convert Creator to UserProfile for display
    const mapCreatorToProfile = (creator) => ({
        name: creator.name,
        engName: '',
        nickname: creator.name,
        email: creator.contactInfo || '-',
        personalEmail: `${creator.loginId || creator.name.toLowerCase()}@gmail.com`,
        phone: creator.contactInfo || '-',
        employeeId: creator.id,
        joinDate: creator.managementStartDate || '-',
        tenure: '파트너',
        groupJoinDate: '-',
        org: creator.platform,
        job: creator.category || 'Creator',
        rank: 'Creator',
        avatarUrl: creator.avatarUrl || '',
        coverUrl: creator.coverUrl
    });

    // Level 3: Profile Detail
    if (selectedMember) {
        return (
            <ProfileView
                profile={selectedMember}
                readOnly={true}
                onBack={() => setSelectedMember(null)}
                hideVacationWidget={true}
                hideTasks={true}
            />
        );
    }

    // Level 2: Team Members Detail
    if (selectedTeam) {
        const teamMemberIds = selectedTeam.memberIds;

        console.log('선택된 팀:', selectedTeam);
        console.log('팀 멤버 IDs:', teamMemberIds);
        console.log('전체 직원 목록:', employees);
        console.log('전체 크리에이터 목록:', creators);

        // Combine Employees and Creators
        const teamMembers = teamMemberIds.map(id => {
            const emp = employees.find(e => e.id == id);
            if (emp) {
                console.log(`직원 찾음: ${emp.name} (ID: ${id})`);
                return { ...emp, type: 'employee' };
            }

            const creator = creators.find(c => c.id == id);
            if (creator) {
                console.log(`크리에이터 찾음: ${creator.name} (ID: ${id})`);
                return {
                    id: creator.id,
                    name: creator.name,
                    engName: '',
                    nickname: creator.name,
                    role: creator.category || 'Creator',
                    rank: creator.platform,
                    dept: 'MCN',
                    workStatus: creator.status || '대기중',
                    email: creator.contactInfo || '-',
                    phone: creator.contactInfo || '-',
                    avatarUrl: creator.avatarUrl,
                    coverUrl: creator.coverUrl,
                    type: 'creator'
                };
            }

            console.warn(`멤버를 찾을 수 없음: ID ${id}`);
            return null;
        }).filter((item) => item !== null);

        console.log('팀 멤버 목록:', teamMembers);

        const filteredMembers = teamMembers.filter(member =>
            (member.name || '').includes(searchQuery) ||
            (member.role || '').includes(searchQuery) ||
            (member.nickname && member.nickname.includes(searchQuery))
        );

        const handleMemberClick = (member) => {
            if (member.type === 'creator') {
                const originalCreator = creators.find(c => c.id === member.id);
                if (originalCreator) setSelectedMember(mapCreatorToProfile(originalCreator));
            } else {
                const originalEmp = employees.find(e => e.id === member.id);
                if (originalEmp) setSelectedMember(mapEmployeeToProfile(originalEmp));
            }
        };

        return (
            <S.Container>
                <S.ContentWrapper>
                    <S.DetailHeader>
                        <div>
                            <S.BackButton onClick={() => { setSelectedTeam(null); setSearchQuery(''); }}>
                                <ChevronLeft size={16} />
                                <span>팀 목록으로 돌아가기</span>
                            </S.BackButton>
                            <S.Title>
                                {selectedTeam.name}
                            </S.Title>
                            <S.SubTitle>
                                {selectedTeam.description}
                            </S.SubTitle>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <S.SearchInputWrapper>
                                <S.SearchIconWrapper>
                                    <Search size={16} />
                                </S.SearchIconWrapper>
                                <S.SearchInput
                                    type="text"
                                    placeholder="이름, 직무 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </S.SearchInputWrapper>
                        </div>
                    </S.DetailHeader>

                    {filteredMembers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>팀원이 없거나 검색 결과가 없습니다.</p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                (전체 직원: {employees.length}명, 크리에이터: {creators.length}명)
                            </p>
                        </div>
                    ) : (
                        <S.MemberGrid>
                            {filteredMembers.map((member) => (
                                <S.MemberCard
                                    key={member.id}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    <S.CoverImage>
                                        {member.coverUrl ? (
                                            <img src={member.coverUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <S.CoverPlaceholder />
                                        )}
                                    </S.CoverImage>
                                    <S.MemberContent>
                                        <S.AvatarWrapper>
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <S.AvatarPlaceholder>
                                                    {member.name.charAt(0)}
                                                </S.AvatarPlaceholder>
                                            )}
                                        </S.AvatarWrapper>
                                        <div style={{ textAlign: 'center', width: '100%' }}>
                                            <S.MemberName>
                                                {member.name}
                                                {member.type === 'creator' && <Monitor size={14} color="#a855f7" />}
                                            </S.MemberName>
                                            <S.MemberRole>{member.role}</S.MemberRole>
                                            <S.BadgeContainer>
                                                <S.Badge>
                                                    {member.nickname || member.name}
                                                </S.Badge>
                                                <S.StatusBadge $type={
                                                    member.workStatus === '출근' || member.workStatus === '활동중'
                                                        ? 'active'
                                                        : member.workStatus === '대기중' || member.workStatus === '휴식중'
                                                            ? 'waiting'
                                                            : 'inactive'
                                                }>
                                                    {member.workStatus}
                                                </S.StatusBadge>
                                            </S.BadgeContainer>
                                        </div>
                                    </S.MemberContent>
                                </S.MemberCard>
                            ))}
                        </S.MemberGrid>
                    )}
                </S.ContentWrapper>
            </S.Container>
        );
    }

    // Level 1: Team List (Loading, Empty State, or List)
    if (isLoading) {
        return (
            <S.Container>
                <S.ContentWrapper>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>팀 정보를 불러오는 중...</p>
                    </div>
                </S.ContentWrapper>
            </S.Container>
        );
    }

    if (myTeams.length === 0) {
        return (
            <S.EmptyState>
                <S.EmptyContent>
                    <div style={{ marginBottom: '1rem' }}>
                        <Users size={48} color="#d1d5db" />
                    </div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem', color: '#374151' }}>
                        소속된 팀이 없습니다.
                    </h2>
                    <p style={{ fontSize: '0.875rem' }}>관리자에게 팀 배정을 요청해주세요.</p>
                </S.EmptyContent>
            </S.EmptyState>
        );
    }

    return (
        <S.Container>
            <S.ContentWrapper>
                <S.Header>
                    <S.Title>
                        <Users color="#1f2937" size={32} /> 팀 현황
                    </S.Title>
                    <S.SubTitle>
                        소속된 팀을 선택하여 구성원 정보를 확인하세요.
                    </S.SubTitle>
                </S.Header>

                <S.Grid>
                    {myTeams.map(team => (
                        <S.TeamCard
                            key={team.id}
                            onClick={() => setSelectedTeam(team)}
                        >
                            <S.CardBgIcon>
                                <Users size={64} />
                            </S.CardBgIcon>
                            <S.CardContent>
                                <S.IconWrapper>
                                    <Users size={24} />
                                </S.IconWrapper>
                                <S.CardTitle>{team.name}</S.CardTitle>
                                <S.CardDescription>{team.description}</S.CardDescription>

                                <S.CardFooter>
                                    <S.MemberCount>
                                        <Users size={16} color="#9ca3af" />
                                        <S.CountText>{team.memberIds.length}명</S.CountText>
                                    </S.MemberCount>
                                    <S.ViewAction>
                                        팀원 조회 <ArrowRight size={14} />
                                    </S.ViewAction>
                                </S.CardFooter>
                            </S.CardContent>
                        </S.TeamCard>
                    ))}
                </S.Grid>
            </S.ContentWrapper>
        </S.Container>
    );
};