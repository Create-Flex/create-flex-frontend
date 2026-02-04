import React, { useState, useEffect } from 'react';
import { Clock, Plane, AlertCircle, Timer } from 'lucide-react';
import { MyAttendance } from './employee/attendance/MyAttendance';
import { MyVacation } from './employee/vacation/MyVacation';
import { vacationService } from '../api/vacationService';
import { useAuthStore } from '../stores/useAuthStore';
import {
    Container, ContentWrapper, Header, Title, CardsGrid, DashboardCard, CardHeader, CardTitle,
    CardValueWrapper, CardValue, CardUnit, CardDescription, ProgressBarContainer, ProgressLabel, ProgressValue,
    ProgressBarBg, ProgressBarFill, TabsContainer, TabButton, VerticalStack, ContentSection
} from './AttendanceView.styled';

import { useUserStore } from '../stores/useUserStore';
import { useAttendanceStore } from '../stores/useAttendanceStore';
import { useVacationStore } from '../stores/useVacationStore';
import { attendanceService } from '../api/attendanceService';

export const AttendanceView = () => {
    const { user } = useAuthStore();
    const { userProfile } = useUserStore();
    const { attendanceLogs } = useAttendanceStore();
    const { refreshKey: vacationRefreshKey } = useVacationStore();

    // Derived state
    const userName = userProfile.name;
    const memberId = user?.memberId || user?.id;

    const [activeTab, setActiveTab] = useState('work');

    // Stats Data (State for API data, Init with Mock/Default)
    const [stats, setStats] = useState({
        lateCount: '-',
        overtimeMinutes: '-',
    });

    // Fetch My Dashboard Stats
    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await attendanceService.getMyDashboardStats();
                if (data) {
                    setStats(prev => ({
                        ...prev,
                        lateCount: data.lateCount || 0,
                        overtimeMinutes: data.totalOvertimeMinutes || 0
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch my dashboard stats", error);
            }
        };
        fetchStats();
    }, []);
    // 잔여 연차 상태
    const [vacationStats, setVacationStats] = useState({
        total: 15,
        used: 0,
        remaining: 15
    });

    // 잔여 연차 조회 (휴가 신청/변경 시 자동 새로고침)
    useEffect(() => {
        const fetchRemainder = async () => {
            if (!memberId) return;
            try {
                const response = await vacationService.getMyVacationRemainder(memberId);
                setVacationStats({
                    total: response.totalVacation || 15,
                    used: response.usedVacation || 0,
                    remaining: response.vacationRemainder || 15
                });
            } catch (error) {
                console.error('잔여 연차 조회 실패:', error);
            }
        };
        fetchRemainder();
    }, [memberId, vacationRefreshKey]);

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock color="#1f2937" size={32} />
                        <div>
                            <Title>나의 근태/휴가</Title>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                나의 근태 현황과 휴가 사용 내역을 조회하고 관리합니다.
                            </p>
                        </div>
                    </div>
                </Header>

                {/* Dashboard Cards */}
                <CardsGrid>
                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>이번달 지각횟수</CardTitle>
                            <AlertCircle size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{stats.lateCount}</CardValue>
                            <CardUnit>회</CardUnit>
                        </CardValueWrapper>
                        <CardDescription>이번 달 정규 출근 시간 이후 기록된 횟수입니다.</CardDescription>
                    </DashboardCard>

                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>이번달 초과 근무 시간</CardTitle>
                            <Timer size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{stats.overtimeMinutes}</CardValue>
                            <CardUnit>분</CardUnit>
                        </CardValueWrapper>
                        <CardDescription>이번 달 정규 업무 시간을 초과하여 근무한 총 시간입니다.</CardDescription>
                    </DashboardCard>

                    <DashboardCard>
                        <CardHeader>
                            <CardTitle>잔여 연차</CardTitle>
                            <Plane size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            <CardValue>{vacationStats.remaining}</CardValue>
                            <CardUnit $bottom>일</CardUnit>
                        </CardValueWrapper>
                        <VerticalStack>
                            <ProgressBarContainer>
                                <ProgressLabel>사용 연차 {vacationStats.used} / {vacationStats.total}</ProgressLabel>
                                <ProgressValue>{Math.round((vacationStats.used / vacationStats.total) * 100)}%</ProgressValue>
                            </ProgressBarContainer>
                            <ProgressBarBg>
                                <ProgressBarFill $width={`${(vacationStats.used / vacationStats.total) * 100}%`} />
                            </ProgressBarBg>
                        </VerticalStack>
                    </DashboardCard>
                </CardsGrid>

                <ContentSection>
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

                    {activeTab === 'vacation' && <MyVacation />}
                </ContentSection>
            </ContentWrapper>
        </Container>
    );
};
