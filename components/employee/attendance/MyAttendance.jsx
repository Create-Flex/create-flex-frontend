import React, { useState, useMemo, useEffect } from 'react';
import { useAttendanceStore } from '../../../stores/useAttendanceStore';
import { attendanceService } from '../../../api/attendanceService';
import { Briefcase, Filter, ArrowRight } from 'lucide-react';
import {
    Container, TableContainer, FilterHeader, FilterGroup, DateRangePicker, FilterLabel, DateInput,
    SelectContainer, StatusSelect, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, NoDataCell,
    StatusBadge, TypeIcon, StyledArrowRight, StyledFilterIcon, ResetButton
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

const STATUS_DISPLAY_MAP = {
    'NORMAL': '출근',
    'LATE': '지각',
    'EARLY_LEAVE': '조퇴',
    'OVERTIME': '초과',
    'WORKING': '근무중',
    'ABSENT': '결근',
    'HALF_VACATION': '반차',
    'VACATION': '휴가',
    'WORKATION': '워케이션'
};

const REVERSE_STATUS_MAP = {
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



export const MyAttendance = () => {
    const today = new Date();

    // 오늘 기준 한 달 전/후 설정
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    const { refreshKey: attendanceRefreshKey } = useAttendanceStore();

    const [startDate, setStartDate] = useState(getISODate(oneMonthAgo));
    const [endDate, setEndDate] = useState(getISODate(oneMonthLater));
    const [statusFilter, setStatusFilter] = useState('All');
    const [workLogs, setWorkLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMyAttendance = async () => {
            setLoading(true);
            try {
                const params = {
                    startDate,
                    endDate,
                    status: REVERSE_STATUS_MAP[statusFilter] // Send Backend Enum
                };
                const data = await attendanceService.getMyAttendance(params);

                // Transform API data to Component format
                const formattedData = data.map(log => {
                    const inTime = log.attendanceStart ? log.attendanceStart.split('T')[1].substring(0, 5) : '-';
                    const outTime = log.attendanceEnd ? log.attendanceEnd.split('T')[1].substring(0, 5) : '-';

                    return {
                        id: log.attendanceId,
                        date: formatDate(new Date(log.attendanceDate)),
                        isoDate: log.attendanceDate,
                        in: inTime,
                        out: outTime,
                        hours: log.workDuration || '-',
                        checkInStatus: log.checkInStatus,   // 출근 상태: 정상, 지각, 결근
                        checkOutStatus: log.checkOutStatus, // 퇴근 상태: 조퇴, 정상, 초과 (null = 근무중)
                        type: 'office'
                    };
                });
                // Sort by date desc (latest first)
                formattedData.sort((a, b) => b.isoDate.localeCompare(a.isoDate));

                setWorkLogs(formattedData);
            } catch (error) {
                console.error("Failed to fetch my attendance", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyAttendance();
        fetchMyAttendance();
    }, [startDate, endDate, statusFilter, attendanceRefreshKey]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'normal': return '출근';
            case 'late': return '지각';
            case 'overtime': return '초과';
            case 'working': return '근무중';
            default: return '-';
        }
    };

    const getStatusBadge = (checkInStatus, checkOutStatus) => {
        // 특이사항만 배지 표시 (정상 출근/퇴근 제외)
        return (
            <>
                {/* 출근 상태 배지: 특이사항만 표시 (출근 제외) */}
                {checkInStatus && checkInStatus !== '출근' && (
                    <StatusBadge $status={checkInStatus}>{checkInStatus}</StatusBadge>
                )}
                {/* 퇴근 상태 배지: 특이사항만 표시 (퇴근 제외) */}
                {checkOutStatus && checkOutStatus !== '퇴근' && (
                    <StatusBadge $status={checkOutStatus}>{checkOutStatus}</StatusBadge>
                )}
                {/* 근무중 표시 (퇴근 상태가 없을 때) */}
                {!checkOutStatus && checkInStatus && checkInStatus !== '결근' && checkInStatus !== '휴가' && (
                    <StatusBadge $status="근무중">근무중</StatusBadge>
                )}
                {/* 정상 출퇴근 표시 */}
                {checkInStatus === '출근' && checkOutStatus === '퇴근' && (
                    <StatusBadge $status="정상">정상</StatusBadge>
                )}
            </>
        );
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'wfh': return <TypeIcon><Briefcase size={12} /> 재택</TypeIcon>;
            case 'office': return <TypeIcon><Briefcase size={12} /> 출근</TypeIcon>;
            default: return null;
        }
    }

    // Filter logic is now handled by API params mainly, but we keep workLogs state directly.
    // If we want client-side filtering on top of API results (e.g. invalid date ranges returned?), we can add it.
    // For now, assuming API returns correct filtered data.
    const filteredWorkLogs = workLogs;

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
                                <option value="조퇴">조퇴</option>
                                <option value="초과">초과</option>
                                <option value="근무중">근무중</option>
                                <option value="반차">반차</option>
                                <option value="휴가">휴가</option>
                                <option value="워케이션">워케이션</option>
                            </StatusSelect>
                            <StyledFilterIcon><Filter size={14} /></StyledFilterIcon>

                        </SelectContainer>
                    </FilterGroup>
                    <ResetButton onClick={() => {
                        const today = new Date();
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(today.getMonth() - 1);
                        const oneMonthLater = new Date();
                        oneMonthLater.setMonth(today.getMonth() + 1);
                        setStartDate(getISODate(oneMonthAgo));
                        setEndDate(getISODate(oneMonthLater));
                        setStatusFilter('All');
                    }}>
                        필터 초기화
                    </ResetButton>
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
                                    <TableCell $align="right">{getStatusBadge(log.checkInStatus, log.checkOutStatus)}</TableCell>
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
        </Container >
    );
};
