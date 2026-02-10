import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Timer, Briefcase } from 'lucide-react';
import { MyAttendance } from './components/MyAttendance';
import { useAuthStore } from '../../auth/model/useAuthStore';
import {
    Container, ContentWrapper, Header, Title, CardsGrid, DashboardCard, CardHeader, CardTitle,
    CardValueWrapper, CardValue, CardUnit, CardDescription, ContentSection
} from './AttendanceView.styled';

import { useUserStore } from '../../employee/model/useUserStore';
import { useAttendanceStore } from '../model/useAttendanceStore';
import { attendanceService } from '../api/attendanceService';

export const AttendanceView = () => {
    const { user } = useAuthStore();
    const { userProfile } = useUserStore();
    const { attendanceLogs, refreshKey: attendanceRefreshKey } = useAttendanceStore();

    // Stats Data (State for API data, Init with Mock/Default)
    const [stats, setStats] = useState({
        lateCount: '-',
        overtimeMinutes: '-',
        totalWorkMinutes: '-',
    });

    // Derived state (Safe access)
    const userName = userProfile?.name;
    const isCreator = user?.role === 'CREATOR' || user?.memberRole === 'CREATOR' || userProfile?.role === 'CREATOR';

    // Fetch My Dashboard Stats
    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await attendanceService.getMyDashboardStats();
                if (data) {
                    setStats(prev => ({
                        ...prev,
                        lateCount: data.lateCount || 0,
                        overtimeMinutes: data.totalOvertimeMinutes || 0,
                        totalWorkMinutes: data.totalWorkMinutes || 0
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch my dashboard stats", error);
            }
        };
        fetchStats();
    }, [attendanceRefreshKey]); // Refresh stats when attendance changes




    // 프로필 데이터가 없으면 렌더링 안함 - AFTER all hooks
    if (!userProfile) {
        return null;
    }

    const getHoursMinutes = (minutes) => {
        if (typeof minutes !== 'number') return null;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return { h, m };
    };

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock color="#1f2937" size={32} />
                        <div>
                            <Title>나의 근태</Title>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                나의 근태 현황을 조회하고 관리합니다.
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
                            <CardTitle>이번달 총 근무 시간</CardTitle>
                            <Briefcase size={18} color="#d1d5db" />
                        </CardHeader>
                        <CardValueWrapper>
                            {(() => {
                                const timeObj = getHoursMinutes(stats.totalWorkMinutes);
                                return timeObj ? (
                                    <>
                                        <CardValue>{timeObj.h}</CardValue>
                                        <CardUnit>시간</CardUnit>
                                        <div style={{ width: '8px' }}></div>
                                        <CardValue>{timeObj.m}</CardValue>
                                        <CardUnit>분</CardUnit>
                                    </>
                                ) : (
                                    <CardValue>-</CardValue>
                                );
                            })()}
                        </CardValueWrapper>
                        <CardDescription>이번 달 총 누적 근무 시간입니다.</CardDescription>
                    </DashboardCard>

                </CardsGrid>

                <ContentSection>
                    <MyAttendance attendanceLogs={attendanceLogs} userName={userName} />
                </ContentSection>
            </ContentWrapper >
        </Container >
    );
};
