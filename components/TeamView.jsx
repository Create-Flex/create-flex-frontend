import React, { useState } from 'react';
import { ProfileView } from './ProfileView';
import * as S from './TeamView.styled';
import { Search, Users, Mail, Phone, MoreHorizontal, Hash, ChevronLeft, ArrowRight, Monitor } from 'lucide-react';

export const TeamView = ({ user, teams, employees, vacationLogs = [], creators = [] }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Find the team(s) the current user belongs to
    const myTeams = teams.filter(team => team.memberIds.includes(user.id));

    // Helper to convert Employee to UserProfile for display
    const mapEmployeeToProfile = (emp) => ({
        name: emp.name,
        engName: emp.engName,
        nickname: emp.nickname || emp.name,
        email: emp.email,
        personalEmail: emp.personalEmail || `${emp.id.toLowerCase()}@gmail.com`,
        phone: emp.phone,
        employeeId: emp.id,
        joinDate: emp.joinDate,
        tenure: '계산 필요',
        groupJoinDate: emp.joinDate,
        org: emp.dept,
        job: emp.role,
        rank: emp.rank || '직급 정보 없음',
        avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${emp.name}&background=random`,
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
        org: creator.platform, // Map Platform to Org
        job: creator.category || 'Creator', // Map Category to Job
        rank: 'Creator',
        avatarUrl: creator.avatarUrl || '',
        coverUrl: creator.coverUrl
    });

    // Level 3: Profile Detail
    if (selectedMember) {
        const isCreator = selectedMember.job === 'Creator' || selectedMember.rank === 'Creator';
        return (
            <ProfileView
                profile={selectedMember}
                onUpdateProfile={() => { }}
                readOnly={true}
                onBack={() => setSelectedMember(null)}
                vacationLogs={vacationLogs}
                isCreator={isCreator}
                hideVacationWidget={true}
                hideTasks={true} // Only hide tasks when viewing through Team Status
            />
        );
    }

    // Level 2: Team Members Detail
    if (selectedTeam) {
        const teamMemberIds = selectedTeam.memberIds;

        // Combine Employees and Creators
        const teamMembers = teamMemberIds.map(id => {
            const emp = employees.find(e => e.id === id);
            if (emp) return { ...emp, type: 'employee' };

            const creator = creators.find(c => c.id === id);
            if (creator) {
                // Normalize Creator to a shape similar to Employee for display
                return {
                    id: creator.id,
                    name: creator.name,
                    engName: '',
                    nickname: creator.name,
                    role: creator.category || 'Creator', // Display Category as Role
                    rank: creator.platform, // Display Platform as Rank
                    dept: 'MCN',
                    workStatus: creator.status === '활동중' ? '출근' : '퇴근', // Map Status
                    email: creator.contactInfo || '-',
                    phone: creator.contactInfo || '-',
                    avatarUrl: creator.avatarUrl,
                    coverUrl: creator.coverUrl,
                    type: 'creator'
                };
            }
            return null;
        }).filter((item) => item !== null);

        const filteredMembers = teamMembers.filter(member =>
            member.name.includes(searchQuery) ||
            member.role.includes(searchQuery) ||
            (member.nickname && member.nickname.includes(searchQuery))
        );

        const handleMemberClick = (member) => {
            if (member.type === 'creator') {
                // Find original creator object to map correctly
                const originalCreator = creators.find(c => c.id === member.id);
                if (originalCreator) setSelectedMember(mapCreatorToProfile(originalCreator));
            } else {
                // Find original employee object
                const originalEmp = employees.find(e => e.id === member.id);
                if (originalEmp) setSelectedMember(mapEmployeeToProfile(originalEmp));
            }
        };

        return (
            <S.Container>
                <S.ContentWrapper>
                    {/* Header */}
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
                            {/* Search */}
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

                    {/* Content: Card Grid only */}
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
                                                member.workStatus === '출근' || (member.type === 'creator' && member.workStatus === '활동중')
                                                    ? 'active'
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
                </S.ContentWrapper>
            </S.Container>
        );
    }

    // Level 1: Team List (Empty State or List)
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
