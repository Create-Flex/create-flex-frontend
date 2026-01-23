import React, { useState } from 'react';
import {
    Search, CheckCircle2, XCircle, AlertCircle, Calendar, ArrowRight, ArrowUpDown,
    ArrowUp, ArrowDown, Plane, Info, Stethoscope, Gift, PlaneTakeoff, X, MapPin
} from 'lucide-react';

export const VacationManagement = ({ vacationLogs, onUpdateVacationLogs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDetailLog, setSelectedDetailLog] = useState(null);
    const [isRejectionInputOpen, setIsRejectionInputOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Date Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sorting State
    const [sortConfig, setSortConfig] = useState(null);

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
        if (sortConfig?.key !== key) return <ArrowUpDown size={12} className="text-gray-400 opacity-50 ml-1" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="text-black ml-1" />
            : <ArrowDown size={12} className="text-black ml-1" />;
    };

    const DEMO_CURRENT_MONTH_PREFIX = '2026-01';

    const stats = {
        vacationers: vacationLogs.filter(v =>
            v.status === '승인됨' && v.type !== '병가' && v.type !== '워케이션' &&
            (v.startDate.startsWith(DEMO_CURRENT_MONTH_PREFIX) || v.endDate.startsWith(DEMO_CURRENT_MONTH_PREFIX))
        ).length,
        pending: vacationLogs.filter(v => v.status === '대기중' && v.type !== '워케이션').length,
        sickLeave: vacationLogs.filter(v =>
            v.type === '병가' && v.status === '승인됨' &&
            (v.startDate.startsWith(DEMO_CURRENT_MONTH_PREFIX) || v.endDate.startsWith(DEMO_CURRENT_MONTH_PREFIX))
        ).length
    };

    const filteredAndSorted = vacationLogs.filter(v => {
        if (v.status === '사용완료') return false;
        if (v.type === '워케이션') return false; // 기본 기획상 워케이션 제외 (필요시 포함 가능)

        if (!v.name.includes(searchQuery)) return false;
        if (startDate && v.endDate < startDate) return false;
        if (endDate && v.startDate > endDate) return false;

        if (activeTab === 'approved') return v.status === '승인됨';
        if (activeTab === 'rejected') return v.status === '반려됨';
        if (activeTab === 'pending') return v.status === '대기중';

        return true;
    }).sort((a, b) => {
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

    const activeLogs = vacationLogs.filter(v => v.status !== '사용완료' && v.type !== '워케이션');
    const countAll = activeLogs.length;
    const countApproved = activeLogs.filter(v => v.status === '승인됨').length;
    const countRejected = activeLogs.filter(v => v.status === '반려됨').length;
    const countPending = activeLogs.filter(v => v.status === '대기중').length;

    const handleApproval = (targetLog, approved) => {
        if (!approved && !rejectionReason.trim()) {
            setIsRejectionInputOpen(true);
            return;
        }

        onUpdateVacationLogs(vacationLogs.map(log =>
            log.id === targetLog.id ? {
                ...log,
                status: approved ? '승인됨' : '반려됨',
                rejectionReason: approved ? undefined : rejectionReason
            } : log
        ));

        alert(approved ? '휴가 승인이 완료되었습니다.' : '휴가가 반려 처리되었습니다.');
        setSelectedDetailLog(null);
        setIsRejectionInputOpen(false);
        setRejectionReason('');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setActiveTab('all');
        setSortConfig(null);
    };

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">이번달 휴가자</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.vacationers}</h3>
                        <span className="text-base text-gray-400 font-medium">명</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">미승인(대기) 신청</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
                        <span className="text-base text-gray-400 font-medium">건</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-gray-500 font-bold mb-2">이번달 병가자</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.sickLeave}</h3>
                        <span className="text-base text-gray-400 font-medium">명</span>
                    </div>
                </div>
            </div>

            {/* Tabs (세분화된 필터) */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab('all')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'all' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}>
                    전체 <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">{countAll}</span>
                    {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button onClick={() => setActiveTab('approved')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'approved' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}>
                    승인 <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-bold">{countApproved}</span>
                    {activeTab === 'approved' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button onClick={() => setActiveTab('rejected')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'rejected' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}>
                    반려됨 <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-bold">{countRejected}</span>
                    {activeTab === 'rejected' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button onClick={() => setActiveTab('pending')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === 'pending' ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}>
                    미승인 <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-bold">{countPending}</span>
                    {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="신청자 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600" />
                        <ArrowRight size={12} className="text-gray-300 mx-1" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600" />
                    </div>
                </div>
                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest">필터 초기화</button>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase select-none">
                        <tr>
                            <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('requestDate')}><div className="flex items-center gap-1">신청일 {getSortIcon('requestDate')}</div></th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}><div className="flex items-center gap-1">신청자 {getSortIcon('name')}</div></th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('type')}><div className="flex items-center gap-1">유형 {getSortIcon('type')}</div></th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('startDate')}><div className="flex items-center gap-1">시작일 {getSortIcon('startDate')}</div></th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('endDate')}><div className="flex items-center gap-1">종료일 {getSortIcon('endDate')}</div></th>
                            <th className="px-6 py-3">일수</th>
                            <th className="px-6 py-3">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredAndSorted.length > 0 ? filteredAndSorted.map(vac => (
                            <tr key={vac.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedDetailLog(vac)}>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{vac.requestDate || '-'}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{vac.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${vac.type === '반차' ? 'bg-purple-50 border-purple-100 text-purple-700' : vac.type === '병가' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                        {vac.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{vac.startDate}</td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{vac.endDate}</td>
                                <td className="px-6 py-4">{vac.days}일</td>
                                <td className="px-6 py-4">
                                    {vac.status === '승인됨' && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> 승인됨</span>}
                                    {vac.status === '대기중' && <span className="text-orange-600 text-xs font-bold flex items-center gap-1 bg-orange-50 px-2 py-1 rounded w-fit">⚡ 결재대기</span>}
                                    {vac.status === '반려됨' && <span className="text-red-500 text-xs font-bold flex items-center gap-1"><XCircle size={12} /> 반려됨</span>}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">해당하는 휴가 내역이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 휴가 신청 상세 모달 (관리자용) */}
            {selectedDetailLog && (
                <div className="fixed inset-0 bg-black/40 z-[105] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { setSelectedDetailLog(null); setIsRejectionInputOpen(false); }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Plane size={20} className="text-blue-600" />
                                <h3 className="font-bold text-gray-900 text-lg">휴가 신청 상세 검토</h3>
                            </div>
                            <button onClick={() => { setSelectedDetailLog(null); setIsRejectionInputOpen(false); }} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">신청일</label>
                                    <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{selectedDetailLog.requestDate || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">신청자</label>
                                    <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{selectedDetailLog.name}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">휴가 종류</label>
                                    <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>{selectedDetailLog.type}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">휴가 기간</label>
                                <div className="text-sm font-bold text-gray-900 bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center justify-between">
                                    <div className="flex flex-col"><span className="text-[10px] text-gray-400 mb-0.5">시작일</span><span>{selectedDetailLog.startDate}</span></div>
                                    <ArrowRight size={16} className="text-gray-300" />
                                    <div className="flex flex-col text-right"><span className="text-[10px] text-gray-400 mb-0.5">종료일</span><span>{selectedDetailLog.endDate}</span></div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">신청 사유</label>
                                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed min-h-[60px]">{selectedDetailLog.reason || '입력된 사유가 없습니다.'}</div>
                            </div>

                            {/* 유형별 상세 정보 */}
                            {selectedDetailLog.type === '워케이션' && (
                                <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-700 flex items-center gap-1.5"><Info size={14} /> 워케이션 상세 내역</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">근무 장소</span>
                                            <span className="font-bold text-gray-900">{selectedDetailLog.location || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">비상 연락망</span>
                                            <span className="font-mono text-gray-900">{selectedDetailLog.emergencyContact || '-'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1 border-t border-blue-100/50">
                                            <span className="text-xs text-gray-500">업무 목표</span>
                                            <p className="text-xs text-gray-700 leading-relaxed">{selectedDetailLog.workGoals || '-'}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1 border-t border-blue-100/50">
                                            <span className="text-xs text-gray-500">업무 인계 사항</span>
                                            <p className="text-xs text-gray-700 leading-relaxed">{selectedDetailLog.handover || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedDetailLog.type === '병가' && (
                                <div className="space-y-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                                    <h4 className="text-xs font-bold text-green-700 flex items-center gap-1.5"><Stethoscope size={14} /> 병가 상세 내역</h4>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500">증상/사유</span><span className="font-bold text-gray-900">{selectedDetailLog.symptoms || '-'}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500">진료 병원</span><span className="font-bold text-gray-900">{selectedDetailLog.hospital || '-'}</span></div>
                                </div>
                            )}

                            {selectedDetailLog.type === '경조사' && (
                                <div className="space-y-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                    <h4 className="text-xs font-bold text-purple-700 flex items-center gap-1.5"><Gift size={14} /> 경조사 상세 내역</h4>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500">대상(관계)</span><span className="font-bold text-gray-900">{selectedDetailLog.relationship || '-'}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-500">경조 내용</span><span className="font-bold text-gray-900">{selectedDetailLog.eventType || '-'}</span></div>
                                </div>
                            )}

                            {selectedDetailLog.status === '반려됨' && selectedDetailLog.rejectionReason && (
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5"><AlertCircle size={14} /> 관리자 반려 사유</h4>
                                    <p className="text-xs text-red-800 leading-relaxed font-medium">{selectedDetailLog.rejectionReason}</p>
                                </div>
                            )}

                            {isRejectionInputOpen && (
                                <div className="animate-[slideIn_0.2s_ease-out] space-y-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                    <label className="block text-xs font-bold text-red-700">반려 사유 입력 (필수)</label>
                                    <textarea
                                        autoFocus
                                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                                        placeholder="직원에게 전달될 반려 사유를 입력하세요"
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setIsRejectionInputOpen(false)} className="px-3 py-1 text-xs text-gray-500 font-medium">취소</button>
                                        <button onClick={() => handleApproval(selectedDetailLog, false)} className="px-3 py-1 text-xs bg-red-600 text-white rounded font-bold">반려 확정</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            {selectedDetailLog.status === '대기중' && !isRejectionInputOpen ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsRejectionInputOpen(true)} className="flex-1 py-3 text-sm border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors">반려하기</button>
                                    <button onClick={() => handleApproval(selectedDetailLog, true)} className="flex-1 py-3 text-sm bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">승인하기</button>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <button onClick={() => setSelectedDetailLog(null)} className="px-8 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">닫기</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
