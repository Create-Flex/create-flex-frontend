import React, { useState, useEffect } from 'react';
import { StaffManagement } from './hr/StaffManagement';
import { AttendanceManagement } from './hr/AttendanceManagement';
import { HealthManagement } from './hr/HealthManagement';
import { VacationManagement } from './hr/VacationManagement';
import { TeamManagement } from './hr/TeamManagement';
import { SupportManagement } from './hr/SupportManagement';
import {
    Users, BarChart4, Activity, Palmtree, Network, Scale
} from 'lucide-react';
import {
    DashboardContainer,
    InnerContainer,
    HeaderSection,
    Title,
    Description,
    ContentSection
} from './HRDashboardView.styled';

import { useOrgStore } from '../stores/useOrgStore';
import { useCreatorStore } from '../stores/useCreatorStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useUIStore } from '../stores/useUIStore';

export const HRDashboardView = ({ view }) => {
    const {
        employees, setEmployees,
        teams, setTeams,
        departments,
        attendanceLogs,
        employeeHealthRecords
    } = useOrgStore();

    const {
        creators,
        supportRequests,
        setSupportRequests
    } = useCreatorStore();

    const { vacationLogs, setVacationLogs } = useScheduleStore();
    const { currentView: storeView } = useUIStore();

    // Use prop if available, otherwise fallback to store
    const currentView = view || storeView;

    // Map global view to internal tab
    const initialTab =
        currentView === 'hr-staff' ? 'staff' :
            currentView === 'hr-attendance' ? 'attendance' :
                currentView === 'hr-health' ? 'health' :
                    currentView === 'hr-vacation' ? 'vacation' :
                        currentView === 'hr-support' ? 'support' : 'teams';

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'staff':
                return <StaffManagement employees={employees} onUpdateEmployees={setEmployees} vacationLogs={vacationLogs} departments={departments} />;
            case 'attendance':
                return <AttendanceManagement employees={employees} attendanceLogs={attendanceLogs} />;
            case 'health':
                return <HealthManagement healthRecords={employeeHealthRecords} />;
            case 'vacation':
                return <VacationManagement vacationLogs={vacationLogs} onUpdateVacationLogs={setVacationLogs || (() => { })} />;
            case 'teams':
                return <TeamManagement teams={teams} onUpdateTeams={setTeams} employees={employees} creators={creators} />;
            case 'support':
                return <SupportManagement requests={supportRequests} onUpdateRequest={setSupportRequests || (() => { })} />;
            default:
                return <StaffManagement employees={employees} onUpdateEmployees={setEmployees} vacationLogs={vacationLogs} departments={departments} />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'staff': return '직원 관리';
            case 'attendance': return '근태 관리';
            case 'health': return '건강 관리';
            case 'vacation': return '휴가 관리';
            case 'teams': return '크리에이터 팀 관리'; // Sidebar says "크리에이터 팀 관리" (Line 425), logic check needed
            case 'support': return '법률/세무 지원 관리';
            default: return '인사 관리';
        }
    };

    const getIcon = () => {
        switch (activeTab) {
            case 'staff': return <Users size={32} />;
            case 'attendance': return <BarChart4 size={32} />;
            case 'health': return <Activity size={32} />;
            case 'vacation': return <Palmtree size={32} />;
            case 'teams': return <Network size={32} />;
            case 'support': return <Scale size={32} />;
            default: return <Users size={32} />;
        }
    };

    const getDescription = () => {
        switch (activeTab) {
            case 'staff': return '전체 임직원의 인적 정보 및 인사 현황을 관리합니다.';
            case 'attendance': return '직원들의 실시간 근태 및 업무 상태를 모니터링합니다.';
            case 'health': return '직원들의 건강검진 수검 현황 및 이력을 관리합니다.';
            case 'vacation': return '휴가 신청 내역 검토 및 승인 프로세스를 진행합니다.';
            case 'teams': return '크리에이터 팀 조직 및 멤버 배정을 관리합니다.';
            case 'support': return '크리에이터 및 직원의 법률/세무 상담 요청을 처리합니다.';
            default: return '';
        }
    };

    return (
        <DashboardContainer>
            <InnerContainer>
                <HeaderSection>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getIcon()}
                        <div>
                            <Title>{getTitle()}</Title>
                            <Description>{getDescription()}</Description>
                        </div>
                    </div>
                </HeaderSection>

                <ContentSection>
                    {renderContent()}
                </ContentSection>
            </InnerContainer>
        </DashboardContainer>
    );
};
