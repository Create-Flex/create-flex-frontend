import React, { useState, useEffect } from 'react';
import { Plane, CheckCircle2, Clock } from 'lucide-react';
import { MyVacation } from './components/MyVacation';
import { vacationService } from '../api/vacationService';
import { useAuthStore } from '../../auth/model/useAuthStore';
import { useUserStore } from '../../employee/model/useUserStore';
import { useVacationStore } from '../model/useVacationStore';
import {
    Container, ContentWrapper, Header, Title, CardsGrid, DashboardCard, CardHeader, CardTitle,
    CardValueWrapper, CardValue, CardUnit, VerticalStack, ProgressBarContainer, ProgressLabel, ProgressValue,
    ProgressBarBg, ProgressBarFill, ContentSection
} from './VacationView.styled';

export const VacationView = () => {
    const { user } = useAuthStore();
    const { userProfile } = useUserStore();
    const { refreshKey: vacationRefreshKey } = useVacationStore();

    // Derived state (Safe access)
    const memberId = user?.memberId || user?.id;
    const isCreator = user?.role === 'CREATOR' || user?.memberRole === 'CREATOR' || userProfile?.role === 'CREATOR';

    // 잔여 연차 상태
    const [vacationStats, setVacationStats] = useState({
        total: 15,
        used: 0,
        remaining: 15,
        approved: 0,
        pending: 0
    });

    // 잔여 연차 + 휴가 통계 조회 (휴가 신청/변경 시 자동 새로고침)
    useEffect(() => {
        const fetchStats = async () => {
            if (!memberId || isCreator) return;
            try {
                const [remainder, stats] = await Promise.all([
                    vacationService.getMyVacationRemainder(memberId),
                    vacationService.getMyVacationStats(memberId)
                ]);
                setVacationStats({
                    total: remainder.totalVacation || 15,
                    used: remainder.usedVacation || 0,
                    remaining: remainder.vacationRemainder || 15,
                    approved: stats.approvedCount || 0,
                    pending: stats.pendingCount || 0
                });
            } catch (error) {
                console.error('휴가 통계 조회 실패:', error);
            }
        };
        fetchStats();
    }, [memberId, vacationRefreshKey, isCreator]);

    // 프로필 데이터가 없으면 렌더링 안함
    if (!userProfile) {
        return null;
    }

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Plane color="#1f2937" size={32} />
                        <div>
                            <Title>나의 휴가</Title>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                나의 휴가 사용 내역과 잔여 연차를 조회하고 관리합니다.
                            </p>
                        </div>
                    </div>
                </Header>

                {/* Dashboard Cards */}
                <CardsGrid>
                    {!isCreator && (
                        <DashboardCard>
                            <CardHeader>
                                <CardTitle>잔여 연차</CardTitle>
                                <Plane size={18} color="#d1d5db" />
                            </CardHeader>
                            <CardValueWrapper>
                                <CardValue>{vacationStats.remaining}</CardValue>
                                <CardUnit>일</CardUnit>
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
                    )}
                    {!isCreator && (
                        <DashboardCard>
                            <CardHeader>
                                <CardTitle>승인된 휴가</CardTitle>
                                <CheckCircle2 size={18} color="#d1d5db" />
                            </CardHeader>
                            <CardValueWrapper>
                                <CardValue>{vacationStats.approved}</CardValue>
                                <CardUnit>건</CardUnit>
                            </CardValueWrapper>
                        </DashboardCard>
                    )}
                    {!isCreator && (
                        <DashboardCard>
                            <CardHeader>
                                <CardTitle>미승인 휴가</CardTitle>
                                <Clock size={18} color="#d1d5db" />
                            </CardHeader>
                            <CardValueWrapper>
                                <CardValue>{vacationStats.pending}</CardValue>
                                <CardUnit>건</CardUnit>
                            </CardValueWrapper>
                        </DashboardCard>
                    )}
                </CardsGrid>

                <ContentSection>
                    <MyVacation />
                </ContentSection>
            </ContentWrapper>
        </Container>
    );
};
