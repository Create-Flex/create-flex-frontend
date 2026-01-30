import React, { useState, useMemo } from 'react';
import { Search, Clock, Calendar, ArrowRight, AlertCircle, Timer, UserCheck, UserX, ChevronDown } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    LoadingContainer, FilterContainer, SearchWrapper, SearchInput, SearchIconWrapper, SelectWrapper, StatusSelect, SelectIconWrapper, DateRangePicker, DateInput, ResetButton, DateRangeArrow,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    NameText, TimeRange, TimeText, NoDataText, Badge
} from './AttendanceManagement.styled';

export const AttendanceManagement = ({ employees, attendanceLogs = [] }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);

    // 가상 근태 로그 생성 (오늘 및 과거 데이터 포함)
    const allAttendanceLogs = useMemo(() => {
        const logs = [];
        const dateRange = [];

        // 1. Generate History (Past 7 days excluding today for simulation, or mix)
        // For simplicity, we keep the mock generation for *past* dates to simulate history
        for (let i = 1; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            if (d.getDay() !== 0 && d.getDay() !== 6) { // 주말 제외
                dateRange.push(d.toISOString().split('T')[0]);
            }
        }

        employees.forEach(emp => {
            // Add Mock Past Logs
            dateRange.forEach(date => {
                // ... (Existing mock logic for past dates)
                let status = '정상';
                let inTime = '08:55';
                let outTime = '18:05';

                // Randomize
                if (emp.workStatus === '휴가') { status = '휴가'; inTime = '-'; outTime = '-'; }
                else {
                    const rand = Math.random();
                    if (rand > 0.9) { status = '결근'; inTime = '-'; outTime = '-'; }
                    else if (rand > 0.8) { status = '지각'; inTime = '09:15'; }
                }

                logs.push({
                    id: `${emp.id}-${date}`,
                    employeeId: emp.id,
                    name: emp.name,
                    date,
                    clockIn: inTime,
                    clockOut: outTime,
                    status
                });
            });
        });

        // 2. Add/Merge Real Logs (Primary Source for Today)
        if (attendanceLogs.length > 0) {
            attendanceLogs.forEach(realLog => {
                logs.push({
                    id: realLog.id,
                    employeeId: realLog.employeeId,
                    name: realLog.name,
                    date: realLog.date,
                    clockIn: realLog.clockIn || '-',
                    clockOut: realLog.clockOut || '-',
                    status: realLog.status
                });
            });
        }

        return logs.sort((a, b) => b.date.localeCompare(a.date));
    }, [employees, todayStr, attendanceLogs]);

    // 통계 계산
    const stats = useMemo(() => {
        const todayLogs = allAttendanceLogs.filter(l => l.date === todayStr);
        return {
            avgIn: '08:57',
            avgOut: '18:12',
            avgWork: '9h 15m',
            todayNormal: todayLogs.filter(l => l.status === '정상').length,
            todayLate: todayLogs.filter(l => l.status === '지각').length,
            todayAbsent: todayLogs.filter(l => l.status === '결근').length,
        };
    }, [allAttendanceLogs, todayStr]);

    // 필터링 적용
    const filteredLogs = allAttendanceLogs.filter(log => {
        const matchesName = log.name.includes(searchQuery);
        const matchesDate = log.date >= startDate && log.date <= endDate;
        const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;
        return matchesName && matchesDate && matchesStatus;
    }).sort((a, b) => b.date.localeCompare(a.date));


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
                    onClick={() => { setStartDate(todayStr); setEndDate(todayStr); setSearchQuery(''); setSelectedStatus('All'); }}
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
