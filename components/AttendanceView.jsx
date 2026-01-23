import React, { useState } from 'react';
import { Clock, Plane, AlertCircle, Timer } from 'lucide-react';
import { MyAttendance } from './employee/attendance/MyAttendance';
import { MyVacation } from './employee/vacation/MyVacation';

export const AttendanceView = ({
    vacationLogs = [],
    onUpdateVacationLogs,
    userName,
    attendanceLogs = []
}) => {
    const [activeTab, setActiveTab] = useState('work');

    // Stats Data (Mock)
    const stats = {
        lateCount: 1,
        overtimeCount: 3,
        leaveTotal: 15,
        leaveUsed: 2.5
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="text-gray-800" size={28} /> 나의 근태/휴가
                    </h1>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">지각 횟수</span>
                            <AlertCircle size={18} className="text-gray-300" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold text-gray-900">{stats.lateCount}</span>
                            <span className="text-sm text-gray-400 font-medium">회</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">정규 출근 시간 이후 기록된 누적 횟수입니다.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">추가근무 횟수</span>
                            <Timer size={18} className="text-gray-300" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold text-gray-900">{stats.overtimeCount}</span>
                            <span className="text-sm text-gray-400 font-medium">회</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">정규 업무 시간을 초과하여 근무한 일수입니다.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">잔여 연차</span>
                            <Plane size={18} className="text-gray-300" />
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold text-gray-900">{stats.leaveTotal - stats.leaveUsed}</span>
                            <span className="text-sm text-gray-400 font-medium mb-1.5">일</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">사용 연차 {stats.leaveUsed} / {stats.leaveTotal}</span>
                                <span className="font-bold text-gray-900">{Math.round((stats.leaveUsed / stats.leaveTotal) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black" style={{ width: `${(stats.leaveUsed / stats.leaveTotal) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 border-b border-gray-200 flex gap-6">
                    <button
                        onClick={() => setActiveTab('work')}
                        className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'work' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                        <Clock size={16} /> 일별 근무 내역
                    </button>
                    <button
                        onClick={() => setActiveTab('vacation')}
                        className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'vacation' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                        <Plane size={16} /> 휴가 사용 내역
                    </button>
                </div>

                {activeTab === 'work' && <MyAttendance attendanceLogs={attendanceLogs} userName={userName} />}

                {activeTab === 'vacation' && (
                    <MyVacation
                        vacationLogs={vacationLogs}
                        onUpdateVacationLogs={onUpdateVacationLogs}
                        userName={userName}
                    />
                )}
            </div>
        </div>
    );
};
