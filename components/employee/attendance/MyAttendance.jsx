import React, { useState, useMemo } from 'react';
import { Briefcase, Filter, ArrowRight } from 'lucide-react';
import {
    Container, TableContainer, FilterHeader, FilterGroup, DateRangePicker, FilterLabel, DateInput,
    SelectContainer, StatusSelect, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, NoDataCell,
    StatusBadge, TypeIcon, StyledArrowRight, StyledFilterIcon
} from './MyAttendance.styled';

const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const day = dayNames[date.getDay()];
    return `${y}. ${m}. ${d} (${day})`;
};

const getISODate = (date) => date.toISOString().split('T')[0];

export const MyAttendance = ({ attendanceLogs = [], userName }) => {
    const today = new Date();

    // 오늘 기준 한 달 전/후 설정
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    const [startDate, setStartDate] = useState(getISODate(oneMonthAgo));
    const [endDate, setEndDate] = useState(getISODate(oneMonthLater));
    const [statusFilter, setStatusFilter] = useState('All');

    const workLogs = useMemo(() => {
        const data = [];

        // 1. Generate Past Mock Data (e.g., previous 30 days) for history visualization
        // Exclude today since today's log comes from props
        for (let i = 0; i < 40; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            if (!isWeekend) {
                let status = 'normal';
                let inTime = '08:55';
                let outTime = '18:10';
                let hours = '9h 15m';
                if (i === 0) { status = 'working'; outTime = '-'; hours = '-'; }
                if (i === 1) { status = 'late'; inTime = '09:05'; hours = '9h 05m'; }
                if (i === 11) { status = 'overtime'; outTime = '20:30'; hours = '11h 35m'; }
                data.push({
                    id: i,
                    date: formatDate(d),
                    isoDate: getISODate(d),
                    in: inTime,
                    out: outTime,
                    hours: hours,
                    status: status,
                    type: (i % 3 === 0 ? 'wfh' : 'office')
                });
            }
        }

        // 2. Add Real Attendance Logs from Props (Today & Recent)
        // Filter logs to match strict requirement: show logs for current user
        if (attendanceLogs && userName) {
            attendanceLogs.forEach(log => {
                // Ensure we handle logs for the current user
                if (log.name === userName) {
                    // Verify if this date already exists in simulation (unlikely if loop starts from i=1)
                    // But in real app you'd replace the simulation entirely. 
                    // Here we prepend real logs (which are usually "today" or recent updates)

                    // Normalize date format if needed or use existing
                    data.unshift({
                        id: log.id,
                        date: formatDate(new Date(log.date)), // 'YYYY. MM. DD (Day)'
                        isoDate: log.date, // 'YYYY-MM-DD'
                        in: log.clockIn || '-',
                        out: log.clockOut || '-',
                        hours: log.hours || '-',
                        status: log.status === '정상' ? 'normal'
                            : log.status === '지각' ? 'late'
                                : log.status === '초과' ? 'overtime'
                                    : log.status === '근무중' ? 'working'
                                        : 'normal',
                        type: log.type || 'office'
                    });
                }
            });
        }

        return data.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
    }, [attendanceLogs, userName]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'normal': return '정상';
            case 'late': return '지각';
            case 'overtime': return '초과';
            case 'working': return '근무중';
            default: return '-';
        }
    };

    const getStatusBadge = (status) => {
        let label = '-';
        switch (status) {
            case 'normal': label = '정상'; break;
            case 'late': label = '지각'; break;
            case 'overtime': label = '초과'; break;
            case 'working': label = '근무중'; break;
            default: label = '-';
        }
        return <StatusBadge $status={status}>{label}</StatusBadge>;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'wfh': return <TypeIcon><Briefcase size={12} /> 재택</TypeIcon>;
            case 'office': return <TypeIcon><Briefcase size={12} /> 출근</TypeIcon>;
            default: return null;
        }
    }

    const filteredWorkLogs = workLogs.filter(log => {
        const isWithinDateRange = log.isoDate >= startDate && log.isoDate <= endDate;
        const matchesStatus = statusFilter === 'All' || getStatusLabel(log.status) === statusFilter;
        return isWithinDateRange && matchesStatus;
    });

    return (
        <Container>
            {/* Work Logs Table & Filters */}
            <TableContainer>
                <FilterHeader>
                    <FilterGroup>
                        <DateRangePicker>
                            <FilterLabel>기간</FilterLabel>
                            <DateInput
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <StyledArrowRight><ArrowRight size={14} /></StyledArrowRight>
                            <DateInput
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </DateRangePicker>

                        <SelectContainer>
                            <StatusSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">모든 상태</option>
                                <option value="정상">정상</option>
                                <option value="지각">지각</option>
                                <option value="초과">초과</option>
                                <option value="근무중">근무중</option>
                            </StatusSelect>
                            <StyledFilterIcon><Filter size={14} /></StyledFilterIcon>
                        </SelectContainer>
                    </FilterGroup>
                </FilterHeader>

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell $width="25%">날짜</TableHeaderCell>
                            <TableHeaderCell>출근 시간</TableHeaderCell>
                            <TableHeaderCell>퇴근 시간</TableHeaderCell>
                            <TableHeaderCell>실제 근무</TableHeaderCell>
                            <TableHeaderCell $align="right">근태 상태</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredWorkLogs.length > 0 ? (
                            filteredWorkLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell $bold $color="#111827">{log.date}</TableCell>
                                    <TableCell $mono $color={log.in > '09:00' ? '#ef4444' : '#2563eb'}>{log.in}</TableCell>
                                    <TableCell $mono $color={log.out !== '-' && log.out < '18:00' ? '#ef4444' : '#2563eb'}>{log.out}</TableCell>
                                    <TableCell $bold $color="#1f2937">{log.hours}</TableCell>
                                    <TableCell $align="right">{getStatusBadge(log.status)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <tr>
                                <NoDataCell colSpan={5}>
                                    조회된 근무 내역이 없습니다.
                                </NoDataCell>
                            </tr>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
