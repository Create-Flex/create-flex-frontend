import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
    CalendarContainer, CalendarHeader, NavGroup, MonthNav, NavButton, Title, TodayButton, Legend, LegendItem, LegendDot,
    GridHeader, DayHeaderCell, GridBody, DayCell, DateRow, DateNum, AddIconWrapper, EventList, EventItem, EventContent, EventDot, EventText
} from './Calendar.styled';

export const CreatorCalendar = ({
    events,
    creatorsMap,
    currentDate,
    onDateChange,
    onAddEvent,
    onEventClick,
    readOnly = false,
    legendCreators
}) => {
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset) => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const goToToday = () => {
        onDateChange(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        days.push(<DayCell key={`empty-${i}`} style={{ backgroundColor: 'white', cursor: 'default' }} />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const dayEvents = events.filter(e => e.date === dateStr);

        days.push(
            <DayCell
                key={d}
                onClick={() => !readOnly && onAddEvent(dateStr)} // Whole cell clickable
                $readOnly={readOnly}
            >
                {/* Date Header */}
                <DateRow>
                    <DateNum $isToday={isToday}>
                        {d}
                    </DateNum>
                    {!readOnly && (
                        <AddIconWrapper>
                            <Plus size={14} />
                        </AddIconWrapper>
                    )}
                </DateRow>

                {/* Events */}
                <EventList>
                    {dayEvents.map(evt => {
                        const creator = creatorsMap[evt.creatorId];
                        return (
                            <EventItem
                                key={evt.id}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent onAddEvent trigger
                                    onEventClick(evt);
                                }}
                                $creatorId={creator?.id}
                            >
                                <EventContent>
                                    <EventDot $creatorId={creator?.id} />
                                    <EventText>
                                        {creator?.name} -
                                        {evt.type === 'meeting' ? ' [미팅]' :
                                            evt.type === 'live' ? ' [라이브]' :
                                                evt.type === 'joint' && !evt.title.includes('[합방]') ? ' [합방]' : ''} {evt.title}
                                    </EventText>
                                </EventContent>
                            </EventItem>
                        );
                    })}
                </EventList>
            </DayCell>
        );
    }

    // Legend Logic: If legendCreators prop exists, use it. Otherwise use all creators in creatorsMap.
    const legendList = legendCreators || Object.values(creatorsMap);

    return (
        <CalendarContainer>
            {/* Header */}
            <CalendarHeader>
                <NavGroup>
                    <MonthNav>
                        <NavButton onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}>
                            <ChevronLeft size={18} />
                        </NavButton>
                        <Title>
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </Title>
                        <NavButton onClick={(e) => { e.stopPropagation(); changeMonth(1); }}>
                            <ChevronRight size={18} />
                        </NavButton>
                    </MonthNav>
                    <TodayButton onClick={(e) => { e.stopPropagation(); goToToday(); }}>
                        오늘
                    </TodayButton>
                </NavGroup>

                {/* Creator Legend */}
                <Legend>
                    {legendList.map((c) => (
                        <LegendItem key={c.id}>
                            <LegendDot $id={c.id} />
                            {c.name}
                        </LegendItem>
                    ))}
                </Legend>
            </CalendarHeader>

            {/* Grid Header */}
            <GridHeader>
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <DayHeaderCell key={day} $isSunday={i === 0}>
                        {day}
                    </DayHeaderCell>
                ))}
            </GridHeader>

            {/* Grid Body */}
            <GridBody>
                {days}
            </GridBody>
        </CalendarContainer>
    );
};

