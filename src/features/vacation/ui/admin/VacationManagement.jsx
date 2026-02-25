import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Search, CheckCircle2, XCircle, AlertCircle, Calendar, ArrowRight, ArrowUpDown,
    ArrowUp, ArrowDown, Plane, Info, Stethoscope, Gift, X, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
    Container, SummaryGrid, SummaryCard, CardLabel, CardValueWrapper, CardValue, CardUnit,
    TabContainer, TabButton, TabCount, ActiveIndicator,
    ControlsContainer, FilterGroup, SearchWrapper, SearchInput, SearchIconWrapper, SearchButton, DateFilter, DateInput, DateRangeArrow, ResetButton,
    SelectWrapper, TypeSelect, SelectIconWrapper,
    TableContainer, Table, TableHead, TableHeaderCell, HeaderContent, TableBody, TableRow, TableCell, TypeBadge, StatusBadge,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalContent, DetailGrid, DetailItem, DetailLabel, DetailValueBox, DateBoxContent, DateLabelSmall,
    DetailCard, DetailCardTitle, DetailRow, DetailRowLabel, DetailRowValue, DetailText,
    RejectionInputContainer, RejectionTextarea, RejectionActions, RejectionBtn, ModalFooter, ActionButtons, ActionButton,
    WorkationGrid, WorkationSection, WorkationLabel, RejectionLabel,
    PaginationContainer, PageButton
} from './VacationManagement.styled';
import { vacationService } from '../../api/vacationService';
import { useVacationStore } from '../../model/useVacationStore';

// 백엔드 상태 → 프론트엔드 상태 매핑
const STATUS_MAP = {
    'APPROVE_NEED': '대기중',
    'APPROVED': '승인됨',
    'REJECTED': '반려됨'
};

// 백엔드 휴가 유형 → 프론트엔드 휴가 유형 매핑
const TYPE_MAP = {
    'ANNUAL': '연차',
    'HALF': '반차',
    'FAMILY': '경조사',
    'SICK': '병가',
    'WORKATION': '워케이션'
};

// 날짜를 ISO 형식 문자열로 변환
const getISODate = (date) => date.toISOString().split('T')[0];

// 기본 날짜 범위 계산 (오늘 기준 앞뒤 3개월)
const getDefaultDateRange = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    return {
        start: getISODate(threeMonthsAgo),
        end: getISODate(threeMonthsLater)
    };
};

export const VacationManagement = ({ employees = [] }) => {
    const { refreshKey: vacationRefreshKey, triggerRefresh } = useVacationStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [nameFilter, setNameFilter] = useState(''); // 백엔드에 전달할 이름 필터
    const [selectedDetailLog, setSelectedDetailLog] = useState(null);
    const [isRejectionInputOpen, setIsRejectionInputOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Date Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });

    // 백엔드 데이터 State
    const [vacationLogs, setVacationLogs] = useState([]);
    const [stats, setStats] = useState({ vacationers: 0, pending: 0, sickLeave: 0, countAll: 0, countApproved: 0, countRejected: 0 });
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const handleSort = (key) => {
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                setSortConfig({ key, direction: 'desc' });
            } else {
                setSortConfig(null);
            }
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const getSortIcon = (key) => {
        if (sortConfig?.key !== key) return <ArrowUpDown size={12} style={{ marginLeft: '0.25rem', color: '#9ca3af', opacity: 0.5 }} />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} style={{ marginLeft: '0.25rem', color: 'black' }} />
            : <ArrowDown size={12} style={{ marginLeft: '0.25rem', color: 'black' }} />;
    };

    // 휴가 상세 조회 함수
    const handleRowClick = async (vac) => {
        setIsDetailLoading(true);
        try {
            // 사용자용 상세 조회 API 사용
            const detail = await vacationService.getVacationDetail(vac.id);

            // 백엔드 응답을 프론트엔드 형식으로 변환
            const mappedDetail = {
                id: detail.vacationId,
                name: detail.memberName,
                type: TYPE_MAP[detail.vacationType] || detail.vacationType,
                startDate: detail.vacationStart,
                endDate: detail.vacationEnd,
                days: detail.vacationDays,
                requestDate: detail.vacationRequest,
                status: STATUS_MAP[detail.vacationApprove] || detail.vacationApprove,
                reason: detail.vacationDetail || '',  // 일반 신청 사유
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

    // 통계 데이터 조회 (필터와 무관하게 전체 데이터 기반)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const now = new Date();
                const currentMonth = now.toISOString().slice(0, 7);

                // 전체 미승인 건수 및 탭 카운트를 위해 넓은 날짜 범위 사용 (페이징 없이 전체 조회)
                const response = await vacationService.getAllVacations({
                    startDate: '2020-01-01',
                    endDate: '2030-12-31',
                    size: 10000  // 충분히 큰 사이즈로 전체 조회
                });

                // Page 응답에서 content 추출
                const allData = response.content || [];

                const mappedAll = allData.map(item => ({
                    type: TYPE_MAP[item.vacationType] || item.vacationType,
                    startDate: item.vacationStart,
                    endDate: item.vacationEnd,
                    status: STATUS_MAP[item.vacationApprove] || item.vacationApprove
                }));

                const vacationers = mappedAll.filter(v =>
                    v.status === '승인됨' && v.type !== '병가' &&
                    (v.startDate?.startsWith(currentMonth) || v.endDate?.startsWith(currentMonth))
                ).length;

                const pending = mappedAll.filter(v => v.status === '대기중').length;

                const sickLeave = mappedAll.filter(v =>
                    v.type === '병가' && v.status === '승인됨' &&
                    (v.startDate?.startsWith(currentMonth) || v.endDate?.startsWith(currentMonth))
                ).length;

                // 탭 카운트용 전체 데이터 (사용완료 제외)
                const countAll = mappedAll.length;
                const countApproved = mappedAll.filter(v => v.status === '승인됨').length;
                const countRejected = mappedAll.filter(v => v.status === '반려됨').length;

                setStats({ vacationers, pending, sickLeave, countAll, countApproved, countRejected });
            } catch (error) {
                console.error('통계 데이터 조회 실패:', error);
            }
        };

        fetchStats();
    }, [vacationRefreshKey]);

    // 휴가 목록 조회 (필터 적용 + 페이징)
    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const filters = {
                    page: page,
                    size: pageSize
                };

                if (startDate) filters.startDate = startDate;
                if (endDate) filters.endDate = endDate;

                if (typeFilter && typeFilter !== 'All') filters.type = typeFilter;
                if (nameFilter) filters.name = nameFilter;

                // 탭 필터를 백엔드 status 파라미터로 전달 (totalPages가 탭 기준으로 정확히 계산되도록)
                const TAB_TO_STATUS = { pending: 'APPROVE_NEED', approved: 'APPROVED', rejected: 'REJECTED' };
                if (TAB_TO_STATUS[activeTab]) filters.status = TAB_TO_STATUS[activeTab];

                const response = await vacationService.getAllVacations(filters);

                // Page 응답 처리
                const listData = response.content || [];
                setTotalPages(response.totalPages || 0);

                // 백엔드 DTO → 프론트엔드 포맷 매핑
                const mappedData = listData.map(item => ({
                    id: item.vacationId,
                    name: item.memberName,
                    type: TYPE_MAP[item.vacationType] || item.vacationType,
                    startDate: item.vacationStart,
                    endDate: item.vacationEnd,
                    days: item.vacationDays || 1,
                    requestDate: item.vacationRequest || '-',
                    status: STATUS_MAP[item.vacationApprove] || item.vacationApprove,
                    remainingVacation: item.vacationRemainder,
                    reason: item.vacationDetail || ''  // 일반 신청 사유
                }));

                setVacationLogs(mappedData);
            } catch (error) {
                console.error('휴가 목록 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [startDate, endDate, typeFilter, nameFilter, activeTab, page, vacationRefreshKey]);

    // 상태/날짜 필터는 백엔드에서 처리. 프론트엔드는 정렬만 담당
    const filteredAndSorted = vacationLogs.sort((a, b) => {
        if (sortConfig) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue === undefined || bValue === undefined) return 0;
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }
        return b.startDate.localeCompare(a.startDate);
    });

    // 탭 카운트는 stats에서 가져옴 (필터와 무관하게 전체 데이터 기반)
    const { countAll, countApproved, countRejected, pending: countPending } = stats;

    const handleApproval = async (targetLog, approved) => {
        if (!approved && !rejectionReason.trim()) {
            setIsRejectionInputOpen(true);
            toast.error('반려 사유를 입력해주세요.');
            return;
        }

        try {
            if (approved) {
                await vacationService.approveVacation(targetLog.id);
            } else {
                await vacationService.rejectVacation(targetLog.id, rejectionReason);
            }

            toast.success(approved ? '휴가 승인이 완료되었습니다.' : '휴가가 반려 처리되었습니다.');
            triggerRefresh(); // 목록 새로고침
            setSelectedDetailLog(null);
            setIsRejectionInputOpen(false);
            setRejectionReason('');
        } catch (error) {
            console.error('휴가 처리 실패:', error);
            toast.error(error.response?.data?.message || '휴가 처리 중 오류가 발생했습니다.');
        }
    };

    // 검색 실행 (버튼 클릭 또는 엔터)
    const handleSearch = () => {
        setNameFilter(searchQuery);
        setPage(0);
    };

    // 엔터 키 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setNameFilter('');
        setStartDate('');
        setEndDate('');
        setTypeFilter('All');
        setActiveTab('all');
        setSortConfig({ key: 'startDate', direction: 'desc' });
        setPage(0);
    };

    return (
        <Container>
            {/* Summary Cards */}
            <SummaryGrid>
                <SummaryCard>
                    <CardLabel>이번달 휴가자</CardLabel>
                    <CardValueWrapper>
                        <CardValue>{stats.vacationers}</CardValue>
                        <CardUnit>명</CardUnit>
                    </CardValueWrapper>
                </SummaryCard>
                <SummaryCard>
                    <CardLabel>미승인(결제대기) 신청</CardLabel>
                    <CardValueWrapper>
                        <CardValue>{stats.pending}</CardValue>
                        <CardUnit>건</CardUnit>
                    </CardValueWrapper>
                </SummaryCard>
                <SummaryCard>
                    <CardLabel>이번달 병가자</CardLabel>
                    <CardValueWrapper>
                        <CardValue>{stats.sickLeave}</CardValue>
                        <CardUnit>명</CardUnit>
                    </CardValueWrapper>
                </SummaryCard>
            </SummaryGrid>

            {/* Tabs (세분화된 필터) */}
            <TabContainer>
                <TabButton $active={activeTab === 'all'} onClick={() => { setActiveTab('all'); setPage(0); setSortConfig({ key: 'startDate', direction: 'desc' }); }}>
                    전체 <TabCount $type="all">{countAll}</TabCount>
                    {activeTab === 'all' && <ActiveIndicator />}
                </TabButton>
                <TabButton $active={activeTab === 'approved'} onClick={() => { setActiveTab('approved'); setPage(0); setSortConfig({ key: 'startDate', direction: 'desc' }); }}>
                    승인 <TabCount $type="approved">{countApproved}</TabCount>
                    {activeTab === 'approved' && <ActiveIndicator />}
                </TabButton>
                <TabButton $active={activeTab === 'rejected'} onClick={() => { setActiveTab('rejected'); setPage(0); setSortConfig({ key: 'startDate', direction: 'desc' }); }}>
                    반려됨 <TabCount $type="rejected">{countRejected}</TabCount>
                    {activeTab === 'rejected' && <ActiveIndicator />}
                </TabButton>
                <TabButton $active={activeTab === 'pending'} onClick={() => { setActiveTab('pending'); setPage(0); setSortConfig({ key: 'requestDate', direction: 'desc' }); }}>
                    미승인 <TabCount $type="pending">{countPending}</TabCount>
                    {activeTab === 'pending' && <ActiveIndicator />}
                </TabButton>
            </TabContainer>

            {/* Filter Toolbar */}
            <ControlsContainer>
                <FilterGroup>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <Search size={14} />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="신청자 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </SearchWrapper>
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                    <SelectWrapper>
                        <TypeSelect
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
                        >
                            <option value="All">유형 전체</option>
                            <option value="연차">연차</option>
                            <option value="반차">반차</option>
                            <option value="경조사">경조사</option>
                            <option value="병가">병가</option>
                            <option value="워케이션">워케이션</option>
                        </TypeSelect>
                        <SelectIconWrapper>
                            <ChevronDown size={14} />
                        </SelectIconWrapper>
                    </SelectWrapper>
                    <DateFilter>
                        <Calendar size={14} color="#9ca3af" />
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                        />
                        <DateRangeArrow>
                            <ArrowRight size={12} />
                        </DateRangeArrow>
                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                        />
                    </DateFilter>
                </FilterGroup>
                <ResetButton onClick={resetFilters}>필터 초기화</ResetButton>
            </ControlsContainer>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell $sortable onClick={() => handleSort('requestDate')}>
                                <HeaderContent>신청일 {getSortIcon('requestDate')}</HeaderContent>
                            </TableHeaderCell>
                            <TableHeaderCell $sortable onClick={() => handleSort('name')}>
                                <HeaderContent>신청자 {getSortIcon('name')}</HeaderContent>
                            </TableHeaderCell>
                            <TableHeaderCell $sortable onClick={() => handleSort('type')}>
                                <HeaderContent>유형 {getSortIcon('type')}</HeaderContent>
                            </TableHeaderCell>
                            <TableHeaderCell $sortable onClick={() => handleSort('startDate')}>
                                <HeaderContent>시작일 {getSortIcon('startDate')}</HeaderContent>
                            </TableHeaderCell>
                            <TableHeaderCell $sortable onClick={() => handleSort('endDate')}>
                                <HeaderContent>종료일 {getSortIcon('endDate')}</HeaderContent>
                            </TableHeaderCell>
                            <TableHeaderCell>일수</TableHeaderCell>
                            <TableHeaderCell>잔여 연차</TableHeaderCell>
                            <TableHeaderCell>상태</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredAndSorted.length > 0 ? filteredAndSorted.map(vac => (
                            <TableRow
                                key={vac.id}
                                onClick={() => handleRowClick(vac)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell $xs $color="#4b5563">{vac.requestDate || '-'}</TableCell>
                                <TableCell $bold $color="#111827">{vac.name}</TableCell>
                                <TableCell>
                                    <TypeBadge $type={vac.type}>{vac.type}</TypeBadge>
                                </TableCell>
                                <TableCell $xs $color="#4b5563">{vac.startDate}</TableCell>
                                <TableCell $xs $color="#4b5563">{vac.endDate}</TableCell>
                                <TableCell>{vac.days}일</TableCell>
                                <TableCell $bold $color="var(--primary-600)">{vac.remainingVacation != null ? `${vac.remainingVacation}일` : '-'}</TableCell>
                                <TableCell>
                                    <StatusBadge $status={vac.status}>
                                        {vac.status === '승인됨' && <CheckCircle2 size={12} />}
                                        {vac.status === '반려됨' && <XCircle size={12} />}
                                        {vac.status === '대기중' && ''}
                                        {vac.status === '대기중' ? '결재하기' : vac.status}
                                    </StatusBadge>
                                </TableCell>
                            </TableRow>
                        )
                        ) : (
                            <tr>
                                <TableCell colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    해당하는 휴가 내역이 없습니다.
                                </TableCell>
                            </tr>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {totalPages > 0 && (
                <PaginationContainer>
                    <PageButton
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        <ChevronLeft size={16} />
                    </PageButton>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (page < 2) {
                            pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = page - 2 + i + 1;
                        }

                        return (
                            <PageButton
                                key={pageNum}
                                onClick={() => setPage(pageNum - 1)}
                                $active={page === pageNum - 1}
                            >
                                {pageNum}
                            </PageButton>
                        );
                    })}

                    <PageButton
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                    >
                        <ChevronRight size={16} />
                    </PageButton>
                </PaginationContainer>
            )}

            {/* 휴가 신청 상세 모달 (관리자용) */}
            {selectedDetailLog && (
                <ModalOverlay onClick={() => { setSelectedDetailLog(null); setIsRejectionInputOpen(false); }}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>
                                <Plane size={20} color="#2563eb" />
                                휴가 신청 상세 검토
                            </ModalTitle>
                            <CloseButton onClick={() => { setSelectedDetailLog(null); setIsRejectionInputOpen(false); }}>
                                <X size={20} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalContent>
                            {isDetailLoading ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                    로딩 중...
                                </div>
                            ) : (
                                <>
                                    <DetailGrid>
                                        <DetailItem>
                                            <DetailLabel>신청일</DetailLabel>
                                            <DetailValueBox>{selectedDetailLog.requestDate || '-'}</DetailValueBox>
                                        </DetailItem>
                                        <DetailItem>
                                            <DetailLabel>신청자</DetailLabel>
                                            <DetailValueBox>{selectedDetailLog.name}</DetailValueBox>
                                        </DetailItem>
                                        <DetailItem>
                                            <DetailLabel>휴가 종류</DetailLabel>
                                            <DetailValueBox>
                                                <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#3b82f6', marginRight: '0.25rem' }}></span>
                                                {selectedDetailLog.type}
                                            </DetailValueBox>
                                        </DetailItem>
                                    </DetailGrid>

                                    <DetailItem>
                                        <DetailLabel>휴가 기간</DetailLabel>
                                        <DetailValueBox $white>
                                            <DateBoxContent>
                                                <DateLabelSmall>시작일</DateLabelSmall>
                                                <span>{selectedDetailLog.startDate}</span>
                                            </DateBoxContent>
                                            <ArrowRight size={16} color="#d1d5db" />
                                            <DateBoxContent $right>
                                                <DateLabelSmall>종료일</DateLabelSmall>
                                                <span>{selectedDetailLog.endDate}</span>
                                            </DateBoxContent>
                                        </DetailValueBox>
                                    </DetailItem>

                                    <DetailItem>
                                        <DetailLabel>신청 사유</DetailLabel>
                                        <DetailValueBox $multiline>
                                            {selectedDetailLog.reason || '입력된 사유가 없습니다.'}
                                        </DetailValueBox>
                                    </DetailItem>

                                    {/* 유형별 상세 정보 */}
                                    {selectedDetailLog.type === '워케이션' && (
                                        <DetailCard $type="workation">
                                            <DetailCardTitle $type="workation" $mb>
                                                <Info size={14} /> 워케이션 상세 내역
                                            </DetailCardTitle>
                                            <WorkationGrid>
                                                <DetailRow>
                                                    <DetailRowLabel>근무 장소</DetailRowLabel>
                                                    <DetailRowValue>{selectedDetailLog.location || '-'}</DetailRowValue>
                                                </DetailRow>
                                                <DetailRow>
                                                    <DetailRowLabel>비상 연락망</DetailRowLabel>
                                                    <DetailRowValue $mono>{selectedDetailLog.emergencyContact || '-'}</DetailRowValue>
                                                </DetailRow>
                                                <WorkationSection>
                                                    <WorkationLabel>업무 목표</WorkationLabel>
                                                    <DetailText>{selectedDetailLog.workGoals || '-'}</DetailText>
                                                </WorkationSection>
                                                <WorkationSection>
                                                    <WorkationLabel>업무 인계 사항</WorkationLabel>
                                                    <DetailText>{selectedDetailLog.handover || '-'}</DetailText>
                                                </WorkationSection>
                                            </WorkationGrid>
                                        </DetailCard>
                                    )}

                                    {selectedDetailLog.type === '병가' && (
                                        <DetailCard $type="sick">
                                            <DetailCardTitle $type="sick" $mb>
                                                <Stethoscope size={14} /> 병가 상세 내역
                                            </DetailCardTitle>
                                            <DetailRow>
                                                <DetailRowLabel>증상/사유</DetailRowLabel>
                                                <DetailRowValue>{selectedDetailLog.symptoms || '-'}</DetailRowValue>
                                            </DetailRow>
                                            <DetailRow>
                                                <DetailRowLabel>진료 병원</DetailRowLabel>
                                                <DetailRowValue>{selectedDetailLog.hospital || '-'}</DetailRowValue>
                                            </DetailRow>
                                        </DetailCard>
                                    )}

                                    {selectedDetailLog.type === '경조사' && (
                                        <DetailCard $type="event">
                                            <DetailCardTitle $type="event" $mb>
                                                <Gift size={14} /> 경조사 상세 내역
                                            </DetailCardTitle>
                                            <DetailRow>
                                                <DetailRowLabel>대상(관계)</DetailRowLabel>
                                                <DetailRowValue>{selectedDetailLog.relationship || '-'}</DetailRowValue>
                                            </DetailRow>
                                            <DetailRow>
                                                <DetailRowLabel>경조 내용</DetailRowLabel>
                                                <DetailRowValue>{selectedDetailLog.eventType || '-'}</DetailRowValue>
                                            </DetailRow>
                                        </DetailCard>
                                    )}

                                    {selectedDetailLog.status === '반려됨' && selectedDetailLog.rejectionReason && (
                                        <DetailCard $type="rejected">
                                            <DetailCardTitle $type="rejected" $mb>
                                                <AlertCircle size={14} /> 관리자 반려 사유
                                            </DetailCardTitle>
                                            <DetailText $red>{selectedDetailLog.rejectionReason}</DetailText>
                                        </DetailCard>
                                    )}

                                    {isRejectionInputOpen && (
                                        <RejectionInputContainer>
                                            <RejectionLabel>반려 사유 입력 (필수)</RejectionLabel>
                                            <RejectionTextarea
                                                autoFocus
                                                placeholder="직원에게 전달될 반려 사유를 입력하세요"
                                                value={rejectionReason}
                                                onChange={e => setRejectionReason(e.target.value)}
                                            />
                                            <RejectionActions>
                                                <RejectionBtn onClick={() => setIsRejectionInputOpen(false)}>취소</RejectionBtn>
                                                <RejectionBtn $primary onClick={() => handleApproval(selectedDetailLog, false)}>반려 확정</RejectionBtn>
                                            </RejectionActions>
                                        </RejectionInputContainer>
                                    )}
                                </>
                            )}
                        </ModalContent>

                        <ModalFooter>
                            {selectedDetailLog.status === '대기중' && !isRejectionInputOpen ? (
                                <ActionButtons>
                                    <ActionButton $reject onClick={() => setIsRejectionInputOpen(true)}>반려하기</ActionButton>
                                    <ActionButton $approve onClick={() => handleApproval(selectedDetailLog, true)}>승인하기</ActionButton>
                                </ActionButtons>
                            ) : (
                                <ActionButtons $end>
                                    <ActionButton $close onClick={() => setSelectedDetailLog(null)}>닫기</ActionButton>
                                </ActionButtons>
                            )}
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
