import React from 'react';
import { Megaphone, Plus, DollarSign, Ban, CheckCircle2, User as UserIcon } from 'lucide-react';

export const AdsTab = ({
    filteredAds,
    adFilter,
    setAdFilter,
    myAdProposals,
    onAdDecision,
    setIsAdModalOpen,
    creators,
}) => {
    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">광고 캠페인 제안</h2>
                    <p className="text-sm text-gray-500">담당 크리에이터에게 들어온 광고 제안을 검토하고 연결해주세요.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAdFilter('pending')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'pending'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            대기중인 제안 ({myAdProposals.filter(a => a.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setAdFilter('history')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'history'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            처리 내역
                        </button>
                        <button
                            onClick={() => setAdFilter('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'all'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            전체 보기
                        </button>
                    </div>
                    <button
                        onClick={() => setIsAdModalOpen(true)}
                        className="ml-2 flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors"
                    >
                        <Plus size={14} /> 캠페인 등록
                    </button>
                </div>
            </div>
            {filteredAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAds.map(ad => {
                        const creator = creators.find(c => c.id === ad.creatorId);
                        return (
                            <div key={ad.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col h-full">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-xs font-bold text-gray-500">{ad.brandName}</div>
                                    <div className="text-[10px] text-gray-400">{ad.requestDate}</div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">{ad.campaignTitle}</h3>
                                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                        {creator?.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover" /> : <UserIcon className="p-1 text-gray-400" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold text-gray-800 truncate">{creator?.name || '알 수 없음'}</div>
                                        <div className="text-[10px] text-gray-500 truncate">구독자 {creator?.subscribers}</div>
                                    </div>
                                </div>
                                <div className="mb-4 flex-1">
                                    <div className="text-xs text-gray-500 mb-1">제안 금액</div>
                                    <div className="text-xl font-bold text-[#00C471] flex items-center gap-1"><DollarSign size={18} /> {ad.budget}</div>
                                    <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3">{ad.description}</div>
                                    <div className="mt-2 text-xs text-blue-600 font-medium">목표 일정: {ad.targetDate || '미정'}</div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 mt-auto">
                                    {ad.status === 'pending' ? (
                                        <div className="space-y-3">
                                            <div className="text-center"><span className="text-sm font-bold text-orange-600">제안 검토중</span></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => onAdDecision(ad.id, 'rejected')} className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"><Ban size={14} /> 거절</button>
                                                <button onClick={() => onAdDecision(ad.id, 'accepted')} className="flex-1 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"><CheckCircle2 size={14} /> 수락</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`text-center py-2 text-xs font-bold rounded-lg ${ad.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                                            {ad.status === 'accepted' ? '수락됨' : '거절됨'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                    <Megaphone size={48} className="mb-4 opacity-50" />
                    <div className="text-lg font-medium text-gray-500">해당하는 광고 제안이 없습니다.</div>
                    <p className="text-sm mt-1">새로운 제안이 들어오면 이곳에 표시됩니다.</p>
                </div>
            )}
        </div>
    );
};
