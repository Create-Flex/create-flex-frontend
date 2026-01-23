import React, { useState, useMemo } from 'react';
import { AlertCircle, Timer, Briefcase, Filter, ArrowRight } from 'lucide-react';

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
        for (let i = 1; i < 40; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            if (!isWeekend) {
                let status = 'normal';
                let inTime = '08:55';
                let outTime = '18:10';
                let hours = '9h 15m';
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
                        status: log.status === '정상' ? 'normal' : log.status === '지각' ? 'late' : log.status === '초과 근무' ? 'overtime' : 'normal',
                        type: log.type || 'office'
                    });
                }
            });
        }

        return data.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
    }, [attendanceLogs, userName]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'normal': return '정상 근무';
            case 'late': return '지각';
            case 'overtime': return '초과 근무';
            default: return '-';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'normal': return <span className="text-[#00C471] text-xs font-bold">정상 근무</span>;
            case 'late': return <span className="text-orange-600 text-xs font-bold">지각</span>;
            case 'overtime': return <span className="text-purple-600 text-xs font-bold">초과 근무</span>;
            default: return <span className="text-gray-400 text-xs font-medium">-</span>;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'wfh': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12} /> 재택</span>;
            case 'office': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12} /> 출근</span>;
            default: return null;
        }
    }

    const filteredWorkLogs = workLogs.filter(log => {
        const isWithinDateRange = log.isoDate >= startDate && log.isoDate <= endDate;
        const matchesStatus = statusFilter === 'All' || getStatusLabel(log.status) === statusFilter;
        return isWithinDateRange && matchesStatus;
    });

    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            {/* Work Logs Table & Filters */}

            {/* Work Logs Table & Filters */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-20">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mr-1">기간</span>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer" />
                            <ArrowRight size={14} className="text-gray-300 mx-1" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer" />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-3 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black appearance-none cursor-pointer shadow-sm min-w-[140px]"
                            >
                                <option value="All">모든 상태</option>
                                <option value="정상 근무">정상 근무</option>
                                <option value="지각">지각</option>
                                <option value="초과 근무">초과 근무</option>
                            </select>
                            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-1/4">날짜</th>
                            <th className="px-6 py-4">출근 시간</th>
                            <th className="px-6 py-4">퇴근 시간</th>
                            <th className="px-6 py-4">실제 근무</th>
                            <th className="px-6 py-4 text-right">근태 상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredWorkLogs.length > 0 ? (
                            filteredWorkLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.in}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.out}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">{log.hours}</td>
                                    <td className="px-6 py-4 text-right">{getStatusBadge(log.status)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                    조회된 근무 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
