import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Scale, FileSpreadsheet, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import { legalTaxService } from '../../api/legalTaxService';
import { useLegalTaxStore } from '../../stores/useLegalTaxStore';
import { mapLegalTaxFromBackend, mapStatusToBackend } from '../../utils/legalTaxMapper';
import {
    Container, FilterBar, FilterGroup, TypeFilterButton, StatusFilterButton,
    RequestList, RequestCard, IconBox, ContentWrapper, CardHeader, HeaderLeft, TypeBadge, DateText,
    HeaderRight, CreatorName, StatusBadge, Title, ContentBox, ActionButtons, ActionButton, EmptyState
} from './SupportManagement.styled';

export const SupportManagement = () => {
    const { requests, setRequests, updateRequestStatus, isLoading, setLoading, setError } = useLegalTaxStore();
    const [filter, setFilter] = useState('all'); // 'all', 'legal', 'tax'
    const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'completed'
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 관리자용: 전체 법률/세무 요청 조회
    useEffect(() => {
        const fetchAllRequests = async () => {
            setLoading(true);
            try {
                // 필터에 따른 타입 및 상태 파라미터 설정
                let typeParam = null;
                let statusParam = null;

                if (filter !== 'all') {
                    typeParam = filter; // 'legal' or 'tax'
                }

                if (statusFilter === 'active') {
                    // 진행중인 요청만 (완료 제외)
                    // 백엔드에서는 DONE을 제외한 모든 상태를 가져와야 함
                    // 클라이언트 측에서 필터링하거나, 백엔드 API를 수정해야 함
                    // 현재는 전체를 가져온 후 클라이언트에서 필터링
                } else if (statusFilter === 'completed') {
                    statusParam = 'DONE';
                }

                const response = await legalTaxService.getAllRequests(typeParam, statusParam);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                let mappedRequests = response.map(mapLegalTaxFromBackend);

                // 클라이언트 측 추가 필터링 (statusFilter === 'active'일 때)
                if (statusFilter === 'active') {
                    mappedRequests = mappedRequests.filter(req => req.status !== '완료');
                }

                setRequests(mappedRequests);
            } catch (error) {
                console.error('전체 법률/세무 요청 조회 실패:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRequests();
    }, [filter, statusFilter, refreshTrigger, setRequests, setLoading, setError]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (newStatus === '완료') {
                // 완료 처리 API 호출
                await legalTaxService.completeRequest(id);
                toast.success('상담이 완료 처리되었습니다.');

                // 스토어 업데이트
                updateRequestStatus(id, '완료');

                // 목록 새로고침
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('상태 변경 실패:', error);
            toast.error('상태 변경에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter !== 'all' && req.type !== filter) return false;
        if (statusFilter === 'active' && req.status === '완료') return false;
        if (statusFilter === 'completed' && req.status !== '완료') return false;
        return true;
    });

    return (
        <Container>
            {/* Filter Bar */}
            <FilterBar>
                <FilterGroup>
                    <TypeFilterButton
                        $type="all"
                        $active={filter === 'all'}
                        onClick={() => setFilter('all')}
                    >
                        전체
                    </TypeFilterButton>
                    <TypeFilterButton
                        $type="legal"
                        $active={filter === 'legal'}
                        onClick={() => setFilter('legal')}
                    >
                        법률
                    </TypeFilterButton>
                    <TypeFilterButton
                        $type="tax"
                        $active={filter === 'tax'}
                        onClick={() => setFilter('tax')}
                    >
                        세무
                    </TypeFilterButton>
                </FilterGroup>
                <FilterGroup>
                    <StatusFilterButton
                        $active={statusFilter === 'all'}
                        onClick={() => setStatusFilter('all')}
                    >
                        전체보기
                    </StatusFilterButton>
                    <StatusFilterButton
                        $active={statusFilter === 'active'}
                        onClick={() => setStatusFilter('active')}
                    >
                        대기중
                    </StatusFilterButton>
                    <StatusFilterButton
                        $active={statusFilter === 'completed'}
                        onClick={() => setStatusFilter('completed')}
                    >
                        완료됨
                    </StatusFilterButton>
                </FilterGroup>
            </FilterBar>

            {/* List */}
            <RequestList>
                {isLoading ? (
                    <EmptyState>로딩 중...</EmptyState>
                ) : filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
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
                                            {req.status === '완료' ? (
                                                <><CheckCircle2 size={10} /> 완료됨</>
                                            ) : (
                                                <><Clock size={10} /> 대기중</>
                                            )}
                                        </StatusBadge>
                                    </HeaderRight>
                                </CardHeader>
                                <Title>{req.title}</Title>
                                <ContentBox>{req.content}</ContentBox>

                                {req.status !== '완료' && (
                                    <ActionButtons>
                                        <ActionButton
                                            onClick={() => handleStatusChange(req.id, '완료')}
                                        >
                                            <CheckSquare size={12} /> 완료 처리
                                        </ActionButton>
                                    </ActionButtons>
                                )}
                            </ContentWrapper>
                        </RequestCard>
                    ))
                ) : (
                    <EmptyState>
                        해당하는 요청 내역이 없습니다.
                    </EmptyState>
                )}
            </RequestList>
        </Container>
    );
};