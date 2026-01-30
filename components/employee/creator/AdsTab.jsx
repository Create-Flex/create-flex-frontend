import React from 'react';
import { Megaphone, Plus, DollarSign, Ban, CheckCircle2, User as UserIcon } from 'lucide-react';
import {
    Container, Header, TitleSection, Title, SubTitle, Controls, FilterGroup, FilterButton,
    AddCampaignButton, GridContainer, AdCard, AdHeader, BrandName, RequestDate,
    CampaignTitle, CreatorInfo, AvatarWrapper, AvatarImg, CreatorText, CreatorName,
    SubscriberCount, AdDetails, DetailLabel, Budget, Description, TargetDate,
    ActionFooter, PendingActions, ActionStatusText, ButtonGroup, ActionButton,
    StatusBadge, EmptyState, EmptyTitle, EmptyText
} from './AdsTab.styled';

export const AdsTab = ({
    filteredAds,
    adFilter,
    setAdFilter,
    myAdProposals,
    onAdDecision,
    setIsAdModalOpen,
    creators,
}) => {
    return (
        <Container>
            <Header>
                <TitleSection>
                    <Title>광고 캠페인 제안</Title>
                    <SubTitle>담당 크리에이터에게 들어온 광고 제안을 검토하고 연결해주세요.</SubTitle>
                </TitleSection>
                <Controls>
                    <FilterGroup>
                        <FilterButton
                            onClick={() => setAdFilter('all')}
                            $active={adFilter === 'all'}
                        >
                            전체 보기
                        </FilterButton>
                        <FilterButton
                            onClick={() => setAdFilter('pending')}
                            $active={adFilter === 'pending'}
                        >
                            대기중인 제안 ({myAdProposals.filter(a => a.status === 'pending').length})
                        </FilterButton>
                        <FilterButton
                            onClick={() => setAdFilter('history')}
                            $active={adFilter === 'history'}
                        >
                            처리 내역
                        </FilterButton>
                    </FilterGroup>
                    <AddCampaignButton onClick={() => setIsAdModalOpen(true)}>
                        <Plus size={14} /> 캠페인 등록
                    </AddCampaignButton>
                </Controls>
            </Header>

            {filteredAds.length > 0 ? (
                <GridContainer>
                    {filteredAds.map(ad => {
                        const creator = creators.find(c => c.id === ad.creatorId);
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
                                            <UserIcon size={16} className="text-gray-400" />
                                        )}
                                    </AvatarWrapper>
                                    <CreatorText>
                                        <CreatorName>{creator?.name || '알 수 없음'}</CreatorName>
                                        <SubscriberCount>구독자 {creator?.subscribers}</SubscriberCount>
                                    </CreatorText>
                                </CreatorInfo>

                                <AdDetails>
                                    <DetailLabel>제안 금액</DetailLabel>
                                    <Budget>
                                        <DollarSign size={18} /> {ad.budget}
                                    </Budget>
                                    <Description>{ad.description}</Description>
                                    <TargetDate>목표 일정: {ad.targetDate || '미정'}</TargetDate>
                                </AdDetails>

                                <ActionFooter>
                                    {ad.status === 'pending' ? (
                                        <PendingActions>
                                            <ActionStatusText>제안 검토중</ActionStatusText>
                                            <ButtonGroup>
                                                <ActionButton
                                                    $variant="reject"
                                                    onClick={() => onAdDecision(ad.id, 'rejected')}
                                                >
                                                    <Ban size={14} /> 거절
                                                </ActionButton>
                                                <ActionButton
                                                    $variant="accept"
                                                    onClick={() => onAdDecision(ad.id, 'accepted')}
                                                >
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
                    <Megaphone size={48} className="mb-4 opacity-50" />
                    <EmptyTitle>해당하는 광고 제안이 없습니다.</EmptyTitle>
                    <EmptyText>새로운 제안이 들어오면 이곳에 표시됩니다.</EmptyText>
                </EmptyState>
            )}
        </Container>
    );
};
