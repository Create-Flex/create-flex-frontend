import React from 'react';
import { Scale, FileSpreadsheet, Clock, CheckCircle2 } from 'lucide-react';

export const SupportTab = ({ onOpenSupportModal, supportRequests = [] }) => {
    // Sort requests by date (newest first)
    const sortedRequests = [...supportRequests].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    return (
        <div className="animate-[fadeIn_0.2s_ease-out] grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Legal */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">법률 자문 연결</h3>
                        <p className="text-sm text-gray-500">전속 계약서 검토 및 저작권 분쟁 상담</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                        <p className="mb-2 font-bold">주요 지원 항목:</p>
                        <ul className="list-disc pl-4 space-y-1 text-gray-600">
                            <li>신규/갱신 계약서 법률 검토</li>
                            <li>악성 댓글 및 명예훼손 고소 대행</li>
                            <li>저작권 및 초상권 침해 대응</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => onOpenSupportModal('legal')}
                        className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        법률 상담 신청하기
                    </button>
                </div>
            </div>

            {/* Tax */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <FileSpreadsheet size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">세무/회계 지원</h3>
                        <p className="text-sm text-gray-500">종합소득세 신고 및 정산 내역 관리</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                        <p className="mb-2 font-bold">주요 지원 항목:</p>
                        <ul className="list-disc pl-4 space-y-1 text-gray-600">
                            <li>월별 수익 정산서 검토 및 발행</li>
                            <li>종합소득세/부가가치세 신고 대행 연결</li>
                            <li>비용 처리 및 절세 가이드 제공</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => onOpenSupportModal('tax')}
                        className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        세무 상담 신청하기
                    </button>
                </div>
            </div>

            {/* My Application History Section - Spanning both columns */}
            <div className="col-span-1 lg:col-span-2 mt-4 pt-4 border-t border-gray-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <Clock size={20} className="text-gray-400" /> 나의 신청 내역
                    </h3>
                    <p className="text-sm text-gray-500">담당 크리에이터를 위해 신청한 지원 서비스의 진행 상태를 확인하세요.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">신청일</th>
                                <th className="px-6 py-4 text-center">유형</th>
                                <th className="px-6 py-4">대상 크리에이터</th>
                                <th className="px-6 py-4 w-1/3">제목</th>
                                <th className="px-6 py-4 text-center">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {sortedRequests.length > 0 ? (
                                sortedRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 font-mono">{req.requestDate}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${req.type === 'legal' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                                {req.type === 'legal' ? '법률' : '세무'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{req.creatorName}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{req.title}</td>
                                        <td className="px-6 py-4 text-center">
                                            {req.status === '완료' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                                                    <CheckCircle2 size={12} /> 완료
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
                                                    <Clock size={12} /> {req.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                        신청 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
