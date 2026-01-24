import React from 'react';
import { Plus, User } from 'lucide-react';
import { CreatorCalendar } from '../../creator/shared/Calendar';
import {
    Container, Header, TitleGroup, Title, Subtitle, AddButton,
    CalendarWrapper, BlurLayer, EmptyStateOverlay, EmptyStateCard,
    EmptyIconWrapper, EmptyTitle, EmptyText
} from './CalendarTab.styled';

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
        <Container>
            <Header>
                <TitleGroup>
                    <Title>전체 일정</Title>
                    <Subtitle>담당하는 모든 크리에이터의 일정을 한눈에 확인하세요.</Subtitle>
                </TitleGroup>
                <AddButton
                    onClick={() => onAddEvent()}
                    disabled={myCreators.length === 0}
                >
                    <Plus size={16} /> 일정 추가
                </AddButton>
            </Header>

            <CalendarWrapper>
                <BlurLayer $blur={myCreators.length === 0}>
                    <CreatorCalendar
                        events={allMyEvents}
                        creatorsMap={creatorsMap}
                        currentDate={currentDate}
                        onDateChange={onDateChange}
                        onAddEvent={onAddEvent}
                        onEventClick={onEventClick}
                        legendCreators={myCreators}
                    />
                </BlurLayer>

                {myCreators.length === 0 && (
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
