import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../model/useAttendanceStore';
import { attendanceService } from '../../api/attendanceService';
import { Search, Clock, Calendar, ArrowRight, AlertCircle, Timer, UserCheck, UserX, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    LoadingContainer, FilterContainer, SearchWrapper, SearchInput, SearchIconWrapper, SearchButton, SelectWrapper, StatusSelect, SelectIconWrapper, DateRangePicker, DateInput, ResetButton, DateRangeArrow,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    NameText, TimeRange, TimeText, NoDataText, Badge,
    PaginationContainer, PageButton, PageInfo
} from './AttendanceManagement.styled';

export const AttendanceManagement = ({ employees, attendanceLogs = [] }) => {
    const { refreshKey: attendanceRefreshKey } = useAttendanceStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Status Map for API
    const STATUS_MAP = {
        '정상': 'NORMAL',
        '지각': 'LATE',
        '조퇴': 'EARLY_LEAVE',
        '초과': 'OVERTIME',
        '근무중': 'WORKING',
        '결근': 'ABSENT',
        '반차': 'HALF_VACATION',
        '휴가': 'VACATION',
        '워케이션': 'WORKATION',
        'All': null
    };
    const [stats, setStats] = useState({
        avgIn: '-',
        avgOut: '-',
        avgWork: '-',
        todayNormal: 0,
        todayLate: 0,
        todayAbsent: 0,
    });
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // Initial Data Fetch & Filter Updates
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Dashboard Stats
                const statsData = await attendanceService.getCompanyDashboardStats();
                if (statsData) {
                    setStats({
                        avgIn: statsData.averageStartTime || '-',
                        avgOut: statsData.averageEndTime || '-',
                        avgWork: statsData.averageWorkTime || '-',
                        todayNormal: statsData.todayNormalCount || 0,
                        todayLate: statsData.todayLateCount || 0,
                        todayAbsent: statsData.todayAbsentCount || 0,
                    });
                }

                // 2. Attendance List (백엔드 필터링)
                const listParams = {
                    startDate,
                    endDate,
                    status: STATUS_MAP[selectedStatus], // 상태 필터
                    name: searchQuery || undefined, // 이름 검색 필터
                    page: page, // 페이지 번호
                    size: pageSize // 페이지 크기
                };
                const listResponse = await attendanceService.getAllAttendance(listParams);

                // Handle Page<Dto> response
                const listData = listResponse.content || [];
                setTotalPages(listResponse.totalPages || 0);

                // Map Backend DTO to Component State (백엔드에서 상태/정렬 처리)
                const mappedData = listData.map(item => {
                    const clockIn = item.attendanceStart ? item.attendanceStart.split('T')[1].substring(0, 5) : '-';
                    const clockOut = item.attendanceEnd ? item.attendanceEnd.split('T')[1].substring(0, 5) : '-';

                    return {
                        id: item.attendanceId,
                        name: item.memberName,
                        date: item.attendanceDate,
                        clockIn: clockIn,
                        clockOut: clockOut,
                        checkInStatus: item.checkInStatus,   // 출근 상태: 정상, 지각, 결근
                        checkOutStatus: item.checkOutStatus  // 퇴근 상태: 조퇴, 정상, 초과 (null = 근무중)
                    };
                });

                setAttendanceList(mappedData);

            } catch (error) {
                console.error("Failed to fetch attendance data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, selectedStatus, searchQuery, page, attendanceRefreshKey]);

    // 검색 버튼/엔터키 핸들러
    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 백엔드에서 필터링/정렬 처리하므로 프론트엔드에서는 그대로 사용
    const filteredLogs = attendanceList;


    const formatTimeStats = (val, isDuration) => {
        if (!val || val === '-') return null;

        let h, m;

        // Case 1: "09:30" format (HH:MM)
        if (typeof val === 'string' && val.includes(':')) {
            const parts = val.split(':');
            h = parts[0];
            m = parts[1];
        }
        // Case 2: "9h 22m" format
        else if (typeof val === 'string' && val.includes('h')) {
            const parts = val.split('h');
            h = parts[0].trim();
            m = parts[1].replace('m', '').trim();
        }

        if (h !== undefined && m !== undefined) {
            const hUnit = isDuration ? '시간' : '시';
            const mUnit = '분';
            return (
                <>
                    <StatValue>{h}</StatValue>
                    <StatUnit>{hUnit}</StatUnit>
                    <div style={{ width: '8px' }}></div>
                    <StatValue>{m}</StatValue>
                    <StatUnit>{mUnit}</StatUnit>
                </>
            );
        }

        return null;
    };

    const StatCard = ({ label, value, icon: Icon, subLabel, customValue }) => (
        <StatCardContainer>
            <StatHeader>
                <StatLabel>{label}</StatLabel>
                <Icon size={18} color="#1f2937" />
            </StatHeader>
            <StatValueWrapper>
                {customValue ? customValue : (
                    <>
                        <StatValue>{value}</StatValue>
                        {typeof value === 'number' && <StatUnit>명</StatUnit>}
                    </>
                )}
            </StatValueWrapper>
            {subLabel && <StatSubLabel>{subLabel}</StatSubLabel>}
        </StatCardContainer>
    );

    return (
        <Container>
            {/* 3x2 Grid Stats Dashboard */}
            <StatsGrid>
                <StatCard label="이번달 평균 출근" value={stats.avgIn} customValue={formatTimeStats(stats.avgIn, false)} icon={Clock} subLabel="이번 달 전 직원의 평균 출근 기록입니다." />
                <StatCard label="이번달 평균 퇴근" value={stats.avgOut} customValue={formatTimeStats(stats.avgOut, false)} icon={Timer} subLabel="이번 달 전 직원의 평균 퇴근 기록입니다." />
                <StatCard label="일평균 근무시간" value={stats.avgWork} customValue={formatTimeStats(stats.avgWork, true)} icon={Timer} subLabel="휴게 시간을 제외한 실 근무 시간입니다." />
                <StatCard label="오늘 정상출근" value={stats.todayNormal} icon={UserCheck} subLabel="현재까지 정상 출근한 인원입니다." />
                <StatCard label="오늘 지각" value={stats.todayLate} icon={AlertCircle} subLabel="정규 시간 이후 출근한 인원입니다." />
                <StatCard label="오늘 결근" value={stats.todayAbsent} icon={UserX} subLabel="현재까지 출근 기록이 없는 인원입니다." />
            </StatsGrid>

            {/* Filter Bar */}
            <LoadingContainer>
                <FilterContainer>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <Search size={14} />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="직원 이름 검색..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <SearchButton onClick={handleSearch}>검색</SearchButton>
                    </SearchWrapper>

                    <SelectWrapper>
                        <StatusSelect
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All">상태 전체</option>
                            <option value="정상">정상</option>
                            <option value="지각">지각</option>
                            <option value="조퇴">조퇴</option>
                            <option value="초과">초과</option>
                            <option value="근무중">근무중</option>
                            <option value="반차">반차</option>
                            <option value="휴가">휴가</option>
                            <option value="워케이션">워케이션</option>
                        </StatusSelect>
                        <SelectIconWrapper>
                            <ChevronDown size={14} />
                        </SelectIconWrapper>
                    </SelectWrapper>

                    <DateRangePicker>
                        <Calendar size={14} color="#9ca3af" />
                        <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <DateRangeArrow>
                            <ArrowRight size={12} />
                        </DateRangeArrow>
                        <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </DateRangePicker>
                </FilterContainer>
                <ResetButton
                    onClick={() => { setStartDate(''); setEndDate(''); setSearchInput(''); setSearchQuery(''); setSelectedStatus('All'); setPage(0); }}
                >
                    필터 초기화
                </ResetButton>
            </LoadingContainer>

            {/* Attendance Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell>이름</TableHeaderCell>
                            <TableHeaderCell>날짜</TableHeaderCell>
                            <TableHeaderCell>시간 (출근 ~ 퇴근)</TableHeaderCell>
                            <TableHeaderCell $center>근태 상태</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredLogs.length > 0 ? filteredLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <NameText>{log.name}</NameText>
                                </TableCell>
                                <TableCell $color="#6b7280">
                                    {log.date}
                                </TableCell>
                                <TableCell>
                                    {log.status === '결근' || log.status === '휴가' ? (
                                        <NoDataText>-</NoDataText>
                                    ) : (
                                        <TimeRange>
                                            <TimeText $color={log.clockIn > '09:00' ? '#ef4444' : '#2563eb'}>
                                                {log.clockIn}
                                            </TimeText>
                                            <ArrowRight size={12} color="#d1d5db" />
                                            <TimeText $out $color={log.clockOut && log.clockOut < '18:00' ? '#ef4444' : '#2563eb'}>
                                                {log.clockOut || '-'}
                                            </TimeText>
                                        </TimeRange>
                                    )}
                                </TableCell>
                                <TableCell $center>
                                    {/* 출근 상태 배지: 특이사항만 표시 (출근 제외) */}
                                    {log.checkInStatus && log.checkInStatus !== '출근' && (
                                        <Badge $status={log.checkInStatus}>{log.checkInStatus}</Badge>
                                    )}
                                    {/* 퇴근 상태 배지: 특이사항만 표시 (퇴근 제외) */}
                                    {log.checkOutStatus && log.checkOutStatus !== '퇴근' && (
                                        <Badge $status={log.checkOutStatus}>{log.checkOutStatus}</Badge>
                                    )}
                                    {/* 근무중 표시 (퇴근 상태가 없을 때) */}
                                    {!log.checkOutStatus && log.checkInStatus && log.checkInStatus !== '결근' && log.checkInStatus !== '휴가' && (
                                        <Badge $status="근무중">근무중</Badge>
                                    )}
                                    {/* 정상 출퇴근 표시 */}
                                    {log.checkInStatus === '출근' && log.checkOutStatus === '퇴근' && (
                                        <Badge $status="정상">정상</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <tr>
                                <TableCell colSpan={4} $center $color="#9ca3af">
                                    조회된 근태 기록이 없습니다.
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
        </Container >
    );
};
