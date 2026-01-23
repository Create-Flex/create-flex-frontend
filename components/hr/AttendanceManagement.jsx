import React, { useState, useMemo } from 'react';
import { Search, Clock, Calendar, ArrowRight, Filter, AlertCircle, Timer, UserCheck, UserX, ChevronDown } from 'lucide-react';

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
                const isToday = date === todayStr;
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
        } else {
            // If no real logs for today found (globally), maybe generate mocks for today as placeholder?
            // Or leaving it empty means they haven't clocked in yet.
            // Let's add "Not Clocked In" placeholder for today if missing?
            // For now, let's assume the passed attendanceLogs covers "active" actions.
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

    const getStatusBadge = (status) => {
        switch (status) {
            case '정상': return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">정상</span>;
            case '지각': return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">지각</span>;
            case '결근': return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">결근</span>;
            case '휴가': return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">휴가</span>;
            default: return null;
        }
    };

    const StatCard = ({ label, value, icon: Icon, subLabel }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{label}</span>
                <Icon size={18} className="text-gray-800" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900 leading-tight">{value}</span>
                {typeof value === 'number' && <span className="text-sm text-gray-400 font-medium">명</span>}
            </div>
            {subLabel && <p className="text-[11px] text-gray-400 mt-2">{subLabel}</p>}
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* 3x2 Grid Stats Dashboard - Unified Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard label="평균 출근시간" value={stats.avgIn} icon={Clock} subLabel="전 직원의 평균 출근 기록입니다." />
                <StatCard label="평균 퇴근시간" value={stats.avgOut} icon={Timer} subLabel="전 직원의 평균 퇴근 기록입니다." />
                <StatCard label="일평균 근무시간" value={stats.avgWork} icon={Timer} subLabel="휴게 시간을 제외한 실 근무 시간입니다." />
                <StatCard label="오늘 정상출근" value={stats.todayNormal} icon={UserCheck} subLabel="현재까지 정상 출근한 인원입니다." />
                <StatCard label="오늘 지각" value={stats.todayLate} icon={AlertCircle} subLabel="정규 시간 이후 출근한 인원입니다." />
                <StatCard label="오늘 결근" value={stats.todayAbsent} icon={UserX} subLabel="현재까지 출근 기록이 없는 인원입니다." />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="직원 이름 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-[14px] border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 text-[14px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-black transition-colors shadow-sm cursor-pointer font-medium text-gray-700"
                        >
                            <option value="All">상태 전체</option>
                            <option value="정상">정상</option>
                            <option value="지각">지각</option>
                            <option value="결근">결근</option>
                            <option value="휴가">휴가</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-[13px] bg-transparent focus:outline-none cursor-pointer font-medium text-gray-600" />
                        <ArrowRight size={12} className="text-gray-300 mx-1" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-[13px] bg-transparent focus:outline-none cursor-pointer font-medium text-gray-600" />
                    </div>
                </div>
                <button
                    onClick={() => { setStartDate(todayStr); setEndDate(todayStr); setSearchQuery(''); setSelectedStatus('All'); }}
                    className="text-[11px] text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest"
                >
                    필터 초기화
                </button>
            </div>

            {/* Attendance Table - Refined Font Size & Headers */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-20">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[13px] font-bold text-gray-500 uppercase tracking-tight">
                        <tr>
                            <th className="px-6 py-4">이름</th>
                            <th className="px-6 py-4">날짜</th>
                            <th className="px-6 py-4">시간 (출근 ~ 퇴근)</th>
                            <th className="px-6 py-4 text-center">근태 상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[14px]">
                        {filteredLogs.length > 0 ? filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{log.name}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">
                                    {log.date}
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-600">
                                    {log.status === '결근' || log.status === '휴가' ? (
                                        <span className="text-gray-300">-</span>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            <span className="text-blue-600 font-semibold">{log.clockIn}</span>
                                            <ArrowRight size={12} className="text-gray-300" />
                                            <span className="text-gray-800 font-semibold">{log.clockOut}</span>
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {getStatusBadge(log.status)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-medium">
                                    조회된 근태 기록이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
