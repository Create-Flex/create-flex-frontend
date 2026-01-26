import React, { useState, useEffect } from 'react';
import { StaffManagement } from './hr/StaffManagement';
import { AttendanceManagement } from './hr/AttendanceManagement';
import { HealthManagement } from './hr/HealthManagement';
import { VacationManagement } from './hr/VacationManagement';
import { TeamManagement } from './hr/TeamManagement';
import { SupportManagement } from './hr/SupportManagement';
import {
    DashboardContainer,
    InnerContainer,
    HeaderSection,
    Title,
    Description,
    ContentSection
} from './HRDashboardView.styled';

export const HRDashboardView = ({
    vacationLogs = [],
    onUpdateVacationLogs,
    teams,
    onUpdateTeams,
    employees,
    onUpdateEmployees,
    creators = [],
    employeeHealthRecords = [],
    supportRequests = [],
    onUpdateSupportRequests,
    departments = [],
    initialTab = 'staff',
    attendanceLogs = []
}) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'staff':
                return <StaffManagement employees={employees} onUpdateEmployees={onUpdateEmployees} vacationLogs={vacationLogs} departments={departments} />;
            case 'attendance':
                return <AttendanceManagement employees={employees} attendanceLogs={attendanceLogs} />;
            case 'health':
                return <HealthManagement healthRecords={employeeHealthRecords} />;
            case 'vacation':
                return <VacationManagement vacationLogs={vacationLogs} onUpdateVacationLogs={onUpdateVacationLogs || (() => { })} />;
            case 'teams':
                return <TeamManagement teams={teams} onUpdateTeams={onUpdateTeams} employees={employees} creators={creators} />;
            case 'support':
                return <SupportManagement requests={supportRequests} onUpdateRequest={onUpdateSupportRequests || (() => { })} />;
            default:
                return <StaffManagement employees={employees} onUpdateEmployees={onUpdateEmployees} vacationLogs={vacationLogs} departments={departments} />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'staff': return '직원 관리';
            case 'attendance': return '근태 관리';
            case 'health': return '건강 관리';
            case 'vacation': return '휴가 관리';
            case 'teams': return '팀 관리';
            case 'support': return '법률/세무 지원 관리';
            default: return '인사 관리';
        }
    };

    const getDescription = () => {
        switch (activeTab) {
            case 'staff': return '전체 임직원의 인적 정보 및 인사 현황을 관리합니다.';
            case 'attendance': return '직원들의 실시간 근태 및 업무 상태를 모니터링합니다.';
            case 'health': return '직원들의 건강검진 수검 현황 및 이력을 관리합니다.';
            case 'vacation': return '휴가 신청 내역 검토 및 승인 프로세스를 진행합니다.';
            case 'teams': return '조직 내 팀 구성 및 멤버 배정을 관리합니다.';
            case 'support': return '크리에이터 및 직원의 법률/세무 상담 요청을 처리합니다.';
            default: return '';
        }
    };

    return (
        <DashboardContainer>
            <InnerContainer>
                <HeaderSection>
                    <Title>{getTitle()}</Title>
                    <Description>{getDescription()}</Description>
                </HeaderSection>

                <ContentSection>
                    {renderContent()}
                </ContentSection>
            </InnerContainer>
        </DashboardContainer>
    );
};
