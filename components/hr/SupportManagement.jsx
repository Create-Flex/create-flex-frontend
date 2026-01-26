import React, { useState } from 'react';
import { Scale, FileSpreadsheet, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import {
    Container, FilterBar, FilterGroup, TypeFilterButton, StatusFilterButton,
    RequestList, RequestCard, IconBox, ContentWrapper, CardHeader, HeaderLeft, TypeBadge, DateText,
    HeaderRight, CreatorName, StatusBadge, Title, ContentBox, ActionButtons, ActionButton, EmptyState
} from './SupportManagement.styled';

export const SupportManagement = ({ requests, onUpdateRequest }) => {
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    const filteredRequests = requests.filter(req => {
        if (filter !== 'all' && req.type !== filter) return false;
        if (statusFilter === 'active' && req.status === '완료') return false;
        if (statusFilter === 'completed' && req.status !== '완료') return false;
        return true;
    });

    const handleStatusChange = (id, newStatus) => {
        onUpdateRequest(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    return (
        <Container>
            {/* Filter Bar */}
            <FilterBar>
                <FilterGroup>
                    <TypeFilterButton $type="all" $active={filter === 'all'} onClick={() => setFilter('all')}>전체</TypeFilterButton>
                    <TypeFilterButton $type="legal" $active={filter === 'legal'} onClick={() => setFilter('legal')}>법률</TypeFilterButton>
                    <TypeFilterButton $type="tax" $active={filter === 'tax'} onClick={() => setFilter('tax')}>세무</TypeFilterButton>
                </FilterGroup>
                <FilterGroup>
                    <StatusFilterButton $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>전체보기</StatusFilterButton>
                    <StatusFilterButton $active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>진행중</StatusFilterButton>
                    <StatusFilterButton $active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')}>완료됨</StatusFilterButton>
                </FilterGroup>
            </FilterBar>

            {/* List */}
            <RequestList>
                {filteredRequests.length > 0 ? filteredRequests.map(req => (
                    <RequestCard key={req.id}>
                        <IconBox $type={req.type}>
                            {req.type === 'legal' ? <Scale size={24} /> : <FileSpreadsheet size={24} />}
                        </IconBox>
                        <ContentWrapper>
                            <CardHeader>
                                <HeaderLeft>
                                    <TypeBadge $type={req.type}>
                                        {req.type === 'legal' ? 'LEGAL' : 'TAX'}
                                    </TypeBadge>
                                    <DateText>{req.requestDate}</DateText>
                                </HeaderLeft>
                                <HeaderRight>
                                    <CreatorName>{req.creatorName}</CreatorName>
                                    <StatusBadge $status={req.status}>
                                        {req.status === '접수' && '접수됨'}
                                        {req.status === '진행중' && <><Clock size={10} /> 진행중</>}
                                        {req.status === '완료' && <><CheckCircle2 size={10} /> 완료됨</>}
                                    </StatusBadge>
                                </HeaderRight>
                            </CardHeader>
                            <Title>{req.title}</Title>
                            <ContentBox>{req.content}</ContentBox>

                            {req.status !== '완료' && (
                                <ActionButtons>
                                    {req.status === '접수' && (
                                        <ActionButton
                                            $primary
                                            onClick={() => handleStatusChange(req.id, '진행중')}
                                        >
                                            진행 처리
                                        </ActionButton>
                                    )}
                                    <ActionButton
                                        onClick={() => handleStatusChange(req.id, '완료')}
                                    >
                                        <CheckSquare size={12} /> 완료 처리
                                    </ActionButton>
                                </ActionButtons>
                            )}
                        </ContentWrapper>
                    </RequestCard>
                )) : (
                    <EmptyState>
                        해당하는 요청 내역이 없습니다.
                    </EmptyState>
                )}
            </RequestList>
        </Container>
    );
};
