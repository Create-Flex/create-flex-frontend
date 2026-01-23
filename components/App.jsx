import React, { useState, useMemo } from 'react';
/* Fix: Corrected relative paths for components in the same directory */
import { Login } from './Login';
import { Sidebar } from './Sidebar';
import { ProfileView } from './ProfileView';
import { ScheduleView } from './ScheduleView';
import { OrgChartView } from './OrgChartView';
import { CreatorManagerView } from './CreatorManagerView';
import { AttendanceView } from './AttendanceView';
import { HRDashboardView } from './HRDashboardView';
import { TeamView } from './TeamView';
/* Fix: Corrected relative paths for types and constants located in the parent directory */
import { UserRole } from '../enums';
import {
    EMPLOYEE_PROFILE_DATA, ADMIN_PROFILE_DATA, INITIAL_VACATION_LOGS,
    INITIAL_TEAMS, INITIAL_EMPLOYEES, INITIAL_HEALTH_RECORDS, INITIAL_SCHEDULE_EVENTS, INITIAL_SCHEDULE_TEMPLATES,
    INITIAL_DEPARTMENTS
} from '../constants';
/* Fix: Corrected relative path for CreatorShared in the same directory */
import { INITIAL_CREATORS, INITIAL_EVENTS, INITIAL_TASKS } from './creator/shared/constants';
import { X, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift } from 'lucide-react';

const INITIAL_CREATOR_HEALTH = [
    { id: '1', name: '슈카월드', lastCheck: '2023-12-10', score: 95, result: '정상', status: '재직중' },
    { id: '2', name: '침착맨', lastCheck: '2023-11-05', score: 65, result: '주의', status: '재직중' },
    { id: '3', name: '요리보고', lastCheck: '2024-01-05', score: 88, result: '정상', status: '대기중' },
    { id: '4', name: '여행가제이', lastCheck: '2023-09-20', score: 45, result: '위험', status: '재직중' },
    { id: '6', name: '치즈냥이', lastCheck: '2024-01-10', score: 0, result: '재검필요', status: '재직중' },
];

const INITIAL_CREATOR_ISSUES = [
    { id: 1, creator: '침착맨', date: '2024-01-15', category: '경미', description: '최근 방송 중 피로감 호소, 가벼운 번아웃 증상', status: '상담중' },
    { id: 2, creator: '치즈냥이', date: '2024-01-18', category: '심각', description: '불면증 및 무기력증 호소, 전문 상담 권고', status: '휴식권고' },
    { id: 3, creator: '슈카월드', date: '2023-12-20', category: '정상', description: '정기 심리 상담 결과 양호, 특이사항 없음', status: '모니터링' },
];

const INITIAL_SUPPORT_REQUESTS = [
    { id: 'sr-1', creatorId: '2', creatorName: '침착맨', type: 'legal', title: '저작권 관련 문의', content: '유튜브 영상 내 BGM 사용 관련 저작권 침해 경고 발생 건', requestDate: '2024-01-25', status: '진행중' },
    { id: 'sr-2', creatorId: '5', creatorName: '겜돌이', type: 'tax', title: '종합소득세 신고', content: '2023년 귀속 종합소득세 신고 자료 준비 요청', requestDate: '2024-01-20', status: '완료' },
];

function App() {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('mypage');
    const [userProfile, setUserProfile] = useState(EMPLOYEE_PROFILE_DATA);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [creators, setCreators] = useState(INITIAL_CREATORS);
    const [vacationLogs, setVacationLogs] = useState(INITIAL_VACATION_LOGS);
    const [teams, setTeams] = useState(INITIAL_TEAMS);
    const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
    const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);

    // Shared States (Global)
    const [employeeHealthRecords, setEmployeeHealthRecords] = useState(INITIAL_HEALTH_RECORDS);
    const [scheduleEvents, setScheduleEvents] = useState(INITIAL_SCHEDULE_EVENTS);
    const [scheduleTemplates, setScheduleTemplates] = useState(INITIAL_SCHEDULE_TEMPLATES);

    // Task State - Globalized for synchronization
    const [allTasks, setAllTasks] = useState(() => {
        const flatList = [];
        Object.entries(INITIAL_TASKS).forEach(([cId, tasks]) => {
            tasks.forEach(t => flatList.push({ ...t, creatorId: cId }));
        });
        return flatList;
    });

    // Creator Health & Events & Support
    const [creatorHealthRecords, setCreatorHealthRecords] = useState(INITIAL_CREATOR_HEALTH);
    const [creatorIssueLogs, setCreatorIssueLogs] = useState(INITIAL_CREATOR_ISSUES);
    const [creatorEvents, setCreatorEvents] = useState(INITIAL_EVENTS);
    const [supportRequests, setSupportRequests] = useState(INITIAL_SUPPORT_REQUESTS);

    // Chat & Global Modal States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);

    // PHQ-9 Survey State (Employee Self-Check)
    const [isPhqModalOpen, setIsPhqModalOpen] = useState(false);

    // Global Vacation Form State
    const [vacationForm, setVacationForm] = useState({
        type: '연차', startDate: '', endDate: '', reason: '',
        location: '', emergencyContact: '', workGoals: '', handover: '',
        relationship: '', eventType: '', symptoms: '', hospital: ''
    });

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        if (loggedInUser.role === UserRole.ADMIN) {
            setUserProfile(ADMIN_PROFILE_DATA);
            setCurrentView('mypage');
        } else if (loggedInUser.role === UserRole.CREATOR) {
            // Find existing creator data if possible to populate profile
            const existingCreator = creators.find(c => c.id === loggedInUser.id);
            setUserProfile({
                ...EMPLOYEE_PROFILE_DATA,
                name: loggedInUser.name,
                job: 'Creator',
                org: 'MCN',
                rank: '-',
                // Use fresh data from creators list if available, otherwise login data
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
            });
            setCurrentView('creator-schedule');
        } else {
            setUserProfile(EMPLOYEE_PROFILE_DATA);
            setCurrentView('mypage');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setIsChatOpen(false);
    };

    const handleUpdateProfile = (updatedProfile) => {
        setUserProfile(updatedProfile);

        // Sync with Employees list
        setEmployees(prevEmployees => prevEmployees.map(emp =>
            emp.id === updatedProfile.employeeId
                ? {
                    ...emp,
                    name: updatedProfile.name,
                    engName: updatedProfile.engName,
                    nickname: updatedProfile.nickname,
                    email: updatedProfile.email,
                    personalEmail: updatedProfile.personalEmail,
                    phone: updatedProfile.phone,
                    avatarUrl: updatedProfile.avatarUrl,
                    coverUrl: updatedProfile.coverUrl
                }
                : emp
        ));

        // Sync with Creators list (If the user is a Creator)
        if (user?.role === UserRole.CREATOR) {
            setCreators(prevCreators => prevCreators.map(creator =>
                creator.id === user.id
                    ? {
                        ...creator,
                        name: updatedProfile.name,
                        avatarUrl: updatedProfile.avatarUrl,
                        coverUrl: updatedProfile.coverUrl || creator.coverUrl,
                        contactInfo: updatedProfile.phone,
                        // Keep other fields intact
                    }
                    : creator
            ));
        }
    };

    // Task Handlers moved to App for global sync
    const handleAddTask = (title, creatorId) => {
        const newTask = {
            id: Date.now().toString(),
            title,
            status: '진행중',
            assignee: user?.name || '미정',
            creatorId: creatorId
        };
        setAllTasks([...allTasks, newTask]);
    };

    const handleToggleTask = (taskId) => {
        setAllTasks(prev => prev.map(t =>
            t.id === taskId
                ? { ...t, status: t.status === '진행중' ? '완료됨' : '진행중' }
                : t
        ));
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm('업무를 삭제하시겠습니까?')) {
            setAllTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const handleUpdateCreators = (updatedCreators) => {
        setCreators(updatedCreators);
    };

    const handleAddHealthRecord = (newRecord) => {
        setEmployeeHealthRecords([newRecord, ...employeeHealthRecords]);
    };

    const handleAddSupportRequest = (newRequest) => {
        setSupportRequests([newRequest, ...supportRequests]);
    };

    // Attendance State (Global)
    const [attendanceLogs, setAttendanceLogs] = useState(() => {
        const logs = [];
        const todayStr = new Date().toISOString().split('T')[0];
        // Mock data for other employees
        employees.forEach(emp => {
            if (emp.name === '이채연') return; // Skip current user in mock generation
            logs.push({
                id: `${emp.id}-${todayStr}`,
                employeeId: emp.id,
                name: emp.name,
                date: todayStr,
                clockIn: '08:55',
                clockOut: '18:10',
                status: '정상',
                type: 'office'
            });
        });
        return logs;
    });

    const handleAddAttendanceLog = (log) => {
        setAttendanceLogs(prev => {
            const existingIndex = prev.findIndex(l => l.date === log.date && l.name === log.name);
            if (existingIndex >= 0) {
                const newLogs = [...prev];
                newLogs[existingIndex] = { ...newLogs[existingIndex], ...log };
                return newLogs;
            }
            return [log, ...prev];
        });
    };

    const handleVacationSubmit = () => {
        if (!vacationForm.startDate || !vacationForm.endDate) return alert('날짜를 선택해주세요.');

        const start = new Date(vacationForm.startDate);
        const end = new Date(vacationForm.endDate);

        if (end < start) return alert('종료일이 시작일보다 빠를 수 없습니다.');

        // 일수 계산 로직
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

        setVacationLogs([newLog, ...vacationLogs]);
        setIsVacationModalOpen(false);
        alert(`${vacationForm.type} 신청이 완료되었습니다. (사용 일수: ${calculatedDays}일)`);
        setVacationForm({
            type: '연차', startDate: '', endDate: '', reason: '',
            location: '', emergencyContact: '', workGoals: '', handover: '',
            relationship: '', eventType: '', symptoms: '', hospital: ''
        });
    };

    const pendingApprovals = vacationLogs.filter(log => log.status === '대기중').length;

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    const isCreator = user.role === UserRole.CREATOR;
    const creatorTasks = isCreator && user.id ? allTasks.filter(t => t.creatorId === user.id) : [];

    return (
        <div className="flex h-screen bg-white relative">
            <Sidebar
                user={user}
                userProfile={userProfile}
                onLogout={handleLogout}
                currentView={currentView}
                onNavigate={setCurrentView}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                pendingApprovals={vacationLogs.filter(v => v.status === '대기중' && v.type !== '워케이션').length}
                onOpenVacationModal={() => setIsVacationModalOpen(true)}
                onOpenPhqModal={() => setIsPhqModalOpen(true)}
                attendanceLogs={attendanceLogs}
                onAddAttendanceLog={handleAddAttendanceLog}
            />

            {currentView === 'mypage' && (
                <ProfileView
                    profile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                    vacationLogs={vacationLogs}
                    onAddHealthRecord={handleAddHealthRecord}
                    isCreator={isCreator}
                    tasks={creatorTasks}
                    onOpenPhqModal={() => setIsPhqModalOpen(true)}
                    onAddTask={(title) => isCreator && handleAddTask(title, user.id)}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onOpenVacationModal={() => setIsVacationModalOpen(true)}
                />
            )}

            {currentView === 'schedule' && (
                <ScheduleView
                    user={user}
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    events={scheduleEvents}
                    onUpdateEvents={setScheduleEvents}
                    templates={scheduleTemplates}
                    onUpdateTemplates={setScheduleTemplates}
                />
            )}

            {currentView === 'attendance' && (
                <AttendanceView
                    vacationLogs={vacationLogs}
                    onUpdateVacationLogs={setVacationLogs}
                    userName={userProfile.name}
                    attendanceLogs={attendanceLogs}
                />
            )}

            {(currentView === 'hr-staff' || currentView === 'hr-attendance' || currentView === 'hr-health' || currentView === 'hr-vacation' || currentView === 'hr-teams' || currentView === 'hr-support') && (
                <HRDashboardView
                    vacationLogs={vacationLogs}
                    onUpdateVacationLogs={setVacationLogs}
                    teams={teams}
                    onUpdateTeams={setTeams}
                    employees={employees}
                    onUpdateEmployees={setEmployees}
                    creators={creators}
                    employeeHealthRecords={employeeHealthRecords}
                    supportRequests={supportRequests}
                    onUpdateSupportRequests={setSupportRequests}
                    departments={departments}
                    attendanceLogs={attendanceLogs}
                    initialTab={
                        currentView === 'hr-staff' ? 'staff' :
                            currentView === 'hr-attendance' ? 'attendance' :
                                currentView === 'hr-health' ? 'health' :
                                    currentView === 'hr-vacation' ? 'vacation' :
                                        currentView === 'hr-support' ? 'support' : 'teams'
                    }
                />
            )}

            {currentView === 'org-chart' && (
                <OrgChartView
                    user={user}
                    departments={departments}
                    employees={employees}
                    onUpdateDepartments={setDepartments}
                />
            )}

            {currentView === 'team' && (
                <TeamView
                    user={user}
                    teams={teams}
                    employees={employees}
                    vacationLogs={vacationLogs}
                    creators={creators}
                />
            )}

            {(currentView === 'creator' || currentView === 'my-creator' || currentView === 'creator-schedule' || currentView === 'creator-health' || currentView === 'admin-creator-list' || currentView === 'admin-creator-contract' || currentView === 'admin-creator-health' ||
                currentView === 'employee-creator-calendar' || currentView === 'employee-creator-list' || currentView === 'employee-creator-ads' || currentView === 'employee-creator-health' || currentView === 'employee-creator-support') && (
                    <CreatorManagerView
                        user={user}
                        creators={creators}
                        onUpdateCreators={handleUpdateCreators}
                        healthRecords={creatorHealthRecords}
                        onUpdateHealthRecords={setCreatorHealthRecords}
                        issueLogs={creatorIssueLogs}
                        onUpdateIssueLogs={setCreatorIssueLogs}
                        employees={employees}
                        events={creatorEvents}
                        onUpdateEvents={setCreatorEvents}
                        onAddSupportRequest={handleAddSupportRequest}
                        currentView={currentView}
                        allTasks={allTasks}
                        onAddTask={handleAddTask}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        supportRequests={supportRequests}
                    />
                )}

            {isVacationModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsVacationModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-gray-900">휴가 신청</h3>
                            <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">휴가 종류</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['연차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setVacationForm({ ...vacationForm, type })}
                                            className={`py-2 rounded-lg text-sm border transition-all ${vacationForm.type === type ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {vacationForm.type === '워케이션' && (
                                <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100 animate-[fadeIn_0.2s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><MapPin size={12} /> 근무 장소</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 제주 오피스" value={vacationForm.location} onChange={e => setVacationForm({ ...vacationForm, location: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Phone size={12} /> 비상 연락망</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="예: 010-0000-0000" value={vacationForm.emergencyContact} onChange={e => setVacationForm({ ...vacationForm, emergencyContact: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Target size={12} /> 업무 계획</label>
                                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none" rows={2} placeholder="주요 업무 목표를 입력하세요" value={vacationForm.workGoals} onChange={e => setVacationForm({ ...vacationForm, workGoals: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><ClipboardList size={12} /> 업무 인계 사항</label>
                                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none" rows={2} placeholder="부재 시 담당자 및 업무 전달사항" value={vacationForm.handover} onChange={e => setVacationForm({ ...vacationForm, handover: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            {vacationForm.type === '경조사' && (
                                <div className="space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100 animate-[fadeIn_0.2s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">대상(관계)</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 본인, 부모 등" value={vacationForm.relationship} onChange={e => setVacationForm({ ...vacationForm, relationship: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">경조 내용</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 결혼, 장례 등" value={vacationForm.eventType} onChange={e => setVacationForm({ ...vacationForm, eventType: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {vacationForm.type === '병가' && (
                                <div className="space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-100 animate-[fadeIn_0.2s]">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Stethoscope size={14} /> 증상 및 사유</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="예: 독감으로 인한 고열 및 몸살" value={vacationForm.symptoms} onChange={e => setVacationForm({ ...vacationForm, symptoms: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><ClipboardList size={14} /> 진료 병원</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="병원명을 입력하세요" value={vacationForm.hospital} onChange={e => setVacationForm({ ...vacationForm, hospital: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">시작일</label>
                                    <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" value={vacationForm.startDate} onChange={e => setVacationForm({ ...vacationForm, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">종료일</label>
                                    <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" value={vacationForm.endDate} onChange={e => setVacationForm({ ...vacationForm, endDate: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">상세 사유 (선택)</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-black" rows={3} placeholder="추가적인 사유가 있다면 입력하세요" value={vacationForm.reason} onChange={e => setVacationForm({ ...vacationForm, reason: e.target.value })} />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0">
                            <button onClick={() => setIsVacationModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">취소</button>
                            <button onClick={handleVacationSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-sm transition-colors">신청 완료</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
