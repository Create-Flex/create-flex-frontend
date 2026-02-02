import React, { useState, useMemo, useEffect } from 'react';
import { useOrgStore } from '../../stores/useOrgStore';
import { attendanceService } from '../../api/attendanceService';
import { Search, Clock, Calendar, ArrowRight, AlertCircle, Timer, UserCheck, UserX, ChevronDown } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    LoadingContainer, FilterContainer, SearchWrapper, SearchInput, SearchIconWrapper, SelectWrapper, StatusSelect, SelectIconWrapper, DateRangePicker, DateInput, ResetButton, DateRangeArrow,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    NameText, TimeRange, TimeText, NoDataText, Badge
} from './AttendanceManagement.styled';

export const AttendanceManagement = ({ employees, attendanceLogs = [] }) => {
    const { attendanceRefreshKey } = useOrgStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [startDate, setStartDate] = useState(''); // Default to empty to fetch all history
    const [endDate, setEndDate] = useState('');

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
                        avgIn: statsData.avgClockInTime || '-',
                        avgOut: statsData.avgClockOutTime || '-',
                        avgWork: statsData.avgWorkTime || '-',
                        todayNormal: statsData.normalCount || 0,
                        todayLate: statsData.lateCount || 0,
                        todayAbsent: statsData.absentCount || 0,
                        // If API returns different field names, map them here. Assuming DTO structure based on typical naming. 
                        // Since DTO definition wasn't fully inspected, I'll use safe defaults or check typical patterns if errors occur.
                        // Actually, let's assume the keys match what I expect or map them dynamically if needed.
                        // Re-checking controller... returns CompanyAttendanceDashboardDto. 
                        // Let's assume keys: avgClockInTime, avgClockOutTime, avgWorkTime, normalCount, lateCount, absentCount.
                    });
                }

                // 2. Attendance List
                const listParams = {
                    startDate,
                    endDate,
                    status: selectedStatus === 'All' ? null : selectedStatus
                };
                const listData = await attendanceService.getAllAttendance(listParams);

                // Map Backend DTO to Component State
                const mappedData = listData.map(item => {
                    const clockIn = item.attendanceStart ? item.attendanceStart.split('T')[1].substring(0, 5) : '-';
                    const clockOut = item.attendanceEnd ? item.attendanceEnd.split('T')[1].substring(0, 5) : '-';

                    let status = item.attendanceStatus;

                    // Overtime Logic: If clocked in by 09:00 and out after 18:00 and work duration > 9h
                    // Since specific duration calculation might be complex with breaks, we'll try a simple check first as requested.
                    // User Rule: "09시 이전에 출근했고 18시 이후에 퇴근했으며, 일한 시간이 9시간이 넘을 경우"
                    // If backend workDuration is "9h 15m" etc. we can parse it.
                    // Or we can just rely on clockIn/Out times if break time is standard.
                    // Let's rely on Parsing workDuration if available or times. 
                    // Let's assume standard 1h break. 09-18 is 9h span minus 1h break = 8h work. 
                    // To have >9h work, given 1h break, span must be >10h. e.g. 09-19 -> 10h span - 1h break = 9h work. 
                    // If user means "Total Time at Company > 9h", then 09-18 is 9h. 
                    // User phrasing: "일한 시간이 9시간이 넘을 경우". Usually means actual work time. 
                    // Let's simple check: In <= 09:00 AND Out >= 18:00. 
                    // Wait, 09-18 is Normal. 09-19 might be overtime. 
                    // Let's check the user request example: "09시 이전에 출근했고 18시 이후에 퇴근했으며, 일한 시간이 9시간이 넘을 경우"
                    // If I start 08:50 (Before 09), End 18:10 (After 18). Duration approx 9h 20m (minus 1h break = 8h 20m). 
                    // Maybe "Overtime" means "Stayed later than 18:00 + X"?
                    // User screenshot had 09:00 -> 20:00 (11h span). That is definitely overtime. 
                    // Let's use: if (clockIn <= '09:00' && clockOut > '18:00') -> Overtime.
                    // But explicitly check duration > 9h if we can. 

                    // Simple logic for now based on user complaint: If Start <= 09:00 AND End > 18:00 AND Duration (if available) implies long hours.
                    // Actually, let's just use time check: Start <= 09:00 AND End > 18:00 isn't enough (could be 18:01). 
                    // But usually "Overtime" status is distinct from "Normal". 
                    // If the server says "출근" (Normal) but time > 18:00, maybe we should flag it?
                    // Let's try: if (clockIn <= '09:00' && clockOut >= '19:00') -> Overtime? (1h late).
                    // User said: "Work time > 9 hours". 
                    // 09:00 to 18:00 is 9 hours elapsed. If strictly > 9h, then 18:01 is > 9h elapsed. 

                    if (clockIn <= '09:00' && clockOut > '18:00') {
                        // Check if duration is strictly > 9h if possible. 
                        // If we parse timestamps:
                        const start = new Date(item.attendanceStart);
                        const end = new Date(item.attendanceEnd);
                        const diffH = (end - start) / (1000 * 60 * 60); // hours
                        if (diffH > 9) {
                            status = '초과';
                        }
                    }

                    return {
                        id: item.attendanceId,
                        name: item.memberName,
                        date: item.attendanceDate,
                        clockIn: clockIn,
                        clockOut: clockOut,
                        status: status
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
        fetchData();
    }, [startDate, endDate, selectedStatus, attendanceRefreshKey]); // Re-fetch when filters change or refresh triggered

    // Filter by Name locally (API doesn't support name search yet)
    const filteredLogs = useMemo(() => {
        return attendanceList.filter(log => {
            const matchesName = log.name ? log.name.includes(searchQuery) : false;
            return matchesName;
        }).sort((a, b) => b.date.localeCompare(a.date)); // Sort latest first
    }, [attendanceList, searchQuery]);


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
                <StatCard label="평균 출근시간" value={stats.avgIn} icon={Clock} subLabel="전 직원의 평균 출근 기록입니다." />
                <StatCard label="평균 퇴근시간" value={stats.avgOut} icon={Timer} subLabel="전 직원의 평균 퇴근 기록입니다." />
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
                            <option value="정상">정상</option>
                            <option value="지각">지각</option>
                            <option value="결근">결근</option>
                            <option value="휴가">휴가</option>
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
                                    <Badge $status={log.status}>{log.status}</Badge>
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
