import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../enums';
import * as S from './Sidebar.styled';
import {
    Settings, PanelLeftClose, PanelLeftOpen, LayoutGrid, Calendar,
    Clock, Users, UserCircle, Briefcase,
    LogOut, Activity, Palmtree, BarChart4, ClipboardList, Scale, FileText, Megaphone, Network,
    ChevronDown, ChevronRight
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';
import { useUserStore } from '../stores/useUserStore';
import { useAttendanceStore } from '../stores/useAttendanceStore';
import { useVacationStore } from '../stores/useVacationStore';
import { attendanceService } from '../api/attendanceService';
import { vacationService } from '../api/vacationService';

const CalendarWidget = () => {
    // Local state for calendar widget navigation is fine to keep local
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<span key={`empty-${i}`}></span>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
        days.push(
            <S.CalendarKey
                key={d}
                $isToday={isToday}
            >
                {d}
            </S.CalendarKey>
        );
    }

    return (
        <S.CalendarContainer>
            <S.CalendarHeader>
                <S.CalendarTitle>
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </S.CalendarTitle>
                <S.CalendarNav>
                    <S.CalendarNavButton onClick={handlePrevMonth}>&lt;</S.CalendarNavButton>
                    <S.CalendarNavButton onClick={handleNextMonth}>&gt;</S.CalendarNavButton>
                </S.CalendarNav>
            </S.CalendarHeader>
            <S.CalendarDaysHeader>
                <S.CalendarDayLabel $red>일</S.CalendarDayLabel>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span>토</span>
            </S.CalendarDaysHeader>
            <S.CalendarGrid>
                {days}
            </S.CalendarGrid>
        </S.CalendarContainer>
    )
}

export const Sidebar = ({ onLogout }) => {
    // onLogout is passed from App.jsx's wrapper to handle multiple store updates if needed, 
    // or we can consume useAuthStore directly for the actual logout action.
    // App.jsx passed `() => { login(null); setChatOpen(false); }` as onLogout.
    // So we use the prop or implementing it here? 
    // I prefer using the prop if passed, but for "pure store" approach, we can do it here. 
    // However, App.jsx already passes it. I'll use the prop to align with App.jsx refactor.

    const { user } = useAuthStore();
    const {
        openVacationModal, openPhqModal
    } = useUIStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile } = useUserStore();
    const { attendanceLogs, addAttendanceLog, triggerRefresh: triggerAttendanceRefresh, refreshKey: attendanceRefreshKey } = useAttendanceStore();
    const { refreshKey: vacationRefreshKey } = useVacationStore();

    // 미승인 휴가 건수 (백엔드에서 조회)
    const [pendingApprovals, setPendingApprovals] = useState(0);

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Accordion states for sections
    const [isHrExpanded, setIsHrExpanded] = useState(true);
    const [isCreatorExpanded, setIsCreatorExpanded] = useState(true);

    const [workSeconds, setWorkSeconds] = useState(0);
    const [lastWorkRecord, setLastWorkRecord] = useState(null);

    const [attendanceState, setAttendanceState] = useState({ inTime: null, outTime: null, isLate: false, isEarlyLeave: false });
    const [dayProgress, setDayProgress] = useState(0);

    const timerRef = useRef(null);

    // Derived state (will be used after hooks, safe since they're just variable declarations)
    const isAdmin = user?.role === UserRole.ADMINISTRATOR || user?.memberRole === 'ADMINISTRATOR';
    const isManager = user?.role === UserRole.MANAGER || user?.memberRole === 'MANAGER';
    const isCreator = user?.role === UserRole.CREATOR || user?.memberRole === 'CREATOR';
    const isEmployee = user?.role === UserRole.EMPLOYEE || user?.memberRole === 'EMPLOYEE';

    // Sync local state with global attendanceLogs on mount/update
    // Sync local state with real backend API on mount/update
    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) return;
            // 크리에이터는 근태 API 접근 권한 없음
            const userIsCreator = user?.role === UserRole.CREATOR || user?.memberRole === 'CREATOR';
            if (userIsCreator) return;
            try {
                const todayStr = new Date().toISOString().split('T')[0];
                const logs = await attendanceService.getMyAttendance({ startDate: todayStr, endDate: todayStr });

                // Assuming logs is an array of attendance records
                const myLog = logs.find(l => l.attendanceDate === todayStr);

                if (myLog) {
                    const inTime = myLog.attendanceStart ? myLog.attendanceStart.split('T')[1].substring(0, 5) : null;
                    const outTime = myLog.attendanceEnd ? myLog.attendanceEnd.split('T')[1].substring(0, 5) : null;

                    if (inTime && !outTime) {
                        // Currently clocked in
                        setIsClockedIn(true);
                        setAttendanceState({
                            inTime: inTime,
                            outTime: null,
                            isLate: myLog.attendanceStatus === 'LATE' || myLog.attendanceStatus === '지각',
                            isEarlyLeave: false
                        });

                        // Calculate seconds since clock in for the timer
                        const [hours, minutes] = inTime.split(':').map(Number);
                        const now = new Date();
                        const clockInTime = new Date(now);
                        clockInTime.setHours(hours, minutes, 0, 0);
                        const diffSeconds = Math.floor((now - clockInTime) / 1000);
                        setWorkSeconds(diffSeconds > 0 ? diffSeconds : 0);

                    } else if (inTime && outTime) {
                        // Clocked out for today
                        setIsClockedIn(false);
                        setAttendanceState({
                            inTime: inTime,
                            outTime: outTime,
                            isLate: myLog.attendanceStatus === 'LATE' || myLog.attendanceStatus === '지각',
                            isEarlyLeave: false
                        });

                        // Calculate duration for validation
                        // Only show last work record if logged out
                        // Calculate formatted duration
                        const [h1, m1] = inTime.split(':').map(Number);
                        const [h2, m2] = outTime.split(':').map(Number);
                        const d1 = new Date(); d1.setHours(h1, m1, 0);
                        const d2 = new Date(); d2.setHours(h2, m2, 0);
                        const diff = (d2 - d1) / 1000;
                        setLastWorkRecord(formatTime(diff));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch attendance status", error);
            }
        };
        fetchStatus();
    }, [user, attendanceLogs, attendanceRefreshKey]); // Also watch refreshKey for auto-update after check-in/out

    useEffect(() => {
        if (isClockedIn) {
            timerRef.current = window.setInterval(() => {
                setWorkSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isClockedIn]);

    useEffect(() => {
        const updateDayProgress = () => {
            const now = new Date();
            const start = new Date(now);
            start.setHours(9, 0, 0, 0);
            const end = new Date(now);
            end.setHours(18, 0, 0, 0);
            const total = end.getTime() - start.getTime();
            const current = now.getTime() - start.getTime();
            let pct = (current / total) * 100;
            if (pct < 0) pct = 0;
            if (pct > 100) pct = 100;
            setDayProgress(pct);
        };
        updateDayProgress();
        const interval = setInterval(updateDayProgress, 60000);
        return () => clearInterval(interval);
    }, []);

    // 미승인 휴가 건수 조회 (관리자용)
    useEffect(() => {
        const fetchPendingCount = async () => {
            const userIsAdmin = user?.role === UserRole.ADMINISTRATOR || user?.memberRole === 'ADMINISTRATOR';
            // 관리자만 휴가 전체 목록 조회 API 호출 가능 (매니저는 403 오류 발생)
            if (!userIsAdmin) return;
            try {
                // 전체 미승인 건수를 조회하기 위해 넓은 날짜 범위 사용
                const listData = await vacationService.getAllVacations({
                    startDate: '2020-01-01',
                    endDate: '2030-12-31'
                });
                const pendingCount = listData.filter(v => v.vacationApprove === 'APPROVE_NEED').length;
                setPendingApprovals(pendingCount);
            } catch (error) {
                console.error('미승인 휴가 건수 조회 실패:', error);
            }
        };
        fetchPendingCount();
    }, [user, vacationRefreshKey]);

    // Safety check - must be AFTER all hooks
    if (!user || !userProfile) return null;

    const handleClockInOut = async () => {
        if (!user) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

        try {
            if (!isClockedIn) {
                // Processing Clock In
                await attendanceService.checkIn();
                alert('출근 처리되었습니다.');

                // Optimistic UI Update
                setWorkSeconds(0);
                setLastWorkRecord(null);
                setIsClockedIn(true);

                const nineAM = new Date(now);
                nineAM.setHours(9, 0, 0, 0);
                const isLate = now.getTime() > nineAM.getTime();

                setAttendanceState(prev => ({ ...prev, inTime: timeString, isLate: isLate, outTime: null, isEarlyLeave: false }));

                // Trigger refresh for other components
                if (triggerAttendanceRefresh) triggerAttendanceRefresh();

            } else {
                // Processing Clock Out
                await attendanceService.checkOut();
                alert('퇴근 처리되었습니다.');

                setIsClockedIn(false);
                // Last work record calc
                setLastWorkRecord(formatTime(workSeconds));

                setAttendanceState(prev => ({ ...prev, outTime: timeString }));

                // Trigger refresh for other components
                if (triggerAttendanceRefresh) triggerAttendanceRefresh();
            }
        } catch (error) {
            console.error(error);
            alert('요청 처리 중 오류가 발생했습니다.');
        }
    };

    // Helper to format '9h 15m' style
    const formatHours = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <S.SidebarContainer $isCollapsed={isCollapsed}>
            <S.Header $isCollapsed={isCollapsed}>
                {!isCollapsed && (
                    <S.IconGroup>
                        <S.LogoutButton onClick={onLogout} title="로그아웃"><LogOut size={16} /></S.LogoutButton>
                        <S.IconButton onClick={() => alert("설정 페이지는 준비 중입니다.")} title="설정"><Settings size={16} /></S.IconButton>
                    </S.IconGroup>
                )}
                <S.CollapseButton>
                    {isCollapsed ? (
                        <S.IconButton onClick={() => setIsCollapsed(false)} title="사이드바 펼치기"><PanelLeftOpen size={16} /></S.IconButton>
                    ) : (
                        <S.IconButton onClick={() => setIsCollapsed(true)} title="사이드바 접기"><PanelLeftClose size={16} /></S.IconButton>
                    )}
                </S.CollapseButton>
            </S.Header>

            <S.Section>
                {!isCollapsed ? (
                    <>
                        <S.SectionTitle>내 정보</S.SectionTitle>
                        <S.UserProfileCard onClick={() => navigate('/mypage')}>
                            <S.UserAvatar src={user.avatarUrl || userProfile.avatarUrl} alt="profile" />
                            <S.UserInfo>
                                <S.UserName>{user.name || user.memberName}</S.UserName>
                                <S.UserRoleText>{user.departmentName || user.jobTitle || user.memberRole}</S.UserRoleText>
                                <S.TagGroup>
                                    {user.tags && user.tags.map((tag, i) => (
                                        <S.Tag key={i} $active={tag === '재직중' || tag === '계약중'}>
                                            {tag}
                                        </S.Tag>
                                    ))}
                                </S.TagGroup>
                            </S.UserInfo>
                        </S.UserProfileCard>

                        {/* ... Logic for displaying actions ... */}
                        {!isCreator ? (
                            <S.ActionButtonGroup>
                                <S.ActionButton
                                    $variant={isClockedIn ? 'clockOut' : 'clockIn'}
                                    onClick={handleClockInOut}
                                >
                                    {isClockedIn ? '퇴근하기' : '출근하기'}
                                </S.ActionButton>
                                <S.ActionButton
                                    $variant="default"
                                    onClick={openVacationModal}
                                >
                                    휴가 신청
                                </S.ActionButton>
                            </S.ActionButtonGroup>
                        ) : (
                            <S.Section>
                                <S.CreatorSurveyButton onClick={openPhqModal}>
                                    <ClipboardList size={16} /> 설문조사
                                </S.CreatorSurveyButton>
                                <S.SurveyText>정기적인 건강 설문으로 상태를 체크하세요.</S.SurveyText>
                            </S.Section>
                        )}

                        {!isCreator && (
                            <S.AttendanceInfoContainer>
                                <S.InfoHeader>
                                    <S.InfoTitle>{isClockedIn ? '현재 근무 시간' : '오늘 근무 기록'}</S.InfoTitle>
                                </S.InfoHeader>
                                <S.TimerDisplay>
                                    <S.TimerText $active={isClockedIn}>{isClockedIn ? formatTime(workSeconds) : lastWorkRecord || '00:00:00'}</S.TimerText>
                                </S.TimerDisplay>
                                <S.ProgressBarContainer>
                                    <S.ProgressBarFill $width={dayProgress} />
                                </S.ProgressBarContainer>
                                <S.AttendanceTimes>
                                    <S.TimeItem>
                                        <S.TimeLabel>출근</S.TimeLabel>
                                        {attendanceState.inTime ? <S.TimeValue $variant={attendanceState.isLate ? 'late' : 'normal'}>{attendanceState.inTime}</S.TimeValue> : <S.TimeValue $variant="empty">--:--</S.TimeValue>}
                                    </S.TimeItem>
                                    <S.TimeItem>
                                        <S.TimeLabel>퇴근</S.TimeLabel>
                                        {attendanceState.outTime ? <S.TimeValue $variant={attendanceState.isEarlyLeave ? 'early' : 'normal'}>{attendanceState.outTime}</S.TimeValue> : <S.TimeValue $variant="empty">--:--</S.TimeValue>}
                                    </S.TimeItem>
                                </S.AttendanceTimes>
                            </S.AttendanceInfoContainer>
                        )}
                    </>
                ) : (
                    <S.UserProfileCard onClick={() => navigate('/mypage')} style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                        <S.UserAvatar $small src={user.avatarUrl || userProfile.avatarUrl} alt="profile" title={user.name} />
                    </S.UserProfileCard>
                )}
            </S.Section>

            <S.MainContent>
                {isAdmin ? (
                    <>
                        {!isCollapsed && <S.SectionTitle $mt $px>개인 업무</S.SectionTitle>}
                        <S.NavContainer>
                            <S.NavItem onClick={() => navigate('/mypage')} $isActive={location.pathname === '/mypage'} $center={isCollapsed} title="마이페이지">
                                <LayoutGrid size={16} />{!isCollapsed && <S.NavText>마이페이지</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/schedule')} $isActive={location.pathname === '/schedule'} $center={isCollapsed} title="나의 일정">
                                <Calendar size={16} />{!isCollapsed && <S.NavText>나의 일정</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/attendance')} $isActive={location.pathname === '/attendance'} $center={isCollapsed} title="나의 근태/휴가">
                                <Clock size={16} />{!isCollapsed && <S.NavText>나의 근태/휴가</S.NavText>}
                            </S.NavItem>
                        </S.NavContainer>

                        {/* 인사/운영 관리 Section with Accordion */}
                        <S.AccordionHeader
                            $center={isCollapsed}
                            onClick={() => !isCollapsed && setIsHrExpanded(!isHrExpanded)}
                        >
                            {!isCollapsed && (
                                <>
                                    <S.AccordionIcon>
                                        {isHrExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </S.AccordionIcon>
                                    <S.AccordionTitle>인사/운영 관리</S.AccordionTitle>
                                </>
                            )}
                        </S.AccordionHeader>

                        {(isHrExpanded || isCollapsed) && (
                            <S.NavContainer $animate>
                                <S.NavItem onClick={() => navigate('/hr/staff')} $isActive={location.pathname === '/hr/staff'} $center={isCollapsed} title="직원 관리">
                                    <Users size={16} />{!isCollapsed && <S.NavText>직원 관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/hr/attendance')} $isActive={location.pathname === '/hr/attendance'} $center={isCollapsed} title="근태 관리">
                                    <BarChart4 size={16} />{!isCollapsed && <S.NavText>근태 관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/hr/health')} $isActive={location.pathname === '/hr/health'} $center={isCollapsed} title="건강 관리">
                                    <Activity size={16} />{!isCollapsed && <S.NavText>건강 관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/hr/vacation')} $isActive={location.pathname === '/hr/vacation'} $center={isCollapsed} title="휴가 관리">
                                    <Palmtree size={16} />
                                    {!isCollapsed && <S.NavText>휴가 관리</S.NavText>}
                                    {pendingApprovals > 0 && (
                                        <S.Badge $isCollapsed={isCollapsed}>{pendingApprovals}</S.Badge>
                                    )}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/org-chart')} $isActive={location.pathname === '/org-chart'} $center={isCollapsed} title="회사 조직도">
                                    <Briefcase size={16} />{!isCollapsed && <S.NavText>회사 조직도</S.NavText>}
                                </S.NavItem>
                            </S.NavContainer>
                        )}

                        {/* 크리에이터 관리 Section with Accordion */}
                        <S.AccordionHeader
                            $center={isCollapsed}
                            onClick={() => !isCollapsed && setIsCreatorExpanded(!isCreatorExpanded)}
                        >
                            {!isCollapsed && (
                                <>
                                    <S.AccordionIcon>
                                        {isCreatorExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </S.AccordionIcon>
                                    <S.AccordionTitle>크리에이터 관리</S.AccordionTitle>
                                </>
                            )}
                        </S.AccordionHeader>

                        {(isCreatorExpanded || isCollapsed) && (
                            <S.NavContainer $animate>
                                <S.NavItem onClick={() => navigate('/admin-creator-list')} $isActive={location.pathname === '/admin-creator-list'} $center={isCollapsed} title="크리에이터 목록관리">
                                    <Users size={16} />{!isCollapsed && <S.NavText>크리에이터 목록관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/hr/teams')} $isActive={location.pathname === '/hr/teams'} $center={isCollapsed} title="크리에이터 팀 관리">
                                    <Network size={16} />{!isCollapsed && <S.NavText>크리에이터 팀 관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/admin-creator-contract')} $isActive={location.pathname === '/admin-creator-contract'} $center={isCollapsed} title="크리에이터 계약관리">
                                    <FileText size={16} />{!isCollapsed && <S.NavText>크리에이터 계약관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/admin-creator-health')} $isActive={location.pathname === '/admin-creator-health'} $center={isCollapsed} title="크리에이터 건강관리">
                                    <Activity size={16} />{!isCollapsed && <S.NavText>크리에이터 건강관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/hr/support')} $isActive={location.pathname === '/hr/support'} $center={isCollapsed} title="법률/세무 지원 관리">
                                    <Scale size={16} />{!isCollapsed && <S.NavText>법률/세무 지원 관리</S.NavText>}
                                </S.NavItem>
                            </S.NavContainer>
                        )}
                    </>
                ) : isManager ? (
                    // MANAGER: 개인업무 + 크리에이터 관리(담당)
                    <>
                        {!isCollapsed && <S.SectionTitle $mt $px>개인 업무</S.SectionTitle>}
                        <S.NavContainer>
                            <S.NavItem onClick={() => navigate('/mypage')} $isActive={location.pathname === '/mypage'} $center={isCollapsed} title="마이페이지">
                                <LayoutGrid size={16} />{!isCollapsed && <S.NavText>마이페이지</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/schedule')} $isActive={location.pathname === '/schedule'} $center={isCollapsed} title="나의 일정">
                                <Calendar size={16} />{!isCollapsed && <S.NavText>나의 일정</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/attendance')} $isActive={location.pathname === '/attendance'} $center={isCollapsed} title="나의 근태/휴가">
                                <Clock size={16} />{!isCollapsed && <S.NavText>나의 근태/휴가</S.NavText>}
                            </S.NavItem>
                        </S.NavContainer>

                        {/* 매니저용 크리에이터 관리 Section with Accordion */}
                        <S.AccordionHeader
                            $center={isCollapsed}
                            onClick={() => !isCollapsed && setIsCreatorExpanded(!isCreatorExpanded)}
                        >
                            {!isCollapsed && (
                                <>
                                    <S.AccordionIcon>
                                        {isCreatorExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </S.AccordionIcon>
                                    <S.AccordionTitle>크리에이터 관리</S.AccordionTitle>
                                </>
                            )}
                        </S.AccordionHeader>

                        {(isCreatorExpanded || isCollapsed) && (
                            <S.NavContainer $animate>
                                <S.NavItem onClick={() => navigate('/team')} $isActive={location.pathname === '/team'} $center={isCollapsed} title="팀 현황">
                                    <Users size={16} />{!isCollapsed && <S.NavText>팀 현황</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/employee-creator-calendar')} $isActive={location.pathname === '/employee-creator-calendar'} $center={isCollapsed} title="일정 캘린더">
                                    <Calendar size={16} />{!isCollapsed && <S.NavText>일정 캘린더</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/employee-creator-list')} $isActive={location.pathname === '/employee-creator-list'} $center={isCollapsed} title="내 담당 크리에이터">
                                    <UserCircle size={16} />{!isCollapsed && <S.NavText>내 담당 크리에이터</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/employee-creator-ads')} $isActive={location.pathname === '/employee-creator-ads'} $center={isCollapsed} title="광고 캠페인 관리">
                                    <Megaphone size={16} />{!isCollapsed && <S.NavText>광고 캠페인 관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/employee-creator-health')} $isActive={location.pathname === '/employee-creator-health'} $center={isCollapsed} title="크리에이터 건강관리">
                                    <Activity size={16} />{!isCollapsed && <S.NavText>크리에이터 건강관리</S.NavText>}
                                </S.NavItem>
                                <S.NavItem onClick={() => navigate('/employee-creator-support')} $isActive={location.pathname === '/employee-creator-support'} $center={isCollapsed} title="법률/세무 연결">
                                    <Scale size={16} />{!isCollapsed && <S.NavText>법률/세무 연결</S.NavText>}
                                </S.NavItem>
                            </S.NavContainer>
                        )}
                    </>
                ) : isCreator ? (
                    // CREATOR: 활동관리만
                    <>
                        {!isCollapsed && <S.SectionTitle $mt $px>활동 관리</S.SectionTitle>}
                        <S.NavContainer>
                            <S.NavItem onClick={() => navigate('/mypage')} $isActive={location.pathname === '/mypage'} $center={isCollapsed} title="마이페이지">
                                <LayoutGrid size={16} />{!isCollapsed && <S.NavText>마이페이지</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/creator-schedule')} $isActive={location.pathname === '/creator-schedule'} $center={isCollapsed} title="나의 일정">
                                <Calendar size={16} />{!isCollapsed && <S.NavText>나의 일정</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/creator-health')} $isActive={location.pathname === '/creator-health'} $center={isCollapsed} title="건강 관리">
                                <Activity size={16} />{!isCollapsed && <S.NavText>건강 관리</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/team')} $isActive={location.pathname === '/team'} $center={isCollapsed} title="팀 현황">
                                <Users size={16} />{!isCollapsed && <S.NavText>팀 현황</S.NavText>}
                            </S.NavItem>
                        </S.NavContainer>
                    </>
                ) : (
                    // EMPLOYEE: 개인업무만
                    <>
                        {!isCollapsed && <S.SectionTitle $mt $px>개인 업무</S.SectionTitle>}
                        <S.NavContainer>
                            <S.NavItem onClick={() => navigate('/mypage')} $isActive={location.pathname === '/mypage'} $center={isCollapsed} title="마이페이지">
                                <LayoutGrid size={16} />{!isCollapsed && <S.NavText>마이페이지</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/schedule')} $isActive={location.pathname === '/schedule'} $center={isCollapsed} title="나의 일정">
                                <Calendar size={16} />{!isCollapsed && <S.NavText>나의 일정</S.NavText>}
                            </S.NavItem>
                            <S.NavItem onClick={() => navigate('/attendance')} $isActive={location.pathname === '/attendance'} $center={isCollapsed} title="나의 근태/휴가">
                                <Clock size={16} />{!isCollapsed && <S.NavText>나의 근태/휴가</S.NavText>}
                            </S.NavItem>
                        </S.NavContainer>
                    </>
                )}
                {!isCreator && !isCollapsed && (
                    <S.CalendarWidgetWrapper onClick={() => navigate('/schedule')}>
                        <S.CalendarWrapper>
                            <CalendarWidget />
                        </S.CalendarWrapper>
                    </S.CalendarWidgetWrapper>
                )}
            </S.MainContent>
        </S.SidebarContainer>
    );
};
