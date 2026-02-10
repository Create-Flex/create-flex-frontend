import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Scale, FileSpreadsheet, CheckCircle2, Clock, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { legalTaxService } from '../../api/legalTaxService';
import { useLegalTaxStore } from '../../model/useLegalTaxStore';
import { mapLegalTaxFromBackend, mapStatusToBackend } from '../../../../shared/utils/legalTaxMapper';
import {
    Container, FilterBar, FilterGroup, TypeFilterButton, StatusFilterButton,
    RequestList, RequestCard, IconBox, ContentWrapper, CardHeader, HeaderLeft, TypeBadge, DateText,
    HeaderRight, CreatorName, StatusBadge, Title, ContentBox, ActionButtons, ActionButton, EmptyState,
    PaginationContainer, PageButton
} from './SupportManagement.styled';

export const SupportManagement = () => {
    const { requests, setRequests, updateRequestStatus, isLoading, setLoading, setError } = useLegalTaxStore();
    const [filter, setFilter] = useState('all'); // 'all', 'legal', 'tax'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed'
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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
                    statusParam = 'NOT_DONE';
                } else if (statusFilter === 'completed') {
                    statusParam = 'DONE';
                }

                const response = await legalTaxService.getAllRequests(typeParam, statusParam, currentPage, 8);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                // response는 Spring Page 객체 (content, totalPages 등 포함)
                const content = response.content || [];
                let mappedRequests = content.map(mapLegalTaxFromBackend);



                setRequests(mappedRequests);
                setTotalPages(response.totalPages || 0);
            } catch (error) {
                console.error('전체 법률/세무 요청 조회 실패:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRequests();
    }, [filter, statusFilter, refreshTrigger, currentPage, setRequests, setLoading, setError]);

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

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // 필터 변경 시 페이지를 0으로 리셋
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    const handleStatusFilterChange = (newStatusFilter) => {
        setStatusFilter(newStatusFilter);
        setCurrentPage(0);
    };



    return (
        <Container>
            {/* Filter Bar */}
            <FilterBar>
                <FilterGroup>
                    <TypeFilterButton
                        $type="all"
                        $active={filter === 'all'}
                        onClick={() => handleFilterChange('all')}
                    >
                        전체
                    </TypeFilterButton>
                    <TypeFilterButton
                        $type="legal"
                        $active={filter === 'legal'}
                        onClick={() => handleFilterChange('legal')}
                    >
                        법률
                    </TypeFilterButton>
                    <TypeFilterButton
                        $type="tax"
                        $active={filter === 'tax'}
                        onClick={() => handleFilterChange('tax')}
                    >
                        세무
                    </TypeFilterButton>
                </FilterGroup>
                <FilterGroup>
                    <StatusFilterButton
                        $active={statusFilter === 'all'}
                        onClick={() => handleStatusFilterChange('all')}
                    >
                        전체보기
                    </StatusFilterButton>
                    <StatusFilterButton
                        $active={statusFilter === 'active'}
                        onClick={() => handleStatusFilterChange('active')}
                    >
                        대기중
                    </StatusFilterButton>
                    <StatusFilterButton
                        $active={statusFilter === 'completed'}
                        onClick={() => handleStatusFilterChange('completed')}
                    >
                        완료됨
                    </StatusFilterButton>
                </FilterGroup>
            </FilterBar>

            {/* List */}
            <RequestList>
                {isLoading ? (
                    <EmptyState>로딩 중...</EmptyState>
                ) : requests.length > 0 ? (
                    requests.map(req => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <PaginationContainer>
                    <PageButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        <ChevronLeft size={16} />
                    </PageButton>

                    {/* Page Numbers - Sliding window of 5 */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage < 2) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i + 1;
                        }

                        return (
                            <PageButton
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum - 1)}
                                $active={currentPage === pageNum - 1}
                            >
                                {pageNum}
                            </PageButton>
                        );
                    })}

                    <PageButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        <ChevronRight size={16} />
                    </PageButton>
                </PaginationContainer>
            )}
        </Container>
    );
};