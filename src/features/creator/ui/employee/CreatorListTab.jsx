import React, { useState, useEffect } from 'react';
import {
    Users,
    User as UserIcon,
    ImageIcon,
    Monitor,
    Smartphone,
    ChevronLeft,
} from 'lucide-react';
import { renderPlatformIcon } from '../components/shared/utils';
import { creatorService } from '../../api/creatorService';
import { CreatorTodoBoard } from '../../../creator-todo/ui/CreatorTodoBoard';
import { useAuthStore } from '../../../auth/model/useAuthStore';
import { mapCreatorFromBackend } from '../../../../shared/utils/creatorMapper';
import {
    Container, DetailHeader, BackButton, BackText, CoverSection, CoverImageWrapper, CoverImg, EmptyCover, EmptyCoverText,
    AvatarSection, AvatarWrapper, AvatarImg, EmptyAvatar, InfoSection, CreatorName, MetaInfo, MetaItem, DotSeparator, StatusBadge, Divider,
    CreatorGrid, CreatorCard, CardCover, CardOverlay, CardContent, CardAvatar, CardInfo, CardName, CardSubscribers, CardStatus, CardStatusBadge
} from './CreatorListTab.styled';

const CreatorDetailView = ({
    creator,
    onBack,
}) => {
    return (
        <Container $bgWhite>
            <DetailHeader>
                <BackButton onClick={onBack}>
                    <ChevronLeft size={20} />
                    <BackText>목록으로 돌아가기</BackText>
                </BackButton>
            </DetailHeader>

            <CoverSection>
                <CoverImageWrapper>
                    {creator.coverUrl || creator.bannerUrl ? (
                        <CoverImg src={creator.coverUrl || creator.bannerUrl} alt="cover" />
                    ) : (
                        <EmptyCover>
                            <ImageIcon size={32} />
                            <EmptyCoverText>커버 이미지 없음</EmptyCoverText>
                        </EmptyCover>
                    )}
                </CoverImageWrapper>

                <AvatarSection>
                    <AvatarWrapper>
                        {creator.avatarUrl ? (
                            <AvatarImg src={creator.avatarUrl} alt="profile" />
                        ) : (
                            <EmptyAvatar>
                                <UserIcon size={40} />
                            </EmptyAvatar>
                        )}
                    </AvatarWrapper>
                </AvatarSection>
            </CoverSection>

            <InfoSection>
                <div>
                    <CreatorName>{creator.name}</CreatorName>
                    <MetaInfo>
                        <MetaItem><Monitor size={14} /> {creator.platform}</MetaItem>
                        <DotSeparator />
                        <MetaItem><Users size={14} /> {creator.subscribers}</MetaItem>
                        <DotSeparator />
                        <StatusBadge $active={creator.status === '활동중'}>
                            {creator.status}
                        </StatusBadge>
                        {creator.contactInfo && (
                            <>
                                <DotSeparator />
                                <MetaItem><Smartphone size={12} /> {creator.contactInfo}</MetaItem>
                            </>
                        )}
                    </MetaInfo>
                </div>
            </InfoSection>

            <Divider />

            <CreatorTodoBoard creatorId={creator.id} />
        </Container>
    );
};

export const CreatorListTab = ({
    onAddEvent,
    onEventClick,
}) => {
    const { user } = useAuthStore();
    const [myCreators, setMyCreators] = useState([]);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 백엔드에서 담당 크리에이터 목록 불러오기
    useEffect(() => {
        const fetchMyCreators = async () => {
            if (!user || !user.id) {
                setError('로그인 정보가 없습니다.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                console.log('매니저 ID:', user.id);

                // 백엔드 API 호출: GET /api/creators/manager/{managerId}
                const response = await creatorService.getMyCreators(user.id);

                console.log('백엔드 응답 (담당 크리에이터):', response);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                const formattedCreators = response.map(mapCreatorFromBackend);

                console.log('변환된 크리에이터 데이터:', formattedCreators);

                setMyCreators(formattedCreators);
            } catch (err) {
                console.error('담당 크리에이터 조회 실패:', err);

                if (err.response?.status === 404) {
                    setError('매니저 정보를 찾을 수 없습니다.');
                } else if (err.response?.status === 403) {
                    setError('크리에이터 목록 조회 권한이 없습니다.');
                } else {
                    setError(err.response?.data?.message || '크리에이터 목록을 불러오는데 실패했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyCreators();
    }, [user]);

    // 로딩 중 표시
    if (isLoading) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '16px',
                    color: '#6b7280'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <div>담당 크리에이터 목록을 불러오는 중...</div>
                    </div>
                </div>
            </Container>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    gap: '16px'
                }}>
                    <div style={{ fontSize: '48px' }}>⚠️</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '600' }}>
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </Container>
        );
    }

    // 담당 크리에이터가 없는 경우
    if (myCreators.length === 0) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '64px' }}>📋</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#374151' }}>
                        담당 크리에이터가 없습니다
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                        관리자에게 문의하여 크리에이터를 배정받으세요.
                    </div>
                </div>
            </Container>
        );
    }

    const selectedCreator = myCreators.find(c => c.id === selectedCreatorId);

    // 크리에이터 상세 보기
    if (selectedCreator) {
        return (
            <CreatorDetailView
                creator={selectedCreator}
                onBack={() => setSelectedCreatorId(null)}
            />
        );
    }

    // 크리에이터 목록 그리드 표시
    return (
        <Container>
            {/* 크리에이터 카드 그리드 */}
            <CreatorGrid>
                {myCreators.map(creator => (
                    <CreatorCard
                        key={creator.id}
                        onClick={() => setSelectedCreatorId(creator.id)}
                    >
                        <CardCover>
                            {creator.coverUrl || creator.bannerUrl ? (
                                <CoverImg src={creator.coverUrl || creator.bannerUrl} alt="cover" />
                            ) : (
                                <EmptyCover>
                                    <ImageIcon size={32} />
                                </EmptyCover>
                            )}
                            <CardOverlay />
                        </CardCover>
                        <CardContent>
                            <CardAvatar>
                                {creator.avatarUrl ? (
                                    <AvatarImg src={creator.avatarUrl} alt="avatar" />
                                ) : (
                                    <UserIcon size={32} />
                                )}
                            </CardAvatar>
                            <CardInfo>
                                <CardName>
                                    {creator.name}
                                    {renderPlatformIcon(creator.platform, 16)}
                                </CardName>
                                <CardSubscribers>{creator.subscribers}</CardSubscribers>
                                <CardStatus>
                                    <CardStatusBadge $active={creator.status === '활동중'}>
                                        {creator.status}
                                    </CardStatusBadge>
                                </CardStatus>
                            </CardInfo>
                        </CardContent>
                    </CreatorCard>
                ))}
            </CreatorGrid>
        </Container>
    );
};
