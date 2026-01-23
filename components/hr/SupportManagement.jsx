import React, { useState } from 'react';
import { Search, Scale, FileSpreadsheet, CheckCircle2, Clock, CheckSquare, Plus } from 'lucide-react';

export const SupportManagement = ({ requests, onUpdateRequest }) => {
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    const filteredRequests = requests.filter(req => {
        if (filter !== 'all' && req.type !== filter) return false;
        if (statusFilter === 'active' && req.status === '완료') return false;
        if (statusFilter === 'completed' && req.status !== '완료') return false;
        return true;
    });

    const handleStatusChange = (id, newStatus) => {
        onUpdateRequest(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}>전체</button>
                    <button onClick={() => setFilter('legal')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === 'legal' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}>법률</button>
                    <button onClick={() => setFilter('tax')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === 'tax' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200'}`}>세무</button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setStatusFilter('all')} className={`text-xs font-bold px-2 py-1 ${statusFilter === 'all' ? 'text-black' : 'text-gray-400'}`}>전체보기</button>
                    <button onClick={() => setStatusFilter('active')} className={`text-xs font-bold px-2 py-1 ${statusFilter === 'active' ? 'text-black' : 'text-gray-400'}`}>진행중</button>
                    <button onClick={() => setStatusFilter('completed')} className={`text-xs font-bold px-2 py-1 ${statusFilter === 'completed' ? 'text-black' : 'text-gray-400'}`}>완료됨</button>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredRequests.length > 0 ? filteredRequests.map(req => (
                    <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4 hover:border-gray-300 transition-all">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${req.type === 'legal' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {req.type === 'legal' ? <Scale size={24} /> : <FileSpreadsheet size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${req.type === 'legal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {req.type === 'legal' ? 'LEGAL' : 'TAX'}
                                    </span>
                                    <span className="text-xs text-gray-400">{req.requestDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-700 mr-2">{req.creatorName}</span>
                                    {req.status === '접수' && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">접수됨</span>}
                                    {req.status === '진행중' && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Clock size={10} /> 진행중</span>}
                                    {req.status === '완료' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={10} /> 완료됨</span>}
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{req.title}</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">{req.content}</p>

                            {req.status !== '완료' && (
                                <div className="mt-4 flex gap-2 justify-end">
                                    {req.status === '접수' && (
                                        <button
                                            onClick={() => handleStatusChange(req.id, '진행중')}
                                            className="text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                                        >
                                            진행 처리
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusChange(req.id, '완료')}
                                        className="text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                                    >
                                        <CheckSquare size={12} /> 완료 처리
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        해당하는 요청 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};
