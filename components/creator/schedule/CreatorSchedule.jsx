import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { CreatorCalendar } from '../shared/Calendar';
import { getCreatorColorStyles } from '../shared/utils';
import { EventDetailModal } from '../../employee/modals/EventDetailModal';
import { scheduleService } from '../../../api/scheduleService';
import * as S from './CreatorSchedule.styled';

export const CreatorSchedule = ({
    creator,
    creators,
    events,
    onUpdateEvents
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
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
        { id: 'etc', label: '기타' },
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

    const handleSaveEvent = async () => {
        if (!newEventData.title) {
            toast.error('일정 제목을 입력해주세요.');
            return;
        }

        if (newEventData.type === 'joint' && newEventData.partnerCreators.length === 0) {
            toast.error('합방할 크리에이터를 최소 1명 이상 선택해주세요.');
            return;
        }

        try {
            const payload = {
                scheduleName: newEventData.title,
                scheduleDate: newEventData.date,
                scheduleDetail: newEventData.content,
                scheduleType: newEventData.type.toUpperCase() === 'JOINT' ? 'MERGE' : newEventData.type.toUpperCase(),
                creatorId: creator.id,
                visitorIds: newEventData.type === 'joint' ? newEventData.partnerCreators : []
            };

            await scheduleService.createSchedule(payload);
            onUpdateEvents();
            setIsEventModalOpen(false);
            toast.success('일정이 등록되었습니다.');
        } catch (error) {
            console.error('일정 등록 실패:', error);
            toast.error('일정 등록에 실패했습니다.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            try {
                await scheduleService.deleteSchedule(eventId);
                onUpdateEvents();
                setSelectedEvent(null);
                toast.success('일정이 삭제되었습니다.');
            } catch (error) {
                console.error('일정 삭제 실패:', error);
                toast.error('일정 삭제에 실패했습니다.');
            }
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