import React, { useState } from 'react';
import {
    CalendarIcon,
    X,
    CheckCircle2,
    AlertCircle,
    User as UserIcon,
} from 'lucide-react';
import { UserRole } from '../enums';
import { INITIAL_AD_PROPOSALS } from './creator/shared/constants';
import { getCreatorColorStyles } from './creator/shared/utils';

import { CalendarTab } from './employee/creator/CalendarTab';
import { CreatorListTab } from './employee/creator/CreatorListTab';
import { AdsTab } from './employee/creator/AdsTab';
import { HealthTab } from './employee/creator/HealthTab';
import { SupportTab } from './employee/creator/SupportTab';

export const EmployeeCreatorView = ({
    user,
    creators,
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    events,
    onUpdateEvents,
    onAddSupportRequest,
    currentView,
    allTasks,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    supportRequests,
}) => {
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [adProposals, setAdProposals] = useState(INITIAL_AD_PROPOSALS);
    const [adFilter, setAdFilter] = useState('pending');

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success',
    });

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [supportModal, setSupportModal] = useState({ open: false, type: 'legal' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

    const [supportForm, setSupportForm] = useState({
        creatorId: '',
        title: '',
        content: '',
    });

    const [newEventData, setNewEventData] = useState({
        creatorId: '',
        title: '',
        date: '',
        type: 'content',
        content: '',
        partnerCreators: [],
    });

    const [newAdData, setNewAdData] = useState({
        brandName: '',
        campaignTitle: '',
        budget: '',
        creatorId: '',
        description: '',
        targetDate: new Date().toISOString().split('T')[0],
    });

    const myCreators = creators.filter(c => c.manager === user.name || user.role === UserRole.ADMIN);
    const creatorsMap = creators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    const myCreatorsMap = myCreators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    const allMyEvents = events.filter(e => myCreatorsMap[e.creatorId]);

    const potentialPartners = creators.filter(c => c.id !== newEventData.creatorId && c.name.includes(partnerSearchQuery));

    const handleEventClick = (event) => setSelectedEvent(event);

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            onUpdateEvents(events.filter(e => e.id !== eventId));
            setSelectedEvent(null);
            showToastMessage('일정이 삭제되었습니다.');
        }
    };

    const handleOpenEventModal = (date) => {
        if (myCreators.length === 0) return;
        setNewEventData({
            creatorId: selectedCreatorId || (myCreators[0] ? myCreators[0].id : ''),
            title: '',
            date: date || new Date().toISOString().split('T')[0],
            type: 'content',
            content: '',
            partnerCreators: [],
        });
        setPartnerSearchQuery('');
        setIsEventModalOpen(true);
    };

    const togglePartnerCreator = (creatorId) => {
        setNewEventData(prev => {
            const exists = prev.partnerCreators.includes(creatorId);
            return {
                ...prev,
                partnerCreators: exists
                    ? prev.partnerCreators.filter(id => id !== creatorId)
                    : [...prev.partnerCreators, creatorId],
            };
        });
    };

    const handleSaveEvent = () => {
        if (!newEventData.title || !newEventData.creatorId) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const eventsToCreate = [];

        // 1. Main event for the host creator
        const mainEvent = {
            id: Date.now().toString(),
            creatorId: newEventData.creatorId,
            hostCreatorId: newEventData.creatorId, // Original Host
            title: newEventData.title,
            date: newEventData.date,
            type: newEventData.type,
            content: newEventData.content,
            partnerCreators: newEventData.type === 'joint' ? newEventData.partnerCreators : [],
        };
        eventsToCreate.push(mainEvent);

        // 2. Partner events (if joint)
        if (newEventData.type === 'joint' && newEventData.partnerCreators.length > 0) {
            const hostCreator = creators.find(c => c.id === newEventData.creatorId);
            const hostName = hostCreator ? hostCreator.name : '알 수 없음';

            newEventData.partnerCreators.forEach((partnerId, index) => {
                const partnerEvent = {
                    id: (Date.now() + index + 1).toString(), // Unique ID
                    creatorId: partnerId,
                    hostCreatorId: newEventData.creatorId, // Explicitly set Host ID
                    title: `[합방] ${newEventData.title}`,
                    date: newEventData.date,
                    type: 'joint',
                    content: `주최: ${hostName}\n내용: ${newEventData.content}`,
                    partnerCreators: [newEventData.creatorId, ...newEventData.partnerCreators.filter(id => id !== partnerId)],
                };
                eventsToCreate.push(partnerEvent);
            });
        }

        onUpdateEvents([...events, ...eventsToCreate]);
        setIsEventModalOpen(false);
    };

    const showToastMessage = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleAdDecision = (id, decision) => {
        const ad = adProposals.find(a => a.id === id);
        setAdProposals(prev => prev.map(p => (p.id === id ? { ...p, status: decision } : p)));
        if (decision === 'accepted' && ad) {
            const newEvent = {
                id: Date.now().toString(),
                creatorId: ad.creatorId,
                title: `[광고] ${ad.campaignTitle}`,
                date: ad.targetDate || new Date().toISOString().split('T')[0],
                type: 'content',
                content: `광고주: ${ad.brandName}\n예산: ${ad.budget}\n내용: ${ad.description}`,
            };
            onUpdateEvents([...events, newEvent]);
            showToastMessage('제안이 수락되어 일정에 등록되었습니다.');
        } else {
            showToastMessage('제안이 거절되었습니다.', 'error');
        }
    };

    const handleAddAd = () => {
        if (!newAdData.brandName || !newAdData.campaignTitle || !newAdData.budget || !newAdData.creatorId) {
            alert('필수 정보를 입력해주세요.');
            return;
        }
        const newAd = {
            id: Date.now().toString(),
            creatorId: newAdData.creatorId,
            brandName: newAdData.brandName,
            campaignTitle: newAdData.campaignTitle,
            budget: newAdData.budget,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
            description: newAdData.description || '',
            targetDate: newAdData.targetDate,
        };
        setAdProposals([newAd, ...adProposals]);
        setIsAdModalOpen(false);
        showToastMessage('새로운 캠페인이 등록되었습니다.');
    };

    const handleSupportRequest = () => {
        if (!supportForm.creatorId || !supportForm.title || !supportForm.content) {
            alert('필수 정보를 입력해주세요.');
            return;
        }
        const selectedCreator = creators.find(c => c.id === supportForm.creatorId);
        if (onAddSupportRequest && selectedCreator) {
            onAddSupportRequest({
                id: Date.now().toString(),
                creatorId: selectedCreator.id,
                creatorName: selectedCreator.name,
                type: supportModal.type,
                title: supportForm.title,
                content: supportForm.content,
                requestDate: new Date().toISOString().split('T')[0],
                status: '접수',
            });
        }
        showToastMessage(`${supportModal.type === 'legal' ? '법률' : '세무'} 상담 신청이 완료되었습니다.`);
        setSupportModal({ ...supportModal, open: false });
    };

    const myAdProposals = adProposals.filter(ad => myCreators.map(c => c.id).includes(ad.creatorId));
    const filteredAds = myAdProposals.filter(ad => {
        if (adFilter === 'all') return true;
        if (adFilter === 'pending') return ad.status === 'pending';
        if (adFilter === 'history') return ad.status !== 'pending';
        return true;
    });

    const activeTab =
        currentView === 'employee-creator-list' ? 'list' :
            currentView === 'employee-creator-ads' ? 'ads' :
                currentView === 'employee-creator-health' ? 'health' :
                    currentView === 'employee-creator-support' ? 'support' : 'calendar';

    return (
        <div className="flex-1 h-screen overflow-hidden flex flex-col bg-white relative animate-[fadeIn_0.3s_ease-out]">
            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="max-w-[1600px] mx-auto min-h-full">
                    {activeTab === 'calendar' && (
                        <CalendarTab
                            allMyEvents={allMyEvents}
                            creatorsMap={creatorsMap}
                            currentDate={currentDate}
                            onDateChange={setCurrentDate}
                            onAddEvent={handleOpenEventModal}
                            onEventClick={handleEventClick}
                            myCreators={myCreators}
                        />
                    )}

                    {activeTab === 'list' && (
                        <CreatorListTab
                            selectedCreatorId={selectedCreatorId}
                            setSelectedCreatorId={setSelectedCreatorId}
                            myCreators={myCreators}
                            allTasks={allTasks}
                            events={events}
                            onAddEvent={handleOpenEventModal}
                            onEventClick={handleEventClick}
                            onAddTask={onAddTask}
                            onToggleTask={onToggleTask}
                            onDeleteTask={onDeleteTask}
                        />
                    )}

                    {activeTab === 'ads' && (
                        <AdsTab
                            filteredAds={filteredAds}
                            adFilter={adFilter}
                            setAdFilter={setAdFilter}
                            myAdProposals={myAdProposals}
                            onAdDecision={handleAdDecision}
                            setIsAdModalOpen={setIsAdModalOpen}
                            creators={creators}
                        />
                    )}

                    {activeTab === 'health' && (
                        <HealthTab
                            myCreators={myCreators}
                            healthRecords={healthRecords}
                            onUpdateHealthRecords={onUpdateHealthRecords}
                            issueLogs={issueLogs}
                            onUpdateIssueLogs={onUpdateIssueLogs}
                        />
                    )}

                    {activeTab === 'support' && (
                        <SupportTab
                            onOpenSupportModal={(type) => setSupportModal({ open: true, type })}
                            supportRequests={supportRequests}
                        />
                    )}
                </div>
            </div>


            {/* Support Request Modal */}
            {supportModal.open && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSupportModal({ ...supportModal, open: false })}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {supportModal.type === 'legal' ? '법률 자문 신청' : '세무 상담 신청'}
                            </h3>
                            <button onClick={() => setSupportModal({ ...supportModal, open: false })} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Guideline Box */}
                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100">
                                {supportModal.type === 'legal'
                                    ? '전속 계약서 검토, 저작권 분쟁, 악성 댓글 고소 등 법률적인 지원이 필요한 내용을 작성해주세요.'
                                    : '세금 신고, 정산서 발행, 비용 처리 등 세무/회계 관련 문의 사항을 작성해주세요.'}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">대상 크리에이터</label>
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all appearance-none"
                                    value={supportForm.creatorId}
                                    onChange={e => setSupportForm({ ...supportForm, creatorId: e.target.value })}
                                >
                                    <option value="">크리에이터 선택</option>
                                    {myCreators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">제목</label>
                                <input
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all"
                                    placeholder="상담 제목을 입력하세요"
                                    value={supportForm.title}
                                    onChange={e => setSupportForm({ ...supportForm, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">상담 요청 내용</label>
                                <textarea
                                    rows={5}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm resize-none transition-all placeholder:text-gray-300"
                                    placeholder="구체적인 내용을 입력해주세요."
                                    value={supportForm.content}
                                    onChange={e => setSupportForm({ ...supportForm, content: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setSupportModal({ ...supportModal, open: false })} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors">취소</button>
                            <button onClick={handleSupportRequest} className="px-6 py-2.5 text-sm bg-black text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                신청하기
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 모달 및 토스트는 동일하게 유지 */}
            {isEventModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={20} className="text-blue-600" />
                                <h3 className="font-bold text-gray-900 text-lg">새 일정 추가</h3>
                            </div>
                            <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">일정 제목</label>
                                <input autoFocus className="w-full text-lg font-bold border-b-2 border-gray-100 focus:border-blue-500 py-1 focus:outline-none transition-colors placeholder:text-gray-200" placeholder="제목을 입력하세요" value={newEventData.title} onChange={e => setNewEventData({ ...newEventData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">주최 크리에이터</label>
                                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white transition-all shadow-sm" value={newEventData.creatorId} onChange={e => setNewEventData({ ...newEventData, creatorId: e.target.value })}>
                                    <option value="">선택하세요</option>
                                    {myCreators.map(c => <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">날짜 선택</label>
                                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm" value={newEventData.date} onChange={e => setNewEventData({ ...newEventData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">유형 선택</label>
                                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm" value={newEventData.type} onChange={e => setNewEventData({ ...newEventData, type: e.target.value })}>
                                        <option value="content">콘텐츠</option>
                                        <option value="live">라이브</option>
                                        <option value="meeting">미팅</option>
                                        <option value="joint">합방</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>
                            </div>

                            {newEventData.type === 'joint' && (
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 animate-[fadeIn_0.2s_ease-out]">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-3">
                                        <UserIcon size={14} /> 합방 참여 크리에이터 선택 (최소 1명)
                                    </h4>

                                    <div className="relative mb-3">
                                        <input
                                            className="w-full bg-white border border-purple-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-400"
                                            placeholder="이름으로 검색..."
                                            value={partnerSearchQuery}
                                            onChange={e => setPartnerSearchQuery(e.target.value)}
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </div>
                                    </div>

                                    <div className="space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                                        {potentialPartners.length > 0 ? potentialPartners.map(creator => {
                                            const isSelected = newEventData.partnerCreators.includes(creator.id);
                                            return (
                                                <div
                                                    key={creator.id}
                                                    onClick={() => togglePartnerCreator(creator.id)}
                                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${isSelected
                                                        ? 'bg-white border-purple-200 shadow-sm'
                                                        : 'hover:bg-purple-100/50 border-transparent'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                                            {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover" /> : null}
                                                        </div>
                                                        <span className={`text-sm ${isSelected ? 'font-bold text-purple-900' : 'text-gray-600'}`}>
                                                            {creator.name}
                                                        </span>
                                                    </div>
                                                    {isSelected && <CheckCircle2 size={16} className="text-purple-600" />}
                                                </div>
                                            );
                                        }) : (
                                            <div className="text-center py-4 text-xs text-gray-400">검색 결과가 없습니다.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">상세 내용</label>
                                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm resize-none" placeholder="상세 정보를 입력하세요" value={newEventData.content} onChange={e => setNewEventData({ ...newEventData, content: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsEventModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors">취소</button>
                            <button onClick={handleSaveEvent} className="px-8 py-2.5 text-sm bg-black text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]">등록 완료</button>
                        </div>
                    </div>
                </div>
            )}

            {isAdModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAdModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 text-lg">광고 캠페인 등록</h3>
                            <button onClick={() => setIsAdModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
                            <div>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all" placeholder="광고주 (브랜드명)" value={newAdData.brandName} onChange={e => setNewAdData({ ...newAdData, brandName: e.target.value })} />
                            </div>
                            <div>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all" placeholder="제품 / 캠페인명" value={newAdData.campaignTitle} onChange={e => setNewAdData({ ...newAdData, campaignTitle: e.target.value })} />
                            </div>
                            <div>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all" placeholder="제안 단가" value={newAdData.budget} onChange={e => setNewAdData({ ...newAdData, budget: e.target.value })} />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all appearance-none" value={newAdData.creatorId} onChange={e => setNewAdData({ ...newAdData, creatorId: e.target.value })}>
                                        <option value="">담당 크리에이터 선택</option>
                                        {myCreators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm transition-all" value={newAdData.targetDate} onChange={e => setNewAdData({ ...newAdData, targetDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white shadow-sm resize-none transition-all" placeholder="상세 내용" value={newAdData.description} onChange={e => setNewAdData({ ...newAdData, description: e.target.value })} />
                            </div>
                            <p className="text-xs text-gray-500">* 등록된 목표 일정은 제안 수락 시 일정에 자동 반영됩니다.</p>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsAdModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors">취소</button>
                            <button onClick={handleAddAd} className="px-8 py-2.5 text-sm bg-black text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]">등록하기</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className={`h-2 w-full ${getCreatorColorStyles(selectedEvent.creatorId).dot}`}></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1"><CalendarIcon size={14} /> {selectedEvent.date}</p>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{selectedEvent.content}</div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="flex-1 py-2.5 text-sm text-red-500 hover:bg-red-50 border border-red-100 rounded-xl font-bold transition-colors">삭제</button>
                                <button onClick={() => setSelectedEvent(null)} className="flex-[2] py-2.5 text-sm bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-[fadeIn_0.2s_ease-out]">
                    {toast.type === 'success' ? <CheckCircle2 size={20} className="text-[#00C471]" /> : <AlertCircle size={20} className="text-red-400" />}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}
        </div>
    );
};
