import React, { useState, useMemo } from 'react';
import { Search, X, FileText, Download, Calendar, User, Activity, ArrowRight, Trash2, Edit3, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';

export const HealthManagement = ({ healthRecords: initialRecords }) => {
    // CRUD 기능을 위해 로컬 상태로 관리 (App.tsx를 수정할 수 없는 제약 사항 때문)
    const [records, setRecords] = useState(initialRecords);

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const [searchQuery, setSearchQuery] = useState('');
    const [resultFilter, setResultFilter] = useState('All'); // 결과 필터 상태 추가
    const [startDate, setStartDate] = useState(formatDate(oneYearAgo));
    const [endDate, setEndDate] = useState(formatDate(today));

    // 모달 및 편집 상태
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    // 판정 결과별 스타일 헬퍼
    const getHealthResultStyle = (result) => {
        if (result.includes('양호')) return 'bg-green-50 text-green-700 border-green-200';
        if (result.includes('경미')) return 'bg-blue-50 text-blue-700 border-blue-200';
        if (result.includes('주의')) return 'bg-orange-50 text-orange-700 border-orange-200';
        if (result.includes('위험')) return 'bg-red-50 text-red-700 border-red-200';
        if (result.includes('재검')) return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-gray-50 text-gray-500 border-gray-200';
    };

    // 필터링된 데이터
    const filtered = useMemo(() => {
        return records.filter(h => {
            const matchesName = h.name.includes(searchQuery);
            const matchesResult = resultFilter === 'All' || h.result.includes(resultFilter);

            let matchesDate = true;
            if (h.lastCheck !== '-') {
                matchesDate = h.lastCheck >= startDate && h.lastCheck <= endDate;
            } else {
                matchesDate = false;
            }

            return matchesName && matchesDate && matchesResult;
        });
    }, [records, searchQuery, startDate, endDate, resultFilter]);

    // 통계 계산
    const stats = useMemo(() => {
        return {
            total: filtered.length,
            normal: filtered.filter(r => r.result.includes('양호') || r.result.includes('경미')).length,
            caution: filtered.filter(r => r.result.includes('주의')).length,
            risk: filtered.filter(r => r.result.includes('위험')).length,
            retest: filtered.filter(r => r.result.includes('재검')).length,
        };
    }, [filtered]);

    // CRUD 핸들러
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('정말로 이 건강 검진 기록을 삭제하시겠습니까?')) {
            setRecords(records.filter(r => r.id !== id));
            if (selectedRecord?.id === id) setSelectedRecord(null);
        }
    };

    const handleEditStart = () => {
        if (!selectedRecord) return;
        setEditForm({ ...selectedRecord });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editForm) return;
        setRecords(records.map(r => r.id === editForm.id ? editForm : r));
        setSelectedRecord(editForm);
        setIsEditing(false);
        setEditForm(null);
        alert('기록이 수정되었습니다.');
    };

    const StatCard = ({ label, value, icon: Icon, colorClass, subLabel }) => (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{label}</span>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-400 font-medium">명</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{subLabel}</p>
            </div>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label="정상 (양호/경미)"
                    value={stats.normal}
                    icon={CheckCircle2}
                    colorClass="bg-green-50 text-green-600"
                    subLabel="건강 상태가 양호한 인원"
                />
                <StatCard
                    label="주의 (유소견)"
                    value={stats.caution}
                    icon={AlertTriangle}
                    colorClass="bg-orange-50 text-orange-600"
                    subLabel="추적 관찰이 필요한 인원"
                />
                <StatCard
                    label="위험 (질환의심)"
                    value={stats.risk}
                    icon={AlertCircle}
                    colorClass="bg-red-50 text-red-600"
                    subLabel="정밀 검사가 필요한 인원"
                />
                <StatCard
                    label="재검 필요"
                    value={stats.retest}
                    icon={RefreshCw}
                    colorClass="bg-purple-50 text-purple-600"
                    subLabel="재검사가 확정된 인원"
                />
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="직원 이름 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:border-black transition-colors shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={resultFilter}
                            onChange={(e) => setResultFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:border-black transition-colors shadow-sm appearance-none bg-white cursor-pointer"
                        >
                            <option value="All">판정 결과 전체</option>
                            <option value="정상">정상</option>
                            <option value="주의">유소견 (주의)</option>
                            <option value="위험">유소견 (위험)</option>
                            <option value="재검">재검 필요</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mr-1">검진일</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600 font-medium"
                        />
                        <ArrowRight size={12} className="text-gray-300 mx-1" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-600 font-medium"
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSearchQuery('');
                        setResultFilter('All');
                        setStartDate(formatDate(oneYearAgo));
                        setEndDate(formatDate(today));
                    }}
                    className="text-xs text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest"
                >
                    필터 초기화
                </button>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mb-10">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">이름</th>
                            <th className="px-6 py-3">최근 검진일</th>
                            <th className="px-6 py-3">검진 기관</th>
                            <th className="px-6 py-3 text-center">결과 판정</th>
                            <th className="px-6 py-3 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filtered.length > 0 ? filtered.map(rec => (
                            <tr
                                key={rec.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => { setSelectedRecord(rec); setIsEditing(false); }}
                            >
                                <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {rec.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {rec.lastCheck}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {rec.hospital}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs border font-bold ${getHealthResultStyle(rec.result)}`}>
                                        {rec.result}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedRecord(rec); handleEditStart(); }}
                                            className="p-1.5 hover:bg-white rounded border border-gray-200 text-gray-500 hover:text-blue-600 shadow-sm"
                                            title="기록 수정"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(rec.id, e)}
                                            className="p-1.5 hover:bg-white rounded border border-gray-200 text-gray-500 hover:text-red-600 shadow-sm"
                                            title="기록 삭제"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 text-sm font-medium">
                                    선택한 기간 및 검색 조건에 맞는 건강 기록이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail / Edit Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedRecord(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600" />
                                {isEditing ? '기록 수정' : '건강검진 상세 내역'}
                            </h3>
                            <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {isEditing && editForm ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">성명</label>
                                        <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" value={editForm.name} disabled />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">검진일</label>
                                            <input type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" value={editForm.lastCheck} onChange={e => setEditForm({ ...editForm, lastCheck: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">검진 기관</label>
                                            <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" value={editForm.hospital} onChange={e => setEditForm({ ...editForm, hospital: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">종합 판정</label>
                                        <select
                                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                            value={editForm.result}
                                            onChange={e => setEditForm({ ...editForm, result: e.target.value })}
                                        >
                                            <option value="정상 (양호)">정상 (양호)</option>
                                            <option value="정상 (경미)">정상 (경미)</option>
                                            <option value="유소견 (주의)">유소견 (주의)</option>
                                            <option value="유소견 (위험)">유소견 (위험)</option>
                                            <option value="재검 필요">재검 필요</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">다음 검진 예정일</label>
                                        <input type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" value={editForm.nextCheck} onChange={e => setEditForm({ ...editForm, nextCheck: e.target.value })} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">성명</label>
                                            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                <User size={14} className="text-gray-500" /> {selectedRecord.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">최근 검진일</label>
                                            <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-500" /> {selectedRecord.lastCheck}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">검진 기관</label>
                                            <div className="text-sm text-gray-800 font-medium">{selectedRecord.hospital}</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">종합 판정</label>
                                            <div className={`inline-block px-2 py-0.5 rounded text-xs border font-bold ${getHealthResultStyle(selectedRecord.result)}`}>
                                                {selectedRecord.result}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-500">첨부 파일</span>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-600 rounded">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {selectedRecord.name}_건강검진결과표.pdf
                                                    </div>
                                                    <div className="text-xs text-gray-400">2.4 MB</div>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 group-hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2 text-[11px] text-gray-400 leading-relaxed bg-blue-50/50 p-3 rounded text-center">
                                        * 관리자는 모든 건강 정보를 확인하고 수정할 권한이 있습니다.
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-6 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-sm transition-colors"
                                    >
                                        변경사항 저장
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={(e) => handleDelete(selectedRecord.id, e)}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                    >
                                        <Trash2 size={14} /> 삭제
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleEditStart}
                                            className="px-4 py-2 text-sm border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors"
                                        >
                                            수정하기
                                        </button>
                                        <button
                                            onClick={() => setSelectedRecord(null)}
                                            className="px-6 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-sm transition-colors"
                                        >
                                            확인
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
