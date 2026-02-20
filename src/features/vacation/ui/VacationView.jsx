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

    // userProfile에서 잔여 연차 가져오기 (초기값)
    const profileRemainder = userProfile?.vacationRemainder ?? 15;
    const totalVacation = 15;

    // 잔여 연차 상태 (userProfile 기반 초기화로 중복 API 호출 제거)
    const [vacationStats, setVacationStats] = useState({
        total: totalVacation,
        used: totalVacation - profileRemainder,
        remaining: profileRemainder,
        approved: 0,
        pending: 0
    });

    // 휴가 통계 조회 (승인/미승인 건수만 - 잔여 연차는 userProfile에서 가져옴)
    // vacationRefreshKey 변경 시에만 잔여 연차도 새로고침
    useEffect(() => {
        const fetchStats = async () => {
            if (!memberId || isCreator) return;
            try {
                // 초기 로드: 통계만 조회 (잔여 연차는 userProfile 사용)
                // 휴가 변경 후 새로고침: 잔여 연차도 다시 조회
                const needsRemainderRefresh = vacationRefreshKey > 0;

                if (needsRemainderRefresh) {
                    const [remainder, stats] = await Promise.all([
                        vacationService.getMyVacationRemainder(memberId),
                        vacationService.getMyVacationStats(memberId)
                    ]);
                    setVacationStats({
                        total: remainder.totalVacation || totalVacation,
                        used: remainder.usedVacation || 0,
                        remaining: remainder.vacationRemainder || profileRemainder,
                        approved: stats.approvedCount || 0,
                        pending: stats.pendingCount || 0
                    });
                } else {
                    // 초기 로드: 통계만 조회
                    const stats = await vacationService.getMyVacationStats(memberId);
                    setVacationStats(prev => ({
                        ...prev,
                        approved: stats.approvedCount || 0,
                        pending: stats.pendingCount || 0
                    }));
                }
            } catch (error) {
                console.error('휴가 통계 조회 실패:', error);
            }
        };
        fetchStats();
    }, [memberId, vacationRefreshKey, isCreator, profileRemainder]);

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
