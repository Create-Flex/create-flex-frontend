import React, { useState, useRef } from 'react';
import { FileText, Download, Upload, X } from 'lucide-react';

export const ContractManagement = ({ creators }) => {
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractForm, setContractForm] = useState({
        title: '',
        creatorName: '',
        startDate: '',
        endDate: ''
    });
    const fileContractInputRef = useRef(null);
    const [contractFile, setContractFile] = useState(null);

    const handleContractSubmit = () => {
        if (!contractForm.title || !contractForm.creatorName) {
            alert('필수 정보를 입력해주세요.');
            return;
        }
        alert('계약서가 성공적으로 등록되었습니다.');
        setIsContractModalOpen(false);
        setContractForm({ title: '', creatorName: '', startDate: '', endDate: '' });
        setContractFile(null);
    };

    return (
        <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">계약 문서 현황</h3>
                        <p className="text-sm text-gray-500">전속 계약 및 광고 계약 문서를 통합 관리합니다.</p>
                    </div>
                    <button
                        onClick={() => setIsContractModalOpen(true)}
                        className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                    >
                        + 새 계약서 작성
                    </button>
                </div>

                <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden shadow-sm">
                    {creators.map(creator => (
                        <div key={creator.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
                                        {creator.name} 표준 전속 계약서
                                    </div>
                                    <div className="text-xs text-gray-400 flex items-center gap-2">
                                        <span className="font-medium text-gray-500">
                                            {creator.managementStartDate && creator.managementEndDate
                                                ? `${creator.managementStartDate} ~ ${creator.managementEndDate}`
                                                : '기간 미설정'}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{creator.channelName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg" title="다운로드">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contract Upload Modal */}
            {isContractModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsContractModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">새 계약서 등록</h3>
                            <button onClick={() => setIsContractModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">계약서 제목</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                    placeholder="예: 겜돌이 표준 전속 계약서"
                                    value={contractForm.title}
                                    onChange={e => setContractForm({ ...contractForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">크리에이터 이름</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                    placeholder="크리에이터 이름 입력"
                                    value={contractForm.creatorName}
                                    onChange={e => setContractForm({ ...contractForm, creatorName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">계약 시작일</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                        value={contractForm.startDate}
                                        onChange={e => setContractForm({ ...contractForm, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">계약 종료일</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                        value={contractForm.endDate}
                                        onChange={e => setContractForm({ ...contractForm, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">계약서 파일 첨부</label>
                                <div
                                    className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                    onClick={() => fileContractInputRef.current?.click()}
                                >
                                    <Upload size={20} className="mb-2" />
                                    <span className="text-xs">{contractFile ? contractFile.name : '파일을 선택하세요 (PDF)'}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileContractInputRef}
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button onClick={() => setIsContractModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                            <button onClick={handleContractSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">등록하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
