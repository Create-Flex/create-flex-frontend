import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, X, Filter, Check } from 'lucide-react';
import { UserRole } from '../../../shared/constants/enums';
import { css } from 'styled-components';
import {
    Container, Header, HeaderLeft, Title, DateNavigation, NavButton, CurrentDate, TodayButton,
    HeaderRight, FilterBadge, FilterClearButton, OptionsContainer, OptionsButton, DropdownMenu, DropdownHeader, DropdownItem, Divider, AddEventButton,
    CalendarContainer, CalendarGrid, DayHeaderRow, DayHeader, DaysGrid, DayCell, DateNumber, EventsList, EventItem, EventContent, DeleteEventButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalHeaderSpacer, CloseModalButton, ModalBody, ModalFooter,
    TitleInput, FormRow, FormLabel, TemplateButtonContainer, TemplateButton, DateInput, ContentTextarea, SaveButton,
    DateNumberContainer, StyledCheck, FormStack
} from './ScheduleView.styled';

import { useAuthStore } from '../../auth/model/useAuthStore';
import { useUIStore } from '../../../shared/model/useUIStore';
import { scheduleService } from '../api/scheduleService';

const EVENT_COLORS = {
    COMPANY: {
        bg: '#e0f2fe', text: '#0369a1', border: '#b9e6fe',
        style: css`background-color: #e0f2fe; color: #0369a1; border: 1px solid #b9e6fe;`
    },
    PERSONAL: {
        bg: '#dcfce7', text: '#15803d', border: '#bbf7d0',
        style: css`background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;`
    },
    gray: {
        bg: '#f3f4f6', text: '#374151', border: '#e5e7eb',
        style: css`background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;`
    }
};

const SCHEDULE_TYPES = [
    { id: 'COMPANY', name: '회사 일정', color: 'COMPANY' },
    { id: 'PERSONAL', name: '개인 일정', color: 'PERSONAL' }
];

export const ScheduleView = () => {
    // Stores
    const { user } = useAuthStore();
    const { currentDate, setCurrentDate } = useUIStore();

    // State
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'COMPANY', 'PERSONAL'
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

    // Event Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailMode, setIsDetailMode] = useState(false); // 상세 보기 모드 여부
    const [scheduleForm, setScheduleForm] = useState({
        scheduleId: null,
        scheduleName: '',
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleDetail: '',
        scheduleType: 'PERSONAL',
        creatorId: null,
        visitorIds: []
    });

    const isAdministrator = user?.memberRole === UserRole.ADMINISTRATOR;

    // Fetch Events when month changes
    useEffect(() => {
        fetchSchedules();
    }, [currentDate]);

    const fetchSchedules = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const data = await scheduleService.getSchedules(year, month);
            if (Array.isArray(data)) {
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
            // Fallback or empty state
            setEvents([]);
        }
    };

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

    const openModal = (dateStr, existingEvent = null) => {
        if (existingEvent) {
            // Edit/Detail Mode
            setScheduleForm({
                scheduleId: existingEvent.scheduleId,
                scheduleName: existingEvent.scheduleName,
                scheduleDetail: existingEvent.scheduleDetail,
                scheduleDate: existingEvent.scheduleDate,
                scheduleType: existingEvent.scheduleType,
                creatorId: existingEvent.creatorId,
                visitorIds: existingEvent.visitorIds || []
            });

            // 권한 체크 COMPANY는 관리자만 수정 가능, 일반 유저는 조회만 
            if (existingEvent.scheduleType === 'COMPANY' && !isAdministrator) {
                setIsDetailMode(true);
            } else {

                setIsDetailMode(false);
            }

        } else {
            // Create Mode
            setScheduleForm({
                scheduleId: null,
                scheduleName: '',
                scheduleDate: dateStr || new Date().toISOString().split('T')[0],
                scheduleDetail: '',
                scheduleType: isAdministrator ? 'COMPANY' : 'PERSONAL', // 기본값 설정
                creatorId: null,
                visitorIds: []
            });
            setIsDetailMode(false);
        }
        setIsModalOpen(true);
        setIsOptionsMenuOpen(false);
    }

    // Event Handlers
    const handleSave = async () => {
        if (!scheduleForm.scheduleName) return toast.error('일정 제목을 입력해주세요.');
        if (scheduleForm.scheduleType === 'COMPANY' && !isAdministrator) return toast.error('회사 일정은 관리자만 등록할 수 있습니다.');

        try {
            const payload = {
                scheduleName: scheduleForm.scheduleName,
                scheduleDate: scheduleForm.scheduleDate,
                scheduleDetail: scheduleForm.scheduleDetail,
                scheduleType: scheduleForm.scheduleType,
                creatorId: null,
                visitorIds: scheduleForm.visitorIds || []
            };

            if (scheduleForm.scheduleId) {
                // Update
                await scheduleService.updateSchedule(scheduleForm.scheduleId, payload);
            } else {
                // Create
                await scheduleService.createSchedule(payload);
            }

            await fetchSchedules(); // Refresh
            await fetchSchedules(); // Refresh
            setIsModalOpen(false);
            toast.success('일정이 저장되었습니다.');
        } catch (error) {
            console.error("Failed to save schedule:", error);
            toast.error("일정 저장에 실패했습니다.");
        }
    };

    const handleDelete = async (e, id) => {
        if (e) e.stopPropagation();

        const targetEvent = events.find(evt => evt.scheduleId === id);
        if (!targetEvent) return;

        if (targetEvent.scheduleType === 'COMPANY' && !isAdministrator) {
            toast.error('회사 일정은 관리자만 삭제할 수 있습니다.');
            return;
        }

        if (window.confirm('일정을 삭제하시겠습니까?')) {
            try {
                await scheduleService.deleteSchedule(id);
                await fetchSchedules();
                setIsModalOpen(false);
                toast.success('일정이 삭제되었습니다.');
            } catch (error) {
                console.error("Failed to delete schedule:", error);
                toast.error("일정 삭제에 실패했습니다.");
            }
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
            //  날짜 확인
            if (e.scheduleDate !== dateStr) return false;

            //  필터 확인
            if (filter !== 'all' && e.scheduleType !== filter) return false;

            return true;
        });

        days.push(
            <DayCell
                key={d}
                onClick={() => openModal(dateStr)}
            >
                <DateNumberContainer>
                    <DateNumber $isToday={isToday}>{d}</DateNumber>
                </DateNumberContainer>

                <EventsList>
                    {dayEvents.map(evt => {
                        const colors = EVENT_COLORS[evt.scheduleType] || EVENT_COLORS.gray;
                        return (
                            <EventItem
                                key={evt.scheduleId}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(null, evt);
                                }}
                                $colorStyle={colors.style}
                                title={evt.scheduleDetail}
                            >
                                <EventContent>{evt.scheduleName}</EventContent>
                                {/* 삭제 버튼: 관리자이거나, 개인 일정인 경우에만 노출 */}
                                {(isAdministrator || evt.scheduleType === 'PERSONAL') && (
                                    <DeleteEventButton
                                        onClick={(e) => handleDelete(e, evt.scheduleId)}
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
        <Container onClick={() => { setIsOptionsMenuOpen(false); }}>
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
                            <span>{SCHEDULE_TYPES.find(t => t.id === filter)?.name || '필터됨'}</span>
                            <FilterClearButton onClick={() => setFilter('all')}><X size={12} /></FilterClearButton>
                        </FilterBadge>
                    )}

                    <OptionsContainer onClick={e => e.stopPropagation()}>
                        <OptionsButton
                            onClick={() => { setIsOptionsMenuOpen(!isOptionsMenuOpen); }}
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
                                {SCHEDULE_TYPES.map(t => (
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
                        <AddEventButton onClick={() => openModal()}>
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
                            {/* Read-Only View for Non-Admin on Company Events */}
                            {isDetailMode ? (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                                        {scheduleForm.scheduleName}
                                    </h2>
                                    <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            backgroundColor: EVENT_COLORS[scheduleForm.scheduleType]?.bg,
                                            color: EVENT_COLORS[scheduleForm.scheduleType]?.text,
                                            border: `1px solid ${EVENT_COLORS[scheduleForm.scheduleType]?.border}`
                                        }}>
                                            {SCHEDULE_TYPES.find(t => t.id === scheduleForm.scheduleType)?.name}
                                        </span>
                                        <span style={{ color: '#6b7280' }}>{scheduleForm.scheduleDate}</span>
                                    </div>
                                    <div style={{
                                        padding: '16px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        minHeight: '100px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {scheduleForm.scheduleDetail}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <TitleInput
                                            type="text"
                                            placeholder="제목 없음"
                                            value={scheduleForm.scheduleName}
                                            onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleName: e.target.value })}
                                            autoFocus
                                        />
                                    </div>

                                    <FormStack>
                                        <FormRow $alignStart>
                                            <FormLabel $marginTop>
                                                <span>🏷️</span> 종류
                                            </FormLabel>
                                            <TemplateButtonContainer>
                                                {SCHEDULE_TYPES.map(t => {
                                                    // 권한 로직: 일반 직원은 'COMPANY' 선택 불가
                                                    if (t.id === 'COMPANY' && !isAdministrator) return null;

                                                    const colors = EVENT_COLORS[t.color] || EVENT_COLORS.gray;
                                                    return (
                                                        <TemplateButton
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setScheduleForm({ ...scheduleForm, scheduleType: t.id })}
                                                            $active={scheduleForm.scheduleType === t.id}
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
                                                value={scheduleForm.scheduleDate}
                                                onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleDate: e.target.value })}
                                            />
                                        </FormRow>

                                        <FormRow $alignStart>
                                            <FormLabel $marginTop>
                                                <span>📝</span> 내용
                                            </FormLabel>
                                            <ContentTextarea
                                                rows={5}
                                                placeholder="상세 내용을 입력하세요..."
                                                value={scheduleForm.scheduleDetail}
                                                onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleDetail: e.target.value })}
                                            />
                                        </FormRow>
                                    </FormStack>
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter style={{ justifyContent: scheduleForm.scheduleId ? 'space-between' : 'flex-end' }}>
                            {!isDetailMode && scheduleForm.scheduleId && (
                                <DeleteEventButton
                                    as="button"
                                    onClick={(e) => handleDelete(e, scheduleForm.scheduleId)}
                                    style={{ position: 'static', color: '#ef4444', background: 'none' }}
                                >
                                    삭제
                                </DeleteEventButton>
                            )}

                            {!isDetailMode && (
                                <SaveButton onClick={handleSave}>
                                    {scheduleForm.scheduleId ? '수정 완료' : '저장하기'}
                                </SaveButton>
                            )}
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
