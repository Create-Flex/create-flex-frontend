import React, { useEffect, useState } from 'react';
import { Scale, FileSpreadsheet, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { legalTaxService } from '../../../support/api/legalTaxService';
import { useLegalTaxStore } from '../../../support/model/useLegalTaxStore';
import { mapLegalTaxFromBackend } from '../../../../shared/utils/legalTaxMapper';
import {
    Container, SupportCard, CardHeader, IconBox, CardTitleGroup, CardTitle, CardDesc, CardContent,
    SupportList, ListLabel, List, ListItem, ActionButton,
    HistorySection, HistoryHeader, HistoryTitle, HistoryDesc,
    TableContainer, Table, Thead, Th, Tbody, Tr, Td, TypeBadge, StatusBadge, EmptyRow, EmptyCell,
    PaginationContainer, PageButton
} from './SupportTab.styled';

export const SupportTab = ({ onOpenSupportModal, refreshTrigger: parentRefreshTrigger }) => {
    const { requests, setRequests, isLoading, setLoading, setError } = useLegalTaxStore();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 매니저용: 내 담당 크리에이터의 법률/세무 요청 조회
    useEffect(() => {
        const fetchMyRequests = async () => {
            setLoading(true);
            try {
                const response = await legalTaxService.getMyRequests(null, null, currentPage, 8);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                // response는 Spring Page 객체 (content, totalPages 등 포함)
                const content = response.content || [];
                const mappedRequests = content.map(mapLegalTaxFromBackend);
                setRequests(mappedRequests);
                setTotalPages(response.totalPages || 0);
            } catch (error) {
                console.error('내 담당 법률/세무 요청 조회 실패:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRequests();
    }, [refreshTrigger, parentRefreshTrigger, currentPage, setRequests, setLoading, setError]);

    // 신청 후 목록 새로고침
    const handleRequestCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // 최신순 정렬 (이미 백엔드에서 정렬되어 오므로 제거 가능)
    const sortedRequests = requests;

    return (
        <Container>
            {/* Legal */}
            <SupportCard>
                <CardHeader>
                    <IconBox $type="legal">
                        <Scale size={24} />
                    </IconBox>
                    <CardTitleGroup>
                        <CardTitle>법률 자문 연결</CardTitle>
                        <CardDesc>전속 계약서 검토 및 저작권 분쟁 상담</CardDesc>
                    </CardTitleGroup>
                </CardHeader>
                <CardContent>
                    <SupportList>
                        <ListLabel>주요 지원 항목:</ListLabel>
                        <List>
                            <ListItem>신규/갱신 계약서 법률 검토</ListItem>
                            <ListItem>악성 댓글 및 명예훼손 고소 대행</ListItem>
                            <ListItem>저작권 및 초상권 침해 대응</ListItem>
                        </List>
                    </SupportList>
                    <ActionButton onClick={() => onOpenSupportModal('legal', handleRequestCreated)}>
                        법률 상담 신청하기
                    </ActionButton>
                </CardContent>
            </SupportCard>

            {/* Tax */}
            <SupportCard>
                <CardHeader>
                    <IconBox $type="tax">
                        <FileSpreadsheet size={24} />
                    </IconBox>
                    <CardTitleGroup>
                        <CardTitle>세무/회계 지원</CardTitle>
                        <CardDesc>종합소득세 신고 및 정산 내역 관리</CardDesc>
                    </CardTitleGroup>
                </CardHeader>
                <CardContent>
                    <SupportList>
                        <ListLabel>주요 지원 항목:</ListLabel>
                        <List>
                            <ListItem>월별 수익 정산서 검토 및 발행</ListItem>
                            <ListItem>종합소득세/부가가치세 신고 대행 연결</ListItem>
                            <ListItem>비용 처리 및 절세 가이드 제공</ListItem>
                        </List>
                    </SupportList>
                    <ActionButton onClick={() => onOpenSupportModal('tax', handleRequestCreated)}>
                        세무 상담 신청하기
                    </ActionButton>
                </CardContent>
            </SupportCard>

            {/* My Application History Section */}
            <HistorySection>
                <HistoryHeader>
                    <HistoryTitle>
                        <Clock size={20} className="text-gray-400" /> 나의 신청 내역
                    </HistoryTitle>
                    <HistoryDesc>
                        담당 크리에이터를 위해 신청한 지원 서비스의 진행 상태를 확인하세요.
                    </HistoryDesc>
                </HistoryHeader>

                <TableContainer>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>신청일</Th>
                                <Th $center>유형</Th>
                                <Th>대상 크리에이터</Th>
                                <Th $width="33%">제목</Th>
                                <Th $center>상태</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {isLoading ? (
                                <EmptyRow>
                                    <EmptyCell colSpan="5">
                                        로딩 중...
                                    </EmptyCell>
                                </EmptyRow>
                            ) : sortedRequests.length > 0 ? (
                                sortedRequests.map(req => (
                                    <Tr key={req.id}>
                                        <Td $mono>{req.requestDate}</Td>
                                        <Td $center>
                                            <TypeBadge $type={req.type}>
                                                {req.type === 'legal' ? '법률' : '세무'}
                                            </TypeBadge>
                                        </Td>
                                        <Td $bold>{req.creatorName}</Td>
                                        <Td $medium>{req.title}</Td>
                                        <Td $center>
                                            {req.status === '완료' ? (
                                                <StatusBadge $status="완료">
                                                    <CheckCircle2 size={12} /> 완료
                                                </StatusBadge>
                                            ) : (
                                                <StatusBadge $status="pending">
                                                    <Clock size={12} /> {req.status}
                                                </StatusBadge>
                                            )}
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <EmptyRow>
                                    <EmptyCell colSpan="5">
                                        신청 내역이 없습니다.
                                    </EmptyCell>
                                </EmptyRow>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>

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
            </HistorySection>
        </Container>
    );
};