import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { vacationService } from '../../api/vacationService';
import { useAuthStore } from '../../../auth/model/useAuthStore';
import { useUIStore } from '../../../../shared/model/useUIStore';
import { useVacationStore } from '../../model/useVacationStore';
import {
    Plane, ArrowRight, Filter, Plus, Timer, CheckCircle2, XCircle,
    AlertCircle, Gift, Info, X, Stethoscope
} from 'lucide-react';
import {
    Container, TableContainer, ControlBar, FilterGroup, DateRangePicker, FilterLabel, DateInput,
    SelectWrapper, TypeSelect, RequestButton, ResetButton, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    TypeBadge, StatusBadge, ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, InfoLabel, InfoValue, DetailGrid, DetailInfoBox, DetailHeader, DetailRow,
    PrimaryButton,
    DetailDateRow, DetailDateItem, DateLabel, ReasonBox, RejectionBox, RejectionText,
    SelectIcon, TruncatedContent, CenterContent, MonoText
} from './MyVacation.styled';

const getISODate = (date) => date.toISOString().split('T')[0];

// 백엔드 enum → 프론트엔드 표시 텍스트 매핑
const VACATION_TYPE_MAP = {
    'ANNUAL': '연차',
    'HALF': '반차',
    'FAMILY': '경조사',
    'SICK': '병가',
    'WORKATION': '워케이션'
};

const VACATION_APPROVE_MAP = {
    'APPROVE_NEED': '대기중',
    'APPROVED': '승인됨',
    'REJECTED': '반려됨'
};

// 프론트엔드 → 백엔드 enum 매핑
const VACATION_TYPE_TO_BACKEND = {
    '연차': 'ANNUAL',
    '반차': 'HALF',
    '경조사': 'FAMILY',
    '병가': 'SICK',
    '워케이션': 'WORKATION'
};

export const MyVacation = () => {
    const { user } = useAuthStore();
    const { openVacationModal } = useUIStore();
    const { refreshKey } = useVacationStore();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    const [startDate, setStartDate] = useState(getISODate(oneMonthAgo));
    const [endDate, setEndDate] = useState(getISODate(oneMonthLater));
    const [vacationTypeFilter, setVacationTypeFilter] = useState('All');

    // API 데이터 상태
    const [vacationList, setVacationList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 모달 상태
    const [selectedDetailLog, setSelectedDetailLog] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const memberId = user?.memberId || user?.id;

    // 휴가 상세 조회 (행 클릭 시)
    const fetchVacationDetail = async (vacationId) => {
        setIsDetailLoading(true);
        try {
            const detail = await vacationService.getVacationDetail(vacationId);
            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedDetail = {
                id: detail.vacationId,
                type: VACATION_TYPE_MAP[detail.vacationType] || detail.vacationType,
                startDate: detail.vacationStart,
                endDate: detail.vacationEnd,
                days: detail.vacationDays,
                reason: detail.vacationDetail || '',
                status: VACATION_APPROVE_MAP[detail.vacationApprove] || detail.vacationApprove,
                requestDate: detail.vacationRequest,
                rejectionReason: detail.vacationRejected || '',
                // 경조사 상세
                relationship: detail.familyRelation || '',
                eventType: detail.familyDetail || '',
                // 병가 상세
                symptoms: detail.sickDetail || '',
                hospital: detail.sickHospital || '',
                // 워케이션 상세
                location: detail.workationWhere || '',
                emergencyContact: detail.workationContact || '',
                workGoals: detail.workationPlan || '',
                handover: detail.workationHandover || ''
            };
            setSelectedDetailLog(mappedDetail);
        } catch (error) {
            console.error('휴가 상세 조회 실패:', error);
            toast.error('휴가 상세 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsDetailLoading(false);
        }
    };

    // 휴가 목록 조회
    const fetchVacationList = async () => {
        setIsLoading(true);
        try {
            const filters = {
                startDate,
                endDate
            };

            // 필터가 All이 아닌 경우 타입 필터 추가
            if (vacationTypeFilter !== 'All') {
                filters.type = VACATION_TYPE_TO_BACKEND[vacationTypeFilter];
            }

            const response = await vacationService.getMyVacations(memberId, filters);

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedList = (response || []).map(item => {
                // vacationPeriod에서 시작일/종료일 파싱
                const [start, end] = item.vacationPeriod.includes('~')
                    ? item.vacationPeriod.split(' ~ ')
                    : [item.vacationPeriod, item.vacationPeriod];

                return {
                    id: item.vacationId,
                    type: VACATION_TYPE_MAP[item.vacationType] || item.vacationType,
                    startDate: start.trim(),
                    endDate: end.trim(),
                    days: item.vacationDays,
                    reason: item.vacationDetail || '',
                    status: VACATION_APPROVE_MAP[item.vacationApprove] || item.vacationApprove
                };
            });

            setVacationList(mappedList);
        } catch (error) {
            console.error('휴가 목록 조회 실패:', error);
            setVacationList([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 로딩 및 필터 변경 시 데이터 조회
    useEffect(() => {
        if (memberId) {
            fetchVacationList();
        }
    }, [memberId, startDate, endDate, vacationTypeFilter, refreshKey]);

    // 필터 초기화
    const resetFilters = () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(today.getMonth() + 1);

        setStartDate(getISODate(oneMonthAgo));
        setEndDate(getISODate(oneMonthLater));
        setVacationTypeFilter('All');
    };

    return (
        <Container>
            {/* Vacation Logs Table & Filters */}
            <TableContainer>
                <ControlBar>
                    <FilterGroup>
                        <DateRangePicker>
                            <FilterLabel>기간</FilterLabel>
                            <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <ArrowRight size={14} color="#d1d5db" style={{ margin: '0 0.25rem' }} />
                            <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </DateRangePicker>

                        <SelectWrapper>
                            <TypeSelect
                                value={vacationTypeFilter}
                                onChange={(e) => setVacationTypeFilter(e.target.value)}
                            >
                                <option value="All">모든 유형</option>
                                <option value="연차">연차</option>
                                <option value="반차">반차</option>
                                <option value="경조사">경조사</option>
                                <option value="병가">병가</option>
                                <option value="워케이션">워케이션</option>
                            </TypeSelect>
                            <SelectIcon>
                                <Filter size={14} />
                            </SelectIcon>
                        </SelectWrapper>
                    </FilterGroup>

                    <FilterGroup>
                        <ResetButton onClick={resetFilters}>필터 초기화</ResetButton>
                        <RequestButton onClick={openVacationModal}>
                            <Plus size={14} /> 휴가 신청
                        </RequestButton>
                    </FilterGroup>
                </ControlBar>

                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        로딩 중...
                    </div>
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeaderCell>휴가 기간</TableHeaderCell>
                                <TableHeaderCell>유형</TableHeaderCell>
                                <TableHeaderCell>사용 일수</TableHeaderCell>
                                <TableHeaderCell>신청 사유</TableHeaderCell>
                                <TableHeaderCell $align="center">승인 상태</TableHeaderCell>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {vacationList.length > 0 ? (
                                vacationList.map((log) => (
                                    <TableRow key={log.id} onClick={() => fetchVacationDetail(log.id)}>
                                        <TableCell $bold $color="#111827">{log.startDate} ~ {log.endDate}</TableCell>
                                        <TableCell>
                                            <TypeBadge $type={log.type}>{log.type}</TypeBadge>
                                        </TableCell>
                                        <TableCell $bold $color="#1f2937">{log.days}일</TableCell>
                                        <TableCell $color="#6b7280">
                                            <TruncatedContent>{log.reason || '-'}</TruncatedContent>
                                        </TableCell>
                                        <TableCell>
                                            <CenterContent>
                                                <StatusBadge $status={log.status}>
                                                    {log.status === '대기중' && <Timer size={12} />}
                                                    {log.status === '승인됨' && <CheckCircle2 size={12} />}
                                                    {log.status === '반려됨' && <XCircle size={12} />}
                                                    {log.status === '대기중' ? '승인대기중' : log.status}
                                                </StatusBadge>
                                            </CenterContent>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        조회된 휴가 내역이 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* 휴가 상세 내역 모달 */}
            {selectedDetailLog && (
                <ModalOverlay $zIndex={105} onClick={() => setSelectedDetailLog(null)}>
                    <ModalContent $maxWidth="28rem" onClick={e => e.stopPropagation()}>
                        <ModalHeader $bg="#f9fafb">
                            <ModalTitle>
                                <Plane size={20} color="#2563eb" /> 휴가 신청 상세
                            </ModalTitle>
                            <CloseButton onClick={() => setSelectedDetailLog(null)}><X size={20} /></CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            {isDetailLoading ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                    로딩 중...
                                </div>
                            ) : (
                                <>
                                    <DetailGrid>
                                        <div>
                                            <InfoLabel>휴가 종류</InfoLabel>
                                            <InfoValue>
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>{selectedDetailLog.type}
                                            </InfoValue>
                                        </div>
                                        <div>
                                            <InfoLabel>신청 상태</InfoLabel>
                                            <StatusBadge $status={selectedDetailLog.status}>
                                                {selectedDetailLog.status === '대기중' ? '승인대기중' : selectedDetailLog.status}
                                            </StatusBadge>
                                        </div>
                                    </DetailGrid>

                                    <div className="mt-6">
                                        <InfoLabel>휴가 기간</InfoLabel>
                                        <InfoValue>
                                            <DetailDateRow>
                                                <DetailDateItem>
                                                    <DateLabel>시작일</DateLabel>
                                                    <span>{selectedDetailLog.startDate}</span>
                                                </DetailDateItem>
                                                <ArrowRight size={16} color="#d1d5db" />
                                                <DetailDateItem $align="right">
                                                    <DateLabel>종료일</DateLabel>
                                                    <span>{selectedDetailLog.endDate}</span>
                                                </DetailDateItem>
                                            </DetailDateRow>
                                        </InfoValue>
                                    </div>

                                    <div className="mt-6">
                                        <InfoLabel>신청 사유</InfoLabel>
                                        <ReasonBox>
                                            {selectedDetailLog.reason || '입력된 사유가 없습니다.'}
                                        </ReasonBox>
                                    </div>

                                    <div className="mt-6">
                                        {selectedDetailLog.type === '워케이션' && (
                                            <DetailInfoBox $type="워케이션">
                                                <DetailHeader $color="#1d4ed8"><Info size={14} /> 워케이션 상세 내역</DetailHeader>
                                                <DetailRow>
                                                    <span>근무 장소</span><span>{selectedDetailLog.location || '-'}</span>
                                                </DetailRow>
                                                <DetailRow>
                                                    <span>비상 연락망</span><MonoText>{selectedDetailLog.emergencyContact || '-'}</MonoText>
                                                </DetailRow>
                                                <DetailRow $col $border $pt>
                                                    <span>업무 목표</span><span>{selectedDetailLog.workGoals || '-'}</span>
                                                </DetailRow>
                                                <DetailRow $col $border $pt>
                                                    <span>업무 인계 사항</span><span>{selectedDetailLog.handover || '-'}</span>
                                                </DetailRow>
                                            </DetailInfoBox>
                                        )}
                                        {selectedDetailLog.type === '병가' && (
                                            <DetailInfoBox $type="병가">
                                                <DetailHeader $color="#15803d"><Stethoscope size={14} /> 병가 상세 내역</DetailHeader>
                                                <DetailRow>
                                                    <span>증상/사유</span><span>{selectedDetailLog.symptoms || '-'}</span>
                                                </DetailRow>
                                                <DetailRow>
                                                    <span>진료 병원</span><span>{selectedDetailLog.hospital || '-'}</span>
                                                </DetailRow>
                                            </DetailInfoBox>
                                        )}
                                        {selectedDetailLog.type === '경조사' && (
                                            <DetailInfoBox $type="경조사">
                                                <DetailHeader $color="#7e22ce"><Gift size={14} /> 경조사 상세 내역</DetailHeader>
                                                <DetailRow>
                                                    <span>대상(관계)</span><span>{selectedDetailLog.relationship || '-'}</span>
                                                </DetailRow>
                                                <DetailRow>
                                                    <span>경조 내용</span><span>{selectedDetailLog.eventType || '-'}</span>
                                                </DetailRow>
                                            </DetailInfoBox>
                                        )}
                                    </div>

                                    {selectedDetailLog.status === '반려됨' && selectedDetailLog.rejectionReason && (
                                        <RejectionBox>
                                            <DetailHeader $color="#b91c1c"><AlertCircle size={14} /> 관리자 반려 사유</DetailHeader>
                                            <RejectionText>
                                                {selectedDetailLog.rejectionReason}
                                            </RejectionText>
                                        </RejectionBox>
                                    )}
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <PrimaryButton onClick={() => setSelectedDetailLog(null)}>닫기</PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};
