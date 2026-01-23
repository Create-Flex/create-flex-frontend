import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getCreatorColorStyles } from './utils';
import { PALETTE } from './constants';

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
        days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-white border-r border-b border-gray-200"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const dayEvents = events.filter(e => e.date === dateStr);

        days.push(
            <div
                key={d}
                onClick={() => !readOnly && onAddEvent(dateStr)} // Whole cell clickable
                className={`min-h-[120px] bg-white border-r border-b border-gray-200 p-1 relative group transition-colors ${!readOnly ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            >
                {/* Date Header */}
                <div className="flex justify-between items-start mb-1 p-1">
                    <span
                        className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-[4px]
                        ${isToday ? 'bg-[#00C471] text-white' : 'text-gray-500'}`}
                    >
                        {d}
                    </span>
                    {!readOnly && (
                        <div className="opacity-0 group-hover:opacity-100 text-[#00C471] transition-opacity p-0.5">
                            <Plus size={14} />
                        </div>
                    )}
                </div>

                {/* Events */}
                <div className="space-y-1 px-1">
                    {dayEvents.map(evt => {
                        const creator = creatorsMap[evt.creatorId];
                        const styles = creator ? getCreatorColorStyles(creator.id) : PALETTE[0];

                        return (
                            <div
                                key={evt.id}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent onAddEvent trigger
                                    onEventClick(evt);
                                }}
                                className={`
                                    px-2 py-1 rounded-[3px] text-xs flex justify-between items-center group/item cursor-pointer shadow-sm
                                    transition-all hover:brightness-95 border
                                    ${styles.bg} ${styles.text} ${styles.border}
                                `}
                            >
                                <div className="truncate font-medium flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`}></div>
                                    <span className="truncate">
                                        {creator?.name} -
                                        {evt.type === 'meeting' ? ' [미팅]' :
                                            evt.type === 'live' ? ' [라이브]' :
                                                evt.type === 'joint' && !evt.title.includes('[합방]') ? ' [합방]' : ''} {evt.title}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Legend Logic: If legendCreators prop exists, use it. Otherwise use all creators in creatorsMap.
    const legendList = legendCreators || Object.values(creatorsMap);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={18} /></button>
                        <span className="text-lg font-bold text-gray-800 min-w-[120px] text-center">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); goToToday(); }}
                        className="text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-md shadow-sm transition-all"
                    >
                        오늘
                    </button>
                </div>

                {/* Creator Legend */}
                <div className="flex gap-3 text-xs overflow-x-auto max-w-[500px] py-1 scrollbar-hide">
                    {legendList.map((c) => {
                        const style = getCreatorColorStyles(c.id);
                        return (
                            <div key={c.id} className="flex items-center gap-1 text-gray-600 shrink-0">
                                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                                {c.name}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={day} className={`py-2 text-center text-xs font-medium ${i === 0 ? 'text-[#00C471]' : 'text-gray-500'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7">
                {days}
            </div>
        </div>
    );
};
