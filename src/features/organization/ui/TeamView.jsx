import React, { useState, useEffect } from 'react';
//경로 변경: 같은 폴더가 아닌 employee 기능 폴더에서 가져옴
import { ProfileView } from '../../employee/ui/ProfileView'; 
import * as S from './TeamView.styled'; // 스타일 파일은 같은 폴더에 있음
import { Search, Users, ChevronLeft, ArrowRight, Monitor } from 'lucide-react';

//Store 경로 변경 (features 구조 반영)
import { useAuthStore } from '../../auth/model/useAuthStore';
import { useEmployeeStore } from '../../employee/model/useEmployeeStore';
import { useCreatorStore } from '../../creator/model/useCreatorStore';

//API 서비스 경로 변경 (features 구조 반영)
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

    // 내 팀 목록 불러오기 함수
    const loadMyTeams = async () => {
        try {
            const response = await teamService.getMyTeams();
            console.log('내 팀 목록 응답:', response.data);

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedTeams = response.data.map(team => ({
                id: team.teamId,
                name: team.teamName,
                description: team.teamDetail,
                members: team.teamMembers || [] // 팀원 상세 정보 리스트 보존
            }));

            setMyTeams(mappedTeams);
        } catch (error) {
            console.error('내 팀 목록 로드 실패:', error);
            setMyTeams([]);
        }
    };

    // Helper: 직원 정보를 프로필 뷰 형식으로 변환 (개인정보 마스킹 적용)
    const mapEmployeeToProfile = (emp, teamMemberInfo = null) => ({
        name: emp.name,
        engName: emp.engName,
        nickname: emp.nickname || emp.name,
        
        //개인정보 비공개 처리
        email: emp.email, // 사내 이메일은 표시
        personalEmail: '비공개', 
        phone: '비공개',
        
        employeeId: emp.id,
        joinDate: emp.joinDate,
        tenure: '계산 필요', // 필요 시 계산 로직 추가
        groupJoinDate: emp.joinDate,
        org: emp.dept,
        job: emp.role,
        rank: emp.rank || '직급 정보 없음',
        
        //팀 정보에 최신 이미지가 있다면 우선 사용
        avatarUrl: teamMemberInfo?.profileImageUrl || emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`,
        coverUrl: teamMemberInfo?.profileBannerUrl || emp.coverUrl
    });

    // Helper: 크리에이터 정보를 프로필 뷰 형식으로 변환 (개인정보 마스킹 적용)
    const mapCreatorToProfile = (creator, teamMemberInfo = null) => ({
        name: creator.name,
        engName: '',
        nickname: creator.name,
        
        //개인정보 비공개 처리
        email: '비공개',
        personalEmail: '비공개',
        phone: '비공개',
        
        employeeId: creator.id,
        joinDate: creator.managementStartDate || '-',
        tenure: '파트너',
        groupJoinDate: '-',
        org: creator.platform,
        job: creator.category || 'Creator',
        rank: 'Creator',
        
        //팀 정보에 최신 이미지가 있다면 우선 사용
        avatarUrl: teamMemberInfo?.profileImageUrl || creator.avatarUrl || '',
        coverUrl: teamMemberInfo?.profileBannerUrl || creator.coverUrl
    });

    // Level 3: Profile Detail (상세 프로필 보기)
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

    // Level 2: Team Members Detail (팀원 목록 보기)
    if (selectedTeam) {
        // 팀 멤버 데이터와 스토어 데이터 병합
        const teamMembersData = selectedTeam.members || [];

        const teamMembers = teamMembersData.map(teamMember => {
            const memberId = teamMember.memberId;
            
            // 직원 검색
            const emp = employees.find(e => e.id == memberId);
            if (emp) {
                return { 
                    ...emp, 
                    type: 'employee',
                    // 팀 데이터의 이미지/상태 우선 적용
                    avatarUrl: teamMember.profileImageUrl || emp.avatarUrl,
                    coverUrl: teamMember.profileBannerUrl || emp.coverUrl,
                    workStatus: teamMember.workStatus || '미출근',
                    task: teamMember.task || emp.role,
                    // 클릭 시 전달할 원본 팀 데이터 저장
                    _teamMemberInfo: teamMember
                };
            }

            // 크리에이터 검색
            const creator = creators.find(c => c.id == memberId);
            if (creator) {
                return {
                    id: creator.id,
                    name: creator.name,
                    engName: '',
                    nickname: creator.name,
                    role: creator.category || 'Creator',
                    rank: creator.platform,
                    dept: 'MCN',
                    workStatus: teamMember.workStatus || creator.status || '대기중',
                    email: '비공개',
                    phone: '비공개',
                    avatarUrl: teamMember.profileImageUrl || creator.avatarUrl,
                    coverUrl: teamMember.profileBannerUrl || creator.coverUrl,
                    type: 'creator',
                    _teamMemberInfo: teamMember
                };
            }
            return null;
        }).filter((item) => item !== null);

        // 검색 필터링
        const filteredMembers = teamMembers.filter(member =>
            (member.name || '').includes(searchQuery) ||
            (member.role || '').includes(searchQuery) ||
            (member.nickname && member.nickname.includes(searchQuery))
        );

        const handleMemberClick = (member) => {
            if (member.type === 'creator') {
                const originalCreator = creators.find(c => c.id === member.id);
                if (originalCreator) setSelectedMember(mapCreatorToProfile(originalCreator, member._teamMemberInfo));
            } else {
                const originalEmp = employees.find(e => e.id === member.id);
                if (originalEmp) setSelectedMember(mapEmployeeToProfile(originalEmp, member._teamMemberInfo));
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
                            <S.Title>{selectedTeam.name}</S.Title>
                            <S.SubTitle>{selectedTeam.description}</S.SubTitle>
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
                                                <S.Badge>{member.nickname || member.name}</S.Badge>
                                                <S.StatusBadge $type={
                                                    ['출근', '활동중', '근무중'].includes(member.workStatus) ? 'active' :
                                                    ['대기중', '휴식중', '휴가'].includes(member.workStatus) ? 'waiting' : 'inactive'
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

    // Level 1: Team List (팀 목록 보기)
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
                                        <S.CountText>{team.members.length}명</S.CountText>
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