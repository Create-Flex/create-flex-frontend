import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Filter, Check } from 'lucide-react';
import { UserRole } from '../enums';
import { css } from 'styled-components';
import {
    Container, Header, HeaderLeft, Title, DateNavigation, NavButton, CurrentDate, TodayButton,
    HeaderRight, FilterBadge, FilterClearButton, OptionsContainer, OptionsButton, DropdownMenu, DropdownHeader, DropdownItem, Divider, AddEventButton,
    CalendarContainer, CalendarGrid, DayHeaderRow, DayHeader, DaysGrid, DayCell, DateNumber, EventsList, EventItem, EventContent, DeleteEventButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalHeaderSpacer, CloseModalButton, ModalBody, ModalFooter,
    TitleInput, FormRow, FormLabel, TemplateButtonContainer, TemplateButton, DateInput, ContentTextarea, SaveButton,
    DateNumberContainer, StyledCheck, FormStack
} from './ScheduleView.styled';

import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';
import { useScheduleStore } from '../stores/useScheduleStore';

const EVENT_COLORS = {
    blue: {
        bg: '#e0f2fe', text: '#0369a1', border: '#b9e6fe',
        style: css`background-color: #e0f2fe; color: #0369a1; border: 1px solid #b9e6fe;`
    },
    green: {
        bg: '#dcfce7', text: '#15803d', border: '#bbf7d0',
        style: css`background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;`
    },
    red: {
        bg: '#fee2e2', text: '#b91c1c', border: '#fecaca',
        style: css`background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;`
    },
    yellow: {
        bg: '#fef9c3', text: '#854d0e', border: '#fde047',
        style: css`background-color: #fef9c3; color: #854d0e; border: 1px solid #fde047;`
    },
    purple: {
        bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff',
        style: css`background-color: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff;`
    },
    gray: {
        bg: '#f3f4f6', text: '#374151', border: '#e5e7eb',
        style: css`background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;`
    },
    orange: {
        bg: '#ffedd5', text: '#c2410c', border: '#fed7aa',
        style: css`background-color: #ffedd5; color: #c2410c; border: 1px solid #fed7aa;`
    },
    pink: {
        bg: '#fce7f3', text: '#be185d', border: '#fbcfe8',
        style: css`background-color: #fce7f3; color: #be185d; border: 1px solid #fbcfe8;`
    },
};

export const ScheduleView = () => {
    // Stores
    const { user } = useAuthStore();
    const { currentDate, setCurrentDate } = useUIStore();
    const {
        scheduleEvents: events,
        setScheduleEvents: onUpdateEvents,
        scheduleTemplates: templates
    } = useScheduleStore();

    const isAdmin = user?.role === UserRole.ADMIN;

    // Filter State
    const [filter, setFilter] = useState('all'); // 'all' or templateId

    // UI State
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

    // Event Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        templateId: 'company',
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const openAddModal = (dateStr, templateId, existingEvent = null) => {
        if (existingEvent) {
            // Edit Mode
            setNewEvent({
                id: existingEvent.id, // Keep ID to track update
                templateId: existingEvent.templateId,
                title: existingEvent.title,
                content: existingEvent.content,
                date: existingEvent.date
            });
        } else {
            // Create Mode
            let safeTemplateId = templateId || (isAdmin ? 'company' : 'personal');
            if (safeTemplateId === 'company' && !isAdmin) safeTemplateId = 'personal';

            setNewEvent(prev => ({
                id: null, // No ID for new event
                date: dateStr || prev.date,
                templateId: safeTemplateId,
                title: '',
                content: ''
            }));
        }
        setIsModalOpen(true);
        setIsTemplateMenuOpen(false);
        setIsOptionsMenuOpen(false);
    }

    // Event Handlers
    const handleAddEvent = () => {
        if (!newEvent.title) return alert('일정 제목을 입력해주세요.');
        if (newEvent.templateId === 'company' && !isAdmin) return alert('회사 일정은 관리자만 등록할 수 있습니다.');

        if (newEvent.id) {
            // Update existing
            const updatedEvents = events.map(evt =>
                evt.id === newEvent.id
                    ? { ...evt, ...newEvent }
                    : evt
            );
            onUpdateEvents(updatedEvents);
        } else {
            // Create new
            onUpdateEvents([
                ...events,
                {
                    id: Date.now(),
                    ...newEvent,
                    ownerId: user.id // 현재 로그인한 사용자의 ID 저장
                }
            ]);
        }

        setIsModalOpen(false);
        // Reset
        setNewEvent(prev => ({
            id: null,
            templateId: isAdmin ? templates[0].id : 'personal',
            title: '',
            content: '',
            date: prev.date
        }));
    };

    const handleDeleteEvent = (e, id) => {
        e.stopPropagation();
        const targetEvent = events.find(evt => evt.id === id);
        if (!targetEvent) return;

        if (targetEvent.templateId === 'company' && !isAdmin) {
            alert('회사 일정은 관리자만 삭제할 수 있습니다.');
            return;
        }

        if (window.confirm('일정을 삭제하시겠습니까?')) {
            onUpdateEvents(events.filter(evt => evt.id !== id));
        }
    };

    const handleModalClose = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    // Render Logic
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<DayCell key={`empty-${i}`} $isEmpty />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;

        // Filter logic
        const dayEvents = events.filter(e => {
            // 1. 날짜가 맞는지 확인
            if (e.date !== dateStr) return false;

            // 2. 권한 확인 (본인 일정인가? 또는 공용 회사 일정인가?)
            const isMine = e.ownerId === user.id;
            const isCompany = e.templateId === 'company';

            if (!isMine && !isCompany) return false;

            // 3. 상단 보기 옵션 필터 확인
            if (filter === 'all') return true;
            return e.templateId === filter;
        });

        days.push(
            <DayCell
                key={d}
                onClick={() => openAddModal(dateStr)}
            >
                <DateNumberContainer>
                    <DateNumber $isToday={isToday}>{d}</DateNumber>
                </DateNumberContainer>

                <EventsList>
                    {dayEvents.map(evt => {
                        const template = templates.find(t => t.id === evt.templateId) || templates[0];
                        const colors = EVENT_COLORS[template.color] || EVENT_COLORS.gray;
                        return (
                            <EventItem
                                key={evt.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAddModal(null, null, evt);
                                }}
                                $colorStyle={colors.style}
                                title={evt.content}
                            >
                                <EventContent>{evt.title}</EventContent>
                                {(isAdmin || evt.templateId !== 'company') && (
                                    <DeleteEventButton
                                        onClick={(e) => handleDeleteEvent(e, evt.id)}
                                    >
                                        <X size={10} />
                                    </DeleteEventButton>
                                )}
                            </EventItem>
                        );
                    })}
                </EventsList>
            </DayCell>
        );
    }

    return (
        <Container onClick={() => { setIsTemplateMenuOpen(false); setIsOptionsMenuOpen(false); }}>
            {/* Header */}
            <Header>
                <HeaderLeft>
                    <div>
                        <Title>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                나의 일정
                            </span>
                        </Title>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0px', marginLeft: '2px' }}>
                            개인 일정과 회사 일정을 통합 관리합니다.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px', borderLeft: '1px solid #e5e7eb', paddingLeft: '24px', height: '40px' }}>
                        <DateNavigation>
                            <NavButton onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></NavButton>
                            <CurrentDate>
                                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                            </CurrentDate>
                            <NavButton onClick={() => changeMonth(1)}><ChevronRight size={18} /></NavButton>
                        </DateNavigation>
                        <TodayButton onClick={goToToday}>
                            오늘
                        </TodayButton>
                    </div>
                </HeaderLeft>

                <HeaderRight>
                    {filter !== 'all' && (
                        <FilterBadge>
                            <Filter size={12} />
                            <span>{templates.find(t => t.id === filter)?.name || '필터됨'}</span>
                            <FilterClearButton onClick={() => setFilter('all')}><X size={12} /></FilterClearButton>
                        </FilterBadge>
                    )}

                    <OptionsContainer onClick={e => e.stopPropagation()}>
                        <OptionsButton
                            onClick={() => { setIsOptionsMenuOpen(!isOptionsMenuOpen); setIsTemplateMenuOpen(false); }}
                            $isOpen={isOptionsMenuOpen}
                            title="보기 옵션"
                        >
                            <Filter size={18} />
                        </OptionsButton>

                        {isOptionsMenuOpen && (
                            <DropdownMenu>
                                <DropdownHeader>보기 옵션</DropdownHeader>
                                <DropdownItem onClick={() => { setFilter('all'); setIsOptionsMenuOpen(false); }}>
                                    <span>전체 보기</span>
                                    {filter === 'all' && <StyledCheck><Check size={14} /></StyledCheck>}
                                </DropdownItem>
                                <Divider />
                                {templates.map(t => (
                                    <DropdownItem
                                        key={t.id}
                                        onClick={() => { setFilter(t.id); setIsOptionsMenuOpen(false); }}
                                    >
                                        <span>{t.name}</span>
                                        {filter === t.id && <StyledCheck><Check size={14} /></StyledCheck>}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        )}
                    </OptionsContainer>

                    <OptionsContainer onClick={e => e.stopPropagation()}>
                        <AddEventButton onClick={() => openAddModal()}>
                            새로 일정 만들기
                        </AddEventButton>
                    </OptionsContainer>
                </HeaderRight>
            </Header>

            {/* Calendar Container */}
            <CalendarContainer onClick={(e) => e.stopPropagation()}>
                <CalendarGrid>
                    <DayHeaderRow>
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                            <DayHeader key={day} $isSunday={i === 0}>
                                {day}
                            </DayHeader>
                        ))}
                    </DayHeaderRow>

                    <DaysGrid>
                        {days}
                    </DaysGrid>
                </CalendarGrid>
            </CalendarContainer>

            {/* Event Add/Edit Modal */}
            {isModalOpen && (
                <ModalOverlay onClick={handleModalClose}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalHeaderSpacer />
                            <CloseModalButton onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </CloseModalButton>
                        </ModalHeader>

                        <ModalBody>
                            <div>
                                <TitleInput
                                    type="text"
                                    placeholder="제목 없음"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <FormStack>
                                <FormRow $alignStart>
                                    <FormLabel $marginTop>
                                        <span>🏷️</span> 종류
                                    </FormLabel>
                                    <TemplateButtonContainer>
                                        {templates.map(t => {
                                            if (t.id === 'company' && !isAdmin) return null;
                                            const colors = EVENT_COLORS[t.color] || EVENT_COLORS.gray;
                                            return (
                                                <TemplateButton
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setNewEvent({ ...newEvent, templateId: t.id })}
                                                    $active={newEvent.templateId === t.id}
                                                    $activeStyle={colors.style}
                                                >
                                                    {t.name}
                                                </TemplateButton>
                                            );
                                        })}
                                    </TemplateButtonContainer>
                                </FormRow>

                                <FormRow>
                                    <FormLabel>
                                        <span>📅</span> 날짜
                                    </FormLabel>
                                    <DateInput
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </FormRow>

                                <FormRow $alignStart>
                                    <FormLabel $marginTop>
                                        <span>📝</span> 내용
                                    </FormLabel>
                                    <ContentTextarea
                                        rows={3}
                                        placeholder="설명 추가..."
                                        value={newEvent.content}
                                        onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
                                    />
                                </FormRow>
                            </FormStack>
                        </ModalBody>
                        <ModalFooter style={{ justifyContent: newEvent.id ? 'space-between' : 'flex-end' }}>
                            {newEvent.id && (
                                <DeleteEventButton
                                    as="button"
                                    onClick={(e) => {
                                        handleDeleteEvent(e, newEvent.id);
                                        setIsModalOpen(false);
                                    }}
                                    style={{ position: 'static', color: '#ef4444', background: 'none' }}
                                >
                                    삭제
                                </DeleteEventButton>
                            )}
                            <SaveButton onClick={handleAddEvent}>
                                {newEvent.id ? '수정 완료' : '저장하기'}
                            </SaveButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
