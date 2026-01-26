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
import { UserRole } from '../enums';
import { EMPLOYEE_PROFILE_DATA, ADMIN_PROFILE_DATA } from '../constants';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
    const { user, login } = useAuthStore();
    const {
        isVacationModalOpen, setChatOpen, closeVacationModal,
        isPhqModalOpen, closePhqModal,
        vacationForm, setVacationForm, resetVacationForm,
        setCurrentView // Keeping for now if needed, but primary nav is Router
    } = useUIStore();
    const {
        setUserProfile, setEmployees, initAttendanceLogs,
        addVacationLog: unusedAddVacationLog
    } = useOrgStore();

    const navigate = useNavigate();

    const { creators, creatorIssueLogs, setCreatorIssueLogs } = useCreatorStore();
    const { addVacationLog, vacationLogs } = useScheduleStore();
    const { userProfile } = useOrgStore();

    const handleLoginWrapper = (loggedInUser) => {
        login(loggedInUser);

        let newProfile = EMPLOYEE_PROFILE_DATA;
        let redirectPath = '/mypage';

        if (loggedInUser.role === UserRole.ADMIN) {
            newProfile = ADMIN_PROFILE_DATA;
            redirectPath = '/mypage';
        } else if (loggedInUser.role === UserRole.CREATOR) {
            const existingCreator = creators.find(c => c.id === loggedInUser.id);
            newProfile = {
                ...EMPLOYEE_PROFILE_DATA,
                name: loggedInUser.name,
                job: 'Creator',
                org: 'MCN',
                rank: '-',
                avatarUrl: existingCreator?.avatarUrl || loggedInUser.avatarUrl,
                coverUrl: existingCreator?.coverUrl || '',
                employeeId: loggedInUser.id,
                email: existingCreator?.contactInfo || loggedInUser.username + '@mcn.com',
                personalEmail: loggedInUser.username + '@gmail.com',
                phone: existingCreator?.contactInfo || '010-0000-0000',
                subscribers: existingCreator?.subscribers,
                category: existingCreator?.category,
                platform: existingCreator?.platform,
                manager: existingCreator?.manager,
            };
            redirectPath = '/creator-schedule';
        }

        setUserProfile(newProfile);
        // setCurrentView is no longer the primary driver, we navigate
        navigate(redirectPath);
    };

    useEffect(() => {
        initAttendanceLogs();
    }, [initAttendanceLogs]);

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
        alert(`${vacationForm.type} 신청이 완료되었습니다. (사용 일수: ${calculatedDays}일)`);
        resetVacationForm();
    };

    const handlePhqSubmit = (result) => {
        const newLog = {
            id: Date.now(),
            creator: user.name, // Assuming logged in user is the creator
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

    if (!user) {
        return <Login onLogin={handleLoginWrapper} />;
    }

    return (
        <>
            <GlobalStyles />
            <S.AppContainer>
                <Sidebar onLogout={() => { login(null); setChatOpen(false); navigate('/'); }} />

                <Routes>
                    <Route path="/" element={<Navigate to="/mypage" replace />} />
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

                    {/* Admin Views */}
                    <Route path="/admin-creator-list" element={<CreatorManagerView view="admin-creator-list" />} />
                    <Route path="/admin-creator-contract" element={<CreatorManagerView view="admin-creator-contract" />} />
                    <Route path="/admin-creator-health" element={<CreatorManagerView view="admin-creator-health" />} />

                    {/* Employee Views */}
                    <Route path="/employee-creator-list" element={<CreatorManagerView view="employee-creator-list" />} />
                    <Route path="/employee-creator-calendar" element={<CreatorManagerView view="employee-creator-calendar" />} />
                    <Route path="/employee-creator-ads" element={<CreatorManagerView view="employee-creator-ads" />} />
                    <Route path="/employee-creator-health" element={<CreatorManagerView view="employee-creator-health" />} />
                    <Route path="/employee-creator-support" element={<CreatorManagerView view="employee-creator-support" />} />

                    {/* Fallback for "my-creator", "creator-schedule" etc legacy names if needed, mapping to CreatorManagerView */}
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
