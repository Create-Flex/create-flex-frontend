import React, { useEffect } from 'react';
import { GlobalStyles } from './GlobalStyles';
import * as S from './App.styled';
import { Login } from './auth/login/Login';
import { Sidebar } from './Sidebar';
import { ProfileView } from './ProfileView';
import { ScheduleView } from './ScheduleView';
import { OrgChartView } from './OrgChartView';
import { CreatorManagerView } from './CreatorManagerView';
import { AttendanceView } from './AttendanceView';
import { HRDashboardView } from './HRDashboardView';
import { TeamView } from './TeamView';

import { PhqSurveyModal } from './creator/shared/Health';
import { VacationModal } from './modals/VacationModal';

import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';
import { useOrgStore } from '../stores/useOrgStore';
import { useCreatorStore } from '../stores/useCreatorStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { authService } from '../api/authService';
import { UserRole } from '../enums';
import { EMPLOYEE_PROFILE_DATA, ADMIN_PROFILE_DATA } from '../constants';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const {
        isVacationModalOpen, setChatOpen, closeVacationModal,
        isPhqModalOpen, closePhqModal,
        vacationForm, setVacationForm, resetVacationForm
    } = useUIStore();
    const {
        setUserProfile, initAttendanceLogs
    } = useOrgStore();

    const navigate = useNavigate();

    const { creators, creatorIssueLogs, setCreatorIssueLogs } = useCreatorStore();
    const { addVacationLog } = useScheduleStore();
    const { userProfile } = useOrgStore();

    // 앱 시작 시 토큰 검증 및 사용자 정보 복원
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (token && !isAuthenticated) {
                try {
                    // 토큰으로 사용자 정보 가져오기
                    const userInfo = await authService.getMyInfo();
                    login(userInfo, token);

                    // 프로필 설정
                    let newProfile = EMPLOYEE_PROFILE_DATA;
                    if (userInfo.memberRole === 'ADMINISTRATOR' || userInfo.role === 'ADMINISTRATOR') {
                        newProfile = ADMIN_PROFILE_DATA;
                    } else if (userInfo.memberRole === 'CREATOR' || userInfo.role === 'CREATOR') {
                        const existingCreator = creators.find(c => c.id === userInfo.memberId);
                        newProfile = {
                            ...EMPLOYEE_PROFILE_DATA,
                            name: userInfo.memberName || userInfo.name,
                            job: 'Creator',
                            org: 'MCN',
                            rank: '-',
                            avatarUrl: existingCreator?.avatarUrl || userInfo.avatarUrl,
                            coverUrl: existingCreator?.coverUrl || '',
                            employeeId: userInfo.memberId || userInfo.id,
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
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
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

    const handleVacationSubmit = () => {
        if (!vacationForm.startDate || !vacationForm.endDate) return alert('날짜를 선택해주세요.');

        const start = new Date(vacationForm.startDate);
        const end = new Date(vacationForm.endDate);
        if (end < start) return alert('종료일이 시작일보다 빠를 수 없습니다.');

        let calculatedDays = 1;
        if (vacationForm.type === '반차') {
            calculatedDays = 0.5;
        } else {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        const newLog = {
            id: Date.now(),
            name: userProfile.name,
            type: vacationForm.type,
            startDate: vacationForm.startDate,
            endDate: vacationForm.endDate,
            days: calculatedDays,
            requestDate: new Date().toISOString().split('T')[0],
            status: '대기중',
            reason: vacationForm.reason || `${vacationForm.type} 신청`,
            location: vacationForm.location,
            emergencyContact: vacationForm.emergencyContact,
            workGoals: vacationForm.workGoals,
            handover: vacationForm.handover,
            relationship: vacationForm.relationship,
            eventType: vacationForm.eventType,
            symptoms: vacationForm.symptoms,
            hospital: vacationForm.hospital
        };

        addVacationLog(newLog);
        closeVacationModal();
        alert(`${vacationForm.type} 신청이 완료되었습니다. (사용 일수: ${calculatedDays}일)`);
        resetVacationForm();
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
        alert('설문이 완료되었습니다. 결과가 담당 매니저에게 공유되었습니다.');
        closePhqModal();
    };

    // 로그인하지 않은 경우
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    // 로그인한 경우
    return (
        <>
            <GlobalStyles />
            <S.AppContainer>
                <Sidebar onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<Navigate to="/mypage" replace />} />
                    <Route path="/login" element={<Navigate to="/mypage" replace />} />
                    <Route path="/mypage" element={<ProfileView />} />
                    <Route path="/schedule" element={<ScheduleView />} />
                    <Route path="/attendance" element={<AttendanceView />} />

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

                {isVacationModalOpen && (
                    <VacationModal
                        isOpen={isVacationModalOpen}
                        onClose={closeVacationModal}
                        form={vacationForm}
                        setForm={setVacationForm}
                        onSubmit={handleVacationSubmit}
                    />
                )}

                {isPhqModalOpen && (
                    <PhqSurveyModal
                        onClose={closePhqModal}
                        onSubmit={handlePhqSubmit}
                    />
                )}
            </S.AppContainer>
        </>
    );
}

export default App;