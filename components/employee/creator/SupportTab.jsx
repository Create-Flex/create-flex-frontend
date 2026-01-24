import React from 'react';
import { Scale, FileSpreadsheet, Clock, CheckCircle2 } from 'lucide-react';
import {
    Container, SupportCard, CardHeader, IconBox, CardTitleGroup, CardTitle, CardDesc, CardContent,
    SupportList, ListLabel, List, ListItem, ActionButton,
    HistorySection, HistoryHeader, HistoryTitle, HistoryDesc,
    TableContainer, Table, Thead, Th, Tbody, Tr, Td, TypeBadge, StatusBadge, EmptyRow, EmptyCell
} from './SupportTab.styled';

export const SupportTab = ({ onOpenSupportModal, supportRequests = [] }) => {
    // Sort requests by date (newest first)
    const sortedRequests = [...supportRequests].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

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
                    <ActionButton onClick={() => onOpenSupportModal('legal')}>
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
                    <ActionButton onClick={() => onOpenSupportModal('tax')}>
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
                    <HistoryDesc>담당 크리에이터를 위해 신청한 지원 서비스의 진행 상태를 확인하세요.</HistoryDesc>
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
                            {sortedRequests.length > 0 ? (
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
            </HistorySection>
        </Container>
    );
};
