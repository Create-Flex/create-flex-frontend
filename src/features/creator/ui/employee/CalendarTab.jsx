import React, { useEffect, useState } from 'react';
import { Plus, User } from 'lucide-react';
import { CreatorCalendar } from '../components/shared/Calendar';
import { scheduleService } from '../../../calendar/api/scheduleService';
import { creatorService } from '../../api/creatorService';
import { useAuthStore } from '../../../auth/model/useAuthStore';
import {
    Container, Header, TitleGroup, Title, Subtitle, AddButton,
    CalendarWrapper, BlurLayer, EmptyStateOverlay, EmptyStateCard,
    EmptyIconWrapper, EmptyTitle, EmptyText
} from './CalendarTab.styled';
import { ScheduleWriteModal } from './ScheduleWriteModal';

export const CalendarTab = ({
    onAddEvent,
    onEventClick,
}) => {
    const { user } = useAuthStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [myCreators, setMyCreators] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCreators, setHasCreators] = useState(false);

    // 담당 크리에이터 확인
    useEffect(() => {
        const checkMyCreators = async () => {
            if (!user || !user.id) return;

            try {
                setIsLoading(true);
                const response = await creatorService.getMyCreators(user.id);

                if (response && response.length > 0) {
                    // 크리에이터 데이터 변환
                    const formattedCreators = response.map(c => ({
                        id: String(c.creator_id || c.creatorId || c.id || c.member_id || c.memberId || c.member_no),
                        name: c.creator_name || c.creatorName || c.member_name || c.name || '이름 없음',
                        platform: c.creator_platform || c.creatorPlatform || 'YouTube',
                        subscribers: c.creator_subscribe || c.creatorSubscribe || '',
                        avatarUrl: c.profile_image || c.profileImage || '',
                    }));

                    setMyCreators(formattedCreators);
                    setHasCreators(true);

                    // 크리에이터가 있으면 일정 조회
                    await fetchCreatorSchedules();
                } else {
                    setHasCreators(false);
                    setMyCreators([]);
                    setEvents([]);
                }
            } catch (error) {
                console.error('담당 크리에이터 조회 실패:', error);
                setHasCreators(false);
                setMyCreators([]);
                setEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        checkMyCreators();
    }, [user]);

    // 크리에이터 일정 조회
    const fetchCreatorSchedules = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            const response = await scheduleService.getCreatorSchedules(year, month);

            // 응답 데이터를 이벤트 형식으로 변환
            const formattedEvents = response.map(schedule => {
                // scheduleType을 event type으로 매핑
                const typeMap = {
                    'PROMOTION': 'promotion',
                    'CONTENT': 'content',
                    'MEETING': 'meeting',
                    'MERGE': 'joint',
                    'LIVE': 'live'
                };

                return {
                    id: String(schedule.scheduleId),
                    creatorId: String(schedule.memberId), // memberId가 작성자
                    title: schedule.scheduleName,
                    date: schedule.scheduleDate,
                    type: typeMap[schedule.scheduleType] || 'other',
                    content: schedule.scheduleDetail || '',
                    // 합방인 경우 참여자 정보 추가
                    partnerCreators: schedule.visitorIds || [],
                    partnerNames: schedule.visitorNames || [],
                    // 매니저가 등록한 일정인지 크리에이터가 등록한 일정인지 구분
                    creatorName: schedule.creatorName || null,
                    isManagerCreated: schedule.memberRole !== 'CREATOR', // 크리에이터가 아닌 경우(매니저/관리자 등)는 모두 매니저 등록 일정으로 판단
                    writerName: schedule.memberName // 작성자 이름 매핑 추가
                };
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error('크리에이터 일정 조회 실패:', error);
            setEvents([]);
        }
    };

    // 월 변경 시 일정 다시 조회
    useEffect(() => {
        if (hasCreators) {
            fetchCreatorSchedules();
        }
    }, [currentDate, hasCreators]);

    // 크리에이터 맵 생성
    const creatorsMap = myCreators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

    // 모달 상태
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null); // 수정 중인 일정
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜

    // 일정 추가 버튼 클릭 핸들러
    const handleAddEventClick = (date) => {
        setEditingEvent(null); // 추가 모드
        // date가 문자열로 넘어오면 Date 객체로 변환, 없으면 현재 날짜
        const targetDate = date ? new Date(date) : new Date();
        setSelectedDate(targetDate);
        setIsWriteModalOpen(true);
    };

    // 일정 수정 핸들러 (EventDetailModal에서 호출)
    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsWriteModalOpen(true);
    };

    // 일정 등록 성공 후 처리
    const handleScheduleCreate = () => {
        fetchCreatorSchedules();
        setEditingEvent(null);
    };

    if (isLoading) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    color: '#6b7280'
                }}>
                    로딩 중...
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <TitleGroup>
                    <Title>전체 일정</Title>
                    <Subtitle>담당하는 모든 크리에이터의 일정을 한눈에 확인하세요.</Subtitle>
                </TitleGroup>
                <AddButton
                    onClick={() => handleAddEventClick()}
                    disabled={!hasCreators}
                >
                    <Plus size={16} /> 일정 추가
                </AddButton>
            </Header>

            <CalendarWrapper>
                <BlurLayer $blur={!hasCreators}>
                    <CreatorCalendar
                        events={events}
                        creatorsMap={creatorsMap}
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                        onAddEvent={handleAddEventClick}
                        onEventClick={(evt) => onEventClick(evt, handleEditEvent)}
                        legendCreators={myCreators}
                    />
                </BlurLayer>

                {!hasCreators && (
                    <EmptyStateOverlay>
                        <EmptyStateCard>
                            <EmptyIconWrapper>
                                <User size={28} />
                            </EmptyIconWrapper>
                            <EmptyTitle>담당 중인 크리에이터가 없습니다</EmptyTitle>
                            <EmptyText>
                                아직 담당 크리에이터가 배정되지 않았거나<br />
                                등록된 크리에이터가 없습니다.<br />
                                인사 운영자 또는 관리자에게 배정을 요청하세요.
                            </EmptyText>
                        </EmptyStateCard>
                    </EmptyStateOverlay>
                )}
            </CalendarWrapper>

            {/* 일정 등록/수정 모달 */}
            <ScheduleWriteModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                date={selectedDate.toISOString().split('T')[0]} // Use selectedDate
                initialCreatorId={editingEvent ? editingEvent.creatorId : (myCreators.length > 0 ? myCreators[0].id : '')}
                myCreators={myCreators}
                onConfirm={handleScheduleCreate}
                editEvent={editingEvent} // Pass editing event
            />
        </Container>
    );
};