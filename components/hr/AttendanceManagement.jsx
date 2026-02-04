import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../stores/useAttendanceStore';
import { attendanceService } from '../../api/attendanceService';
import { Search, Clock, Calendar, ArrowRight, AlertCircle, Timer, UserCheck, UserX, ChevronDown } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    LoadingContainer, FilterContainer, SearchWrapper, SearchInput, SearchIconWrapper, SelectWrapper, StatusSelect, SelectIconWrapper, DateRangePicker, DateInput, ResetButton, DateRangeArrow,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    NameText, TimeRange, TimeText, NoDataText, Badge
} from './AttendanceManagement.styled';

export const AttendanceManagement = ({ employees, attendanceLogs = [] }) => {
    const { refreshKey: attendanceRefreshKey } = useAttendanceStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Status Map for API
    const STATUS_MAP = {
        '출근': 'NORMAL',
        '지각': 'LATE',
        '조퇴': 'EARLY_LEAVE',
        '초과': 'OVERTIME',
        '근무중': 'WORKING',
        '결근': 'ABSENT',
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
                    name: searchQuery || undefined // 이름 검색 필터
                };
                const listData = await attendanceService.getAllAttendance(listParams);

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
    }, [startDate, endDate, selectedStatus, searchQuery, attendanceRefreshKey]);

    // 백엔드에서 필터링/정렬 처리하므로 프론트엔드에서는 그대로 사용
    const filteredLogs = attendanceList;


    const StatCard = ({ label, value, icon: Icon, subLabel }) => (
        <StatCardContainer>
            <StatHeader>
                <StatLabel>{label}</StatLabel>
                <Icon size={18} color="#1f2937" />
            </StatHeader>
            <StatValueWrapper>
                <StatValue>{value}</StatValue>
                {typeof value === 'number' && <StatUnit>명</StatUnit>}
            </StatValueWrapper>
            {subLabel && <StatSubLabel>{subLabel}</StatSubLabel>}
        </StatCardContainer>
    );

    return (
        <Container>
            {/* 3x2 Grid Stats Dashboard */}
            <StatsGrid>
                <StatCard label="이번달 평균 출근" value={stats.avgIn} icon={Clock} subLabel="이번 달 전 직원의 평균 출근 기록입니다." />
                <StatCard label="이번달 평균 퇴근" value={stats.avgOut} icon={Timer} subLabel="이번 달 전 직원의 평균 퇴근 기록입니다." />
                <StatCard label="일평균 근무시간" value={stats.avgWork} icon={Timer} subLabel="휴게 시간을 제외한 실 근무 시간입니다." />
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchWrapper>

                    <SelectWrapper>
                        <StatusSelect
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All">상태 전체</option>
                            <option value="출근">출근</option>
                            <option value="지각">지각</option>
                            <option value="조퇴">조퇴</option>
                            <option value="초과">초과</option>
                            <option value="근무중">근무중</option>
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
                    onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); setSelectedStatus('All'); }}
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
                                    {/* 출근 상태 배지 */}
                                    {log.checkInStatus && <Badge $status={log.checkInStatus}>{log.checkInStatus}</Badge>}
                                    {/* 퇴근 상태 배지 */}
                                    {log.checkOutStatus && (
                                        <Badge $status={log.checkOutStatus}>{log.checkOutStatus}</Badge>
                                    )}
                                    {/* 근무중 표시 (퇴근 상태가 없을 때) */}
                                    {!log.checkOutStatus && log.checkInStatus !== '결근' && (
                                        <Badge $status="근무중">근무중</Badge>
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
        </Container>
    );
};
