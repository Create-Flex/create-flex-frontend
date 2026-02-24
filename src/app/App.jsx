import React, { useEffect, useState } from 'react';
import { creatorService } from '../features/creator/api/creatorService';
import { GlobalStyles } from './GlobalStyles';
import * as S from './App.styled';
import { Login } from '../features/auth/ui/Login';
import { Sidebar } from '../components/Sidebar';
import { ProfileView } from '../features/employee/ui/ProfileView';
import { HealthPrivate } from '../features/health/ui/HealthPrivate';
import { ScheduleView } from '../features/calendar/ui/ScheduleView';
import { OrgChartView } from '../features/organization/ui/OrgChartView';
import { CreatorManagerView } from '../features/creator/ui/CreatorManagerView';
import { AttendanceView } from '../features/attendance/ui/AttendanceView';
import { VacationView } from '../features/vacation/ui/VacationView';
import { HRDashboardView } from '../components/HRDashboardView';
import { TeamView } from '../features/organization/ui/TeamView';
import { ChatPage } from '../features/chat/ui/ChatPage';
import { AiChatPanel } from '../features/ai/ui/AiChatPanel';
import { NotificationButton } from '../features/notification/ui/NotificationButton';
import { NotificationProvider } from '../features/notification/model/NotificationContext';
import { NotificationContainer } from '../features/notification/ui/NotificationContainer';
import { NotificationPanel } from '../features/notification/ui/NotificationPanel';
import QAListPage from '../features/qa_board/ui/QAListPage';
import QADetailPage from '../features/qa_board/ui/QADetailPage';
import QAQuestPage from '../features/qa_board/ui/QAQuestPage';
import QAAnswerPage from '../features/qa_board/ui/QAAnswerPage';

import { PhqSurveyModal } from '../features/health/ui/Health';
import { VacationModal } from '../features/vacation/ui/components/VacationModal';

import { useAuthStore } from '../features/auth/model/useAuthStore';
import { useUIStore } from '../shared/model/useUIStore';
import { useUserStore } from '../features/employee/model/useUserStore';
import { useAttendanceStore } from '../features/attendance/model/useAttendanceStore';
import { useHealthStore } from '../features/health/model/useHealthStore';
import { useCreatorStore } from '../features/creator/model/useCreatorStore';
import { authService } from '../features/auth/api/authService';
import { UserRole } from '../shared/constants/enums';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function App() {
    const { user, token, isAuthenticated, login, logout } = useAuthStore();
    const {
        isVacationModalOpen, setChatOpen, closeVacationModal,
        isPhqModalOpen, closePhqModal
    } = useUIStore();
    const { setUserProfile } = useUserStore();
    const { initAttendanceLogs } = useAttendanceStore();
    const { creatorIssueLogs, setCreatorIssueLogs } = useHealthStore();

    const navigate = useNavigate();

    const { creators } = useCreatorStore();

    // 로딩 상태
    const [isLoading, setIsLoading] = useState(true);

    // 앱 시작 시 토큰 검증 및 사용자 정보 복원

    const initAuth = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // 토큰으로 사용자 정보 가져오기
                const userInfo = await authService.getMyInfo();

                // Normalize user object: ensure 'id' exists for permission checks
                const authUser = {
                    ...userInfo,
                    id: userInfo.memberId || userInfo.id
                };
                login(authUser, token);



                const checkImage = async (url) => {
                    const DEFAULT_AVATAR = 'https://i.postimg.cc/bJSGpBqg/Gemini-Generated-Image-s33rl9s33rl9s33r-(1).png';
                    if (!url) return DEFAULT_AVATAR;

                    try {
                        const res = await fetch(url, { method: 'HEAD' });
                        return res.ok ? url : DEFAULT_AVATAR;
                    } catch {
                        return DEFAULT_AVATAR;
                    }
                };

                // 프로필 설정 (백엔드 데이터만 사용)
                let newProfile = null;
                if (userInfo.memberRole === 'ADMINISTRATOR' || userInfo.role === 'ADMINISTRATOR') {
                    // 관리자 - DTO 매핑
                    newProfile = {
                        // 공통 정보
                        employeeId: String(userInfo.memberId),
                        name: userInfo.memberName,
                        email: userInfo.corporEmail || userInfo.memberAccount,
                        role: userInfo.memberRole,
                        avatarUrl: await checkImage(userInfo.profileImage),
                        coverUrl: userInfo.profileBanner || '',
                        // 직원 상세 정보
                        job: userInfo.task || '-',
                        nickname: userInfo.nickname || '',
                        org: userInfo.departmentName || '-',
                        engName: userInfo.engName || '',
                        personalEmail: userInfo.personalEmail || '',
                        phone: userInfo.personalCall || '',
                        joinDate: userInfo.hireDate || '',
                        address: userInfo.address || '',
                        vacationRemainder: userInfo.vacationRemainder || 0,
                        rank: '관리자'
                    };
                } else if (userInfo.memberRole === 'CREATOR' || userInfo.role === 'CREATOR') {
                    // 크리에이터 상세 정보 조회
                    try {
                        const creatorInfo = await creatorService.getCreatorById(userInfo.memberId);
                        newProfile = {
                            employeeId: String(userInfo.memberId),
                            name: creatorInfo.member_name || userInfo.memberName,
                            email: creatorInfo.member_account || userInfo.memberAccount,
                            role: 'CREATOR',
                            avatarUrl: await checkImage(userInfo.profileImage),
                            coverUrl: creatorInfo.profile_banner || userInfo.profileBanner || '',
                            job: 'Creator',
                            org: 'MCN',
                            rank: '-',
                            // 크리에이터 전용 필드
                            subscribers: creatorInfo.creator_subscribe || '',
                            category: creatorInfo.creator_category || '',
                            platform: creatorInfo.creator_platform || '',
                            managerName: creatorInfo.manager_name || '',
                            creatorStatus: creatorInfo.creator_status || '',
                        };
                    } catch (creatorError) {
                        console.error('크리에이터 상세 정보 조회 실패:', creatorError);
                        // 기본 프로필로 설정
                        newProfile = {
                            name: userInfo.memberName || userInfo.name,
                            job: 'Creator',
                            org: 'MCN',
                            rank: '-',
                            avatarUrl: await checkImage(userInfo.profileImage),
                            coverUrl: userInfo.profileBanner || '',
                            employeeId: userInfo.memberId || userInfo.id,
                        };
                    }
                } else {
                    // 일반 직원 (General Employee) - DTO 매핑
                    newProfile = {
                        // 공통 정보
                        employeeId: String(userInfo.memberId),
                        name: userInfo.memberName,
                        email: userInfo.corporEmail || userInfo.memberAccount,
                        role: userInfo.memberRole,
                        avatarUrl: await checkImage(userInfo.profileImage),
                        coverUrl: userInfo.profileBanner || '',
                        // 직원 상세 정보
                        job: userInfo.task || '-',
                        nickname: userInfo.nickname || '',
                        org: userInfo.departmentName || '-',
                        engName: userInfo.engName || '',
                        personalEmail: userInfo.personalEmail || '',
                        phone: userInfo.personalCall || '',
                        joinDate: userInfo.hireDate || '',
                        address: userInfo.address || '',
                        vacationRemainder: userInfo.vacationRemainder || 0,
                        rank: '사원'
                    };
                }
                setUserProfile(newProfile);
            } catch (error) {
                console.error('토큰 검증 실패:', error);
                logout();
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            //initAuth();
            initAttendanceLogs();
        }
    }, [isAuthenticated, initAttendanceLogs]);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('로그아웃 API 에러:', error);
        } finally {
            logout();
            setChatOpen(false);
            navigate('/login');
        }
    };

    const handlePhqSubmit = (result) => {
        const newLog = {
            id: Date.now(),
            creator: user.name,
            date: result.date,
            category: result.category,
            description: `[PHQ-9 자가진단] 총점 ${result.score}점 - ${result.description}`,
            status: result.status,
            score: result.score
        };
        setCreatorIssueLogs([newLog, ...creatorIssueLogs]);
        toast.success('설문이 완료되었습니다. 결과가 담당 매니저에게 공유되었습니다.');
        closePhqModal();
    };

    // 로딩 중 및 비인증 상태 처리
    if (isLoading) {
        return (
            <>
                <GlobalStyles />
                <S.AppContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #00C471',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }} />
                        <p style={{ color: '#666' }}>로딩 중...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                </S.AppContainer>
            </>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <GlobalStyles />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </>
        );
    }

    return (
        <>
            <GlobalStyles />
            <NotificationProvider userId={user?.id} token={token}>
                <S.AppContainer>
                    <Sidebar onLogout={handleLogout} />

                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/mypage" replace />} />
                            <Route path="/login" element={<Navigate to="/mypage" replace />} />
                            <Route path="/mypage" element={<ProfileView />} />
                            <Route path="/health" element={<HealthPrivate />} />
                            <Route path="/schedule" element={<ScheduleView />} />
                            <Route path="/attendance" element={<AttendanceView />} />
                            <Route path="/vacation" element={<VacationView />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/qna" element={<QAListPage />} />
                            <Route path="/qna/detail" element={<QADetailPage />} />
                            <Route path="/qna/quest" element={<QAQuestPage />} />
                            <Route path="/qna/answer" element={<QAAnswerPage />} />

                            {/* HR Dashboard Routes */}
                            <Route path="/hr/staff" element={<HRDashboardView view="hr-staff" />} />
                            <Route path="/hr/attendance" element={<HRDashboardView view="hr-attendance" />} />
                            <Route path="/hr/health" element={<HRDashboardView view="hr-health" />} />
                            <Route path="/hr/vacation" element={<HRDashboardView view="hr-vacation" />} />
                            <Route path="/hr/teams" element={<HRDashboardView view="hr-teams" />} />
                            <Route path="/hr/support" element={<HRDashboardView view="hr-support" />} />

                            <Route path="/org-chart" element={<OrgChartView />} />
                            <Route path="/team" element={<TeamView />} />

                            {/* Creator Routes */}
                            <Route path="/creator/*" element={<CreatorManagerView />} />
                            <Route path="/admin-creator-list" element={<CreatorManagerView view="admin-creator-list" />} />
                            <Route path="/admin-creator-contract" element={<CreatorManagerView view="admin-creator-contract" />} />
                            <Route path="/admin-creator-health" element={<CreatorManagerView view="admin-creator-health" />} />
                            <Route path="/employee-creator-list" element={<CreatorManagerView view="employee-creator-list" />} />
                            <Route path="/employee-creator-calendar" element={<CreatorManagerView view="employee-creator-calendar" />} />
                            <Route path="/employee-creator-ads" element={<CreatorManagerView view="employee-creator-ads" />} />
                            <Route path="/employee-creator-health" element={<CreatorManagerView view="employee-creator-health" />} />
                            <Route path="/employee-creator-support" element={<CreatorManagerView view="employee-creator-support" />} />
                            <Route path="/creator-schedule" element={<CreatorManagerView view="creator-schedule" />} />
                            <Route path="/creator-health" element={<CreatorManagerView view="creator-health" />} />
                            <Route path="/my-creator" element={<CreatorManagerView view="my-creator" />} />

                            <Route path="*" element={<Navigate to="/mypage" replace />} />
                        </Routes>
                    </div>


                    {isVacationModalOpen && (
                        <VacationModal
                            isOpen={isVacationModalOpen}
                            onClose={closeVacationModal}
                        />
                    )}

                    {isPhqModalOpen && (
                        <PhqSurveyModal
                            onClose={closePhqModal}
                            onSubmit={handlePhqSubmit}
                        />
                    )}

                    {/* 알림 영역 */}
                    <NotificationContainer />
                    <NotificationPanel />
                    <NotificationButton />

                    {/* AI 챗봇 */}
                    <AiChatPanel />

                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            style: {
                                background: '#333',
                                color: '#fff',
                                fontSize: '0.875rem',
                                maxWidth: '500px',
                                padding: '16px 24px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#4ade80',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </S.AppContainer>
            </NotificationProvider>
        </>
    );
}

export default App;


