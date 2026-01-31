import React, { useEffect, useState } from 'react';
import { Megaphone, Plus, DollarSign, Ban, CheckCircle2, User as UserIcon } from 'lucide-react';
import { advertisementService } from '../../../api/AdvertisementService';
import { useAdvertisementStore } from '../../../stores/useAdvertisementStore';
import { mapAdvertisementFromBackend } from '../../../utils/advertisementMapper';
import {
    Container, Header, TitleSection, Title, SubTitle, Controls, FilterGroup, FilterButton,
    AddCampaignButton, GridContainer, AdCard, AdHeader, BrandName, RequestDate,
    CampaignTitle, CreatorInfo, AvatarWrapper, AvatarImg, CreatorText, CreatorName,
    SubscriberCount, AdDetails, DetailLabel, Budget, Description, TargetDate,
    ActionFooter, PendingActions, ActionStatusText, ButtonGroup, ActionButton,
    StatusBadge, EmptyState, EmptyTitle, EmptyText
} from './AdsTab.styled';

export const AdsTab = ({
    setIsAdModalOpen,
    creators,
    refreshTrigger,
}) => {
    const [adFilter, setAdFilter] = useState('all');
    const { advertisements, setAdvertisements, setLoading, setError, isLoading } = useAdvertisementStore();

    const fetchAdvertisements = async (filter) => {
        setLoading(true);
        setError(null);
        try {
            const backendFilter = filter === 'pending' ? 'waiting' : filter === 'history' ? 'processed' : 'all';
            const response = await advertisementService.getMyAdvertisements(backendFilter);
            
            console.log('받아온 광고 데이터:', response);
            
            const mappedAds = Array.isArray(response) ? response.map(mapAdvertisementFromBackend) : [];
            
            console.log('변환된 광고 데이터:', mappedAds);
            
            setAdvertisements(mappedAds);
        } catch (error) {
            console.error('광고 목록 조회 실패:', error);
            setError('광고 목록을 불러오는데 실패했습니다.');
            setAdvertisements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements(adFilter);
    }, [adFilter]);

    useEffect(() => {
        if (refreshTrigger) {
            fetchAdvertisements(adFilter);
        }
    }, [refreshTrigger]);

    const handleAdDecision = async (adId, decision) => {
        if (!confirm(`정말 이 광고를 ${decision === 'accepted' ? '수락' : '거절'}하시겠습니까?`)) {
            return;
        }

        try {
            const backendStatus = decision === 'accepted' ? 'ACCEPTED' : 'REJECTED';
            const response = await advertisementService.updateAdvertisementStatus(adId, backendStatus);
            
            alert(response.message || (decision === 'accepted' ? '광고가 수락되었습니다.' : '광고가 거절되었습니다.'));
            await fetchAdvertisements(adFilter);
        } catch (error) {
            alert(error.response?.data?.message || '광고 상태 변경에 실패했습니다.');
        }
    };

    const pendingCount = advertisements.filter(a => a.status === 'pending').length;

    if (isLoading) {
        return (
            <Container>
                <EmptyState>
                    <EmptyTitle>로딩 중...</EmptyTitle>
                    <EmptyText>광고 목록을 불러오고 있습니다.</EmptyText>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <TitleSection>
                    <Title>광고 캠페인 제안</Title>
                    <SubTitle>담당 크리에이터에게 들어온 광고 제안을 검토하고 연결해주세요.</SubTitle>
                </TitleSection>
                <Controls>
                    <FilterGroup>
                        <FilterButton onClick={() => setAdFilter('all')} $active={adFilter === 'all'}>
                            전체 보기
                        </FilterButton>
                        <FilterButton onClick={() => setAdFilter('pending')} $active={adFilter === 'pending'}>
                            대기중인 제안 ({pendingCount})
                        </FilterButton>
                        <FilterButton onClick={() => setAdFilter('history')} $active={adFilter === 'history'}>
                            처리 내역
                        </FilterButton>
                    </FilterGroup>
                    <AddCampaignButton onClick={() => setIsAdModalOpen(true)}>
                        <Plus size={14} /> 캠페인 등록
                    </AddCampaignButton>
                </Controls>
            </Header>

            {advertisements.length > 0 ? (
                <GridContainer>
                    {advertisements.map(ad => {
                        const creator = creators.find(c => c.id === String(ad.creatorId));
                        
                        return (
                            <AdCard key={ad.id}>
                                <AdHeader>
                                    <BrandName>{ad.brandName}</BrandName>
                                    <RequestDate>{ad.requestDate}</RequestDate>
                                </AdHeader>
                                <CampaignTitle>{ad.campaignTitle}</CampaignTitle>
                                <CreatorInfo>
                                    <AvatarWrapper>
                                        {creator?.avatarUrl ? (
                                            <AvatarImg src={creator.avatarUrl} alt="" />
                                        ) : (
                                            <UserIcon size={16} style={{ color: '#9ca3af' }} />
                                        )}
                                    </AvatarWrapper>
                                    <CreatorText>
                                        <CreatorName>{ad.creatorName || creator?.name || '알 수 없음'}</CreatorName>
                                        <SubscriberCount>구독자 {creator?.subscribers || 'N/A'}</SubscriberCount>
                                    </CreatorText>
                                </CreatorInfo>

                                <AdDetails>
                                    <DetailLabel>제안 금액</DetailLabel>
                                    <Budget>
                                        <DollarSign size={18} /> {Number(ad.budget).toLocaleString()}원
                                    </Budget>
                                    <Description>{ad.description}</Description>
                                    <TargetDate>목표 일정: {ad.targetDate || '미정'}</TargetDate>
                                </AdDetails>

                                <ActionFooter>
                                    {ad.status === 'pending' ? (
                                        <PendingActions>
                                            <ActionStatusText>제안 검토중</ActionStatusText>
                                            <ButtonGroup>
                                                <ActionButton $variant="reject" onClick={() => handleAdDecision(ad.id, 'rejected')}>
                                                    <Ban size={14} /> 거절
                                                </ActionButton>
                                                <ActionButton $variant="accept" onClick={() => handleAdDecision(ad.id, 'accepted')}>
                                                    <CheckCircle2 size={14} /> 수락
                                                </ActionButton>
                                            </ButtonGroup>
                                        </PendingActions>
                                    ) : (
                                        <StatusBadge $status={ad.status}>
                                            {ad.status === 'accepted' ? '수락됨' : '거절됨'}
                                        </StatusBadge>
                                    )}
                                </ActionFooter>
                            </AdCard>
                        );
                    })}
                </GridContainer>
            ) : (
                <EmptyState>
                    <Megaphone size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <EmptyTitle>해당하는 광고 제안이 없습니다.</EmptyTitle>
                    <EmptyText>새로운 제안이 들어오면 이곳에 표시됩니다.</EmptyText>
                </EmptyState>
            )}
        </Container>
    );
};