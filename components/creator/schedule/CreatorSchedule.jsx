import React, { useState } from 'react';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { CreatorCalendar } from '../shared/Calendar';
import { getCreatorColorStyles } from '../shared/utils';
import { EventDetailModal } from '../../employee/modals/EventDetailModal';
import * as S from './CreatorSchedule.styled';

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
        <S.Container>
            <S.Header>
                <S.HeaderContent>
                    <S.HeaderTop>
                        <S.TitleContainer>
                            <S.Title>
                                <CalendarIcon color="#1f2937" size={32} />
                                나의 일정
                            </S.Title>
                            <S.SubTitle>
                                {`반가워요, ${creator.name}님! 오늘 일정을 관리해보세요.`}
                            </S.SubTitle>
                        </S.TitleContainer>
                        <S.HeaderActions>
                            <S.AddButton onClick={() => handleOpenEventModal()}>
                                <Plus size={16} />
                                일정 추가
                            </S.AddButton>
                        </S.HeaderActions>
                    </S.HeaderTop>
                </S.HeaderContent>
            </S.Header>

            <S.ContentArea>
                <S.ContentWrapper>
                    <S.CalendarWrapper>
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
                    </S.CalendarWrapper>
                </S.ContentWrapper>
            </S.ContentArea>

            {/* Event Addition Modal (Creator Flow) */}
            {isEventModalOpen && (
                <S.ModalOverlay onClick={() => setIsEventModalOpen(false)}>
                    <S.ModalContainer onClick={e => e.stopPropagation()}>
                        <S.ModalHeader>
                            <S.ModalTitleWrapper>
                                <CalendarIcon size={20} color="#2563eb" />
                                <S.ModalTitle>새 일정 추가</S.ModalTitle>
                            </S.ModalTitleWrapper>
                            <S.CloseButton onClick={() => setIsEventModalOpen(false)}><X size={20} /></S.CloseButton>
                        </S.ModalHeader>

                        <S.ModalBody>
                            <S.FormRow>
                                <S.Label>일정 제목</S.Label>
                                <S.TitleInput
                                    autoFocus
                                    placeholder="제목을 입력하세요"
                                    value={newEventData.title}
                                    onChange={e => setNewEventData({ ...newEventData, title: e.target.value })}
                                />
                            </S.FormRow>

                            <S.GridRow>
                                <S.FormRow>
                                    <S.Label>날짜 선택</S.Label>
                                    <S.Input
                                        type="date"
                                        value={newEventData.date}
                                        onChange={e => setNewEventData({ ...newEventData, date: e.target.value })}
                                    />
                                </S.FormRow>
                                <S.FormRow>
                                    <S.Label>유형 선택</S.Label>
                                    <S.Select
                                        value={newEventData.type}
                                        onChange={e => setNewEventData({ ...newEventData, type: e.target.value })}
                                    >
                                        {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </S.Select>
                                </S.FormRow>
                            </S.GridRow>

                            <S.FormRow>
                                <S.Label>상세 내용</S.Label>
                                <S.TextArea
                                    rows={3}
                                    placeholder="일정 관련 상세 정보를 입력하세요"
                                    value={newEventData.content}
                                    onChange={e => setNewEventData({ ...newEventData, content: e.target.value })}
                                />
                            </S.FormRow>
                        </S.ModalBody>

                        <S.ModalFooter>
                            <S.CancelButton onClick={() => setIsEventModalOpen(false)}>
                                취소
                            </S.CancelButton>
                            <S.SaveButton onClick={handleSaveEvent}>
                                등록 완료
                            </S.SaveButton>
                        </S.ModalFooter>
                    </S.ModalContainer>
                </S.ModalOverlay>
            )}

            {/* Selected Event View Modal (Detail View for Creator) */}
            <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={selectedEvent?.creatorId === creator.id ? handleDeleteEvent : undefined}
                creators={creators}
            />
        </S.Container>
    );
};

