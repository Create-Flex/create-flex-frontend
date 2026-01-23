import React from 'react';
import { CalendarIcon, Plus, User } from 'lucide-react';
import { CreatorCalendar } from '../../creator/shared/Calendar';

export const CalendarTab = ({
    allMyEvents,
    creatorsMap,
    currentDate,
    onDateChange,
    onAddEvent,
    onEventClick,
    myCreators,
}) => {
    return (
        <div className="animate-[fadeIn_0.2s_ease-out] relative">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">전체 일정</h2>
                    <p className="text-sm text-gray-500">담당하는 모든 크리에이터의 일정을 한눈에 확인하세요.</p>
                </div>
                <button
                    onClick={() => onAddEvent()}
                    className={`flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ${myCreators.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={myCreators.length === 0}
                >
                    <Plus size={16} /> 일정 추가
                </button>
            </div>

            <div className="relative">
                <div className={myCreators.length === 0 ? 'blur-sm pointer-events-none select-none opacity-50 transition-all duration-500' : ''}>
                    <CreatorCalendar
                        events={allMyEvents}
                        creatorsMap={creatorsMap}
                        currentDate={currentDate}
                        onDateChange={onDateChange}
                        onAddEvent={onAddEvent}
                        onEventClick={onEventClick}
                        legendCreators={myCreators}
                    />
                </div>

                {myCreators.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="bg-white/90 backdrop-blur p-8 rounded-2xl border border-gray-200 shadow-xl text-center max-w-sm">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={28} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">담당 중인 크리에이터가 없습니다</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                아직 담당 크리에이터가 배정되지 않았거나<br />
                                등록된 크리에이터가 없습니다.<br />
                                인사 운영자 또는 관리자에게 배정을 요청하세요.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
