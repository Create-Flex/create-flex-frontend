import React, { useState } from 'react';
import { CalendarIcon, Plus, X, Trash2 } from 'lucide-react';
import { CreatorCalendar } from '../shared/Calendar';
import { getCreatorColorStyles } from '../shared/utils';

export const CreatorSchedule = ({
    creator,
    creators,
    events,
    onUpdateEvents
}) => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

    const [newEventData, setNewEventData] = useState({
        title: '',
        date: '',
        type: 'content',
        content: '',
        partnerCreators: []
    });

    const EVENT_TYPES = [
        { id: 'content', label: '콘텐츠' },
        { id: 'live', label: '라이브' },
        { id: 'meeting', label: '미팅' },
        { id: 'other', label: '기타' },
    ];

    // Improved Filtering: Strictly include only my own events
    // This works because joint events are duplicated for each participant with their own ID.
    const myEvents = events.filter(e => e.creatorId === creator.id);

    // Show all creators in joint broadcasts for proper color mapping
    const creatorsMap = creators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    const potentialPartners = creators.filter(c => c.id !== creator.id && c.name.includes(partnerSearchQuery));

    const handleOpenEventModal = (date) => {
        setNewEventData({
            title: '',
            date: date || new Date().toISOString().split('T')[0],
            type: 'content',
            content: '',
            partnerCreators: []
        });
        setPartnerSearchQuery('');
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (!newEventData.title) {
            alert('일정 제목을 입력해주세요.');
            return;
        }

        if (newEventData.type === 'joint' && newEventData.partnerCreators.length === 0) {
            alert('합방할 크리에이터를 최소 1명 이상 선택해주세요.');
            return;
        }

        const newEvent = {
            id: Date.now().toString(),
            creatorId: creator.id, // Always assign to self
            title: newEventData.title,
            date: newEventData.date,
            type: newEventData.type,
            content: newEventData.content,
            partnerCreators: newEventData.type === 'joint' ? newEventData.partnerCreators : []
        };

        onUpdateEvents([...events, newEvent]);
        setIsEventModalOpen(false);
    };

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            onUpdateEvents(events.filter(e => e.id !== eventId));
            setSelectedEvent(null);
        }
    };

    const togglePartnerCreator = (creatorId) => {
        setNewEventData(prev => {
            const exists = prev.partnerCreators.includes(creatorId);
            return {
                ...prev,
                partnerCreators: exists
                    ? prev.partnerCreators.filter(id => id !== creatorId)
                    : [...prev.partnerCreators, creatorId]
            };
        });
    };

    return (
        <div className="flex-1 h-screen overflow-hidden flex flex-col bg-white relative">
            <div className="px-8 pt-8 pb-6 shrink-0 border-b border-gray-100">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <CalendarIcon className="text-gray-800" size={32} />
                                나의 일정
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                {`반가워요, ${creator.name}님! 오늘 일정을 관리해보세요.`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleOpenEventModal()}
                                className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
                            >
                                <Plus size={16} />
                                일정 추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="max-w-[1600px] mx-auto">
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="w-full">
                            <CreatorCalendar
                                events={myEvents}
                                creatorsMap={creatorsMap}
                                currentDate={currentDate}
                                onDateChange={setCurrentDate}
                                onAddEvent={handleOpenEventModal}
                                onEventClick={setSelectedEvent}
                                readOnly={false}
                                legendCreators={[creator]} // Only show me in the legend
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Addition Modal (Creator Flow) */}
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
                                <input
                                    autoFocus
                                    className="w-full text-lg font-bold border-b-2 border-gray-100 focus:border-blue-500 py-1 focus:outline-none transition-colors placeholder:text-gray-200"
                                    placeholder="제목을 입력하세요"
                                    value={newEventData.title}
                                    onChange={e => setNewEventData({ ...newEventData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">날짜 선택</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm"
                                        value={newEventData.date}
                                        onChange={e => setNewEventData({ ...newEventData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">유형 선택</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm"
                                        value={newEventData.type}
                                        onChange={e => setNewEventData({ ...newEventData, type: e.target.value })}
                                    >
                                        {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">상세 내용</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white shadow-sm resize-none"
                                    placeholder="일정 관련 상세 정보를 입력하세요"
                                    value={newEventData.content}
                                    onChange={e => setNewEventData({ ...newEventData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEventModalOpen(false)}
                                className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className="px-8 py-2.5 text-sm bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                등록 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Event View Modal (Detail View for Creator) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className={`h-2 w-full ${getCreatorColorStyles(selectedEvent.creatorId).dot}`}></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 inline-block ${selectedEvent.type === 'joint' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        selectedEvent.type === 'live' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {EVENT_TYPES.find(t => t.id === selectedEvent.type)?.label || '일정'}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                        <CalendarIcon size={14} /> {selectedEvent.date}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm flex-shrink-0">
                                        {creatorsMap[selectedEvent.hostCreatorId || selectedEvent.creatorId]?.avatarUrl ? <img src={creatorsMap[selectedEvent.hostCreatorId || selectedEvent.creatorId].avatarUrl} className="w-full h-full object-cover" alt={creatorsMap[selectedEvent.hostCreatorId || selectedEvent.creatorId]?.name} /> : <div className="p-2 text-gray-400 bg-white w-full h-full flex items-center justify-center"><CalendarIcon size={20} /></div>}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs text-gray-400">주최</div>
                                        <div className="text-sm font-bold text-gray-800 truncate">{creatorsMap[selectedEvent.hostCreatorId || selectedEvent.creatorId]?.name || '알 수 없음'}</div>
                                    </div>
                                </div>

                                {selectedEvent.partnerCreators && selectedEvent.partnerCreators.length > 0 && (
                                    <div>
                                        <div className="text-xs text-gray-400 font-bold mb-2 ml-1">참여 파트너</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedEvent.partnerCreators.map(pid => (
                                                <div key={pid} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg border border-purple-100 text-xs font-medium">
                                                    <div className="w-4 h-4 rounded-full bg-purple-200 overflow-hidden">
                                                        {creatorsMap[pid]?.avatarUrl && <img src={creatorsMap[pid].avatarUrl} className="w-full h-full object-cover" alt={creatorsMap[pid]?.name} />}
                                                    </div>
                                                    {creatorsMap[pid]?.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEvent.content && (
                                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {selectedEvent.content}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {selectedEvent.creatorId === creator.id && (
                                    <button
                                        onClick={() => handleDeleteEvent(selectedEvent.id)}
                                        className="flex-1 py-2.5 text-sm text-red-500 hover:bg-red-50 border border-red-100 rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Trash2 size={16} /> 삭제
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="flex-[2] py-2.5 text-sm bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
