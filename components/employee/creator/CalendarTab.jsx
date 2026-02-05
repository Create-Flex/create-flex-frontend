import React, { useEffect, useState } from 'react';
import { Plus, User } from 'lucide-react';
import { CreatorCalendar } from '../../creator/shared/Calendar';
import { scheduleService } from '../../../api/scheduleService';
import { creatorService } from '../../../api/creatorService';
import { useAuthStore } from '../../../stores/useAuthStore';
import {
    Container, Header, TitleGroup, Title, Subtitle, AddButton,
    CalendarWrapper, BlurLayer, EmptyStateOverlay, EmptyStateCard,
    EmptyIconWrapper, EmptyTitle, EmptyText
} from './CalendarTab.styled';

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
                        id: String(c.creator_id || c.creatorId),
                        name: c.creator_name || c.creatorName || c.member_name,
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
                    isManagerCreated: schedule.creatorId !== null
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
                    onClick={() => onAddEvent()}
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
                        onAddEvent={onAddEvent}
                        onEventClick={onEventClick}
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
        </Container>
    );
};