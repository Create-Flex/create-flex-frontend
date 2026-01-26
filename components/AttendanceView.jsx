import React, { useState } from 'react';
import { Clock, Plane, AlertCircle, Timer } from 'lucide-react';
import { MyAttendance } from './employee/attendance/MyAttendance';
import { MyVacation } from './employee/vacation/MyVacation';
import {
    Container, ContentWrapper, Header, Title, CardsGrid, DashboardCard, CardHeader, CardTitle,
    CardValueWrapper, CardValue, CardUnit, CardDescription, ProgressBarContainer, ProgressLabel, ProgressValue,
    ProgressBarBg, ProgressBarFill, TabsContainer, TabButton, VerticalStack
} from './AttendanceView.styled';

export const AttendanceView = ({
    vacationLogs = [],
    onUpdateVacationLogs,
    userName,
    attendanceLogs = []
}) => {
    const [activeTab, setActiveTab] = useState('work');

    // Stats Data (Mock)
    const stats = {
        lateCount: 1,
        overtimeCount: 3,
        leaveTotal: 15,
        leaveUsed: 2.5
    };

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <Title>
                        <Clock color="#1f2937" size={28} /> 나의 근태/휴가
                    </Title>
                </Header>

                {/* Dashboard Cards */}
                <CardsGrid>
                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>지각 횟수</CardTitle>
                            <AlertCircle size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{stats.lateCount}</CardValue>
                            <CardUnit>회</CardUnit>
                        </CardValueWrapper>
                        <CardDescription>정규 출근 시간 이후 기록된 누적 횟수입니다.</CardDescription>
                    </DashboardCard>

                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>추가근무 횟수</CardTitle>
                            <Timer size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{stats.overtimeCount}</CardValue>
                            <CardUnit>회</CardUnit>
                        </CardValueWrapper>
                        <CardDescription>정규 업무 시간을 초과하여 근무한 일수입니다.</CardDescription>
                    </DashboardCard>

                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>잔여 연차</CardTitle>
                            <Plane size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{stats.leaveTotal - stats.leaveUsed}</CardValue>
                            <CardUnit $bottom>일</CardUnit>
                        </CardValueWrapper>
                        <VerticalStack>
                            <ProgressBarContainer>
                                <ProgressLabel>사용 연차 {stats.leaveUsed} / {stats.leaveTotal}</ProgressLabel>
                                <ProgressValue>{Math.round((stats.leaveUsed / stats.leaveTotal) * 100)}%</ProgressValue>
                            </ProgressBarContainer>
                            <ProgressBarBg>
                                <ProgressBarFill $width={`${(stats.leaveUsed / stats.leaveTotal) * 100}%`} />
                            </ProgressBarBg>
                        </VerticalStack>
                    </DashboardCard>
                </CardsGrid>

                <TabsContainer>
                    <TabButton
                        $active={activeTab === 'work'}
                        onClick={() => setActiveTab('work')}
                    >
                        <Clock size={16} /> 일별 근무 내역
                    </TabButton>
                    <TabButton
                        $active={activeTab === 'vacation'}
                        onClick={() => setActiveTab('vacation')}
                    >
                        <Plane size={16} /> 휴가 사용 내역
                    </TabButton>
                </TabsContainer>

                {activeTab === 'work' && <MyAttendance attendanceLogs={attendanceLogs} userName={userName} />}

                {activeTab === 'vacation' && (
                    <MyVacation
                        vacationLogs={vacationLogs}
                        onUpdateVacationLogs={onUpdateVacationLogs}
                        userName={userName}
                    />
                )}
            </ContentWrapper>
        </Container>
    );
};
