import React from 'react';
import { UserRole } from '../enums';
import { AdminCreatorView } from './AdminCreatorView';
import { EmployeeCreatorView } from './EmployeeCreatorView';
import { PhqSurveyModal } from './creator/shared/Health';
import { getCreatorColorStyles } from './creator/shared/utils';
import { CalendarIcon, Activity, CheckSquare, ClipboardList, X, Trash2, Plus, Search, Check, Users } from 'lucide-react';
import { CreatorSchedule } from './creator/schedule/CreatorSchedule';
import { CreatorHealth } from './creator/health/CreatorHealth';
import * as S from './CreatorManagerView.styled';

// --- Creator Self View (Refactored) ---
const CreatorSelfView = ({
    user,
    creators,
    events,
    onUpdateEvents,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    currentView
}) => {
    // Identify the creator based on logged-in user ID
    const myCreator = creators.find(c => c.id === user.id);
    const isHealthView = currentView === 'creator-health';

    if (!myCreator) {
        return (
            <S.MessageContainer>
                연결된 크리에이터 정보를 찾을 수 없습니다.
            </S.MessageContainer>
        );
    }

    if (isHealthView) {
        return (
            <CreatorHealth
                creator={myCreator}
                creators={creators}
                healthRecords={healthRecords}
                onUpdateHealthRecords={onUpdateHealthRecords}
                issueLogs={issueLogs}
                onUpdateIssueLogs={onUpdateIssueLogs}
            />
        );
    }

    return (
        <CreatorSchedule
            creator={myCreator}
            creators={creators}
            events={events}
            onUpdateEvents={onUpdateEvents}
        />
    );
};

export const CreatorManagerView = ({
    user,
    creators,
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    employees,
    events,
    onUpdateEvents,
    onAddSupportRequest,
    currentView,
    allTasks,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    supportRequests
}) => {
    if (user.role === UserRole.CREATOR) {
        return <CreatorSelfView
            user={user}
            creators={creators}
            events={events}
            onUpdateEvents={onUpdateEvents}
            healthRecords={healthRecords}
            onUpdateHealthRecords={onUpdateHealthRecords}
            issueLogs={issueLogs}
            onUpdateIssueLogs={onUpdateIssueLogs}
            currentView={currentView}
        />;
    }

    return user.role === UserRole.ADMIN
        ? <AdminCreatorView
            user={user}
            creators={creators}
            onUpdateCreators={onUpdateCreators}
            healthRecords={healthRecords}
            onUpdateHealthRecords={onUpdateHealthRecords}
            issueLogs={issueLogs}
            onUpdateIssueLogs={onUpdateIssueLogs}
            employees={employees}
            currentView={currentView}
        />
        : <EmployeeCreatorView
            user={user}
            creators={creators}
            onUpdateCreators={onUpdateCreators}
            healthRecords={healthRecords}
            onUpdateHealthRecords={onUpdateHealthRecords}
            issueLogs={issueLogs}
            onUpdateIssueLogs={onUpdateIssueLogs}
            events={events}
            onUpdateEvents={onUpdateEvents}
            onAddSupportRequest={onAddSupportRequest}
            allTasks={allTasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            currentView={currentView}
            supportRequests={supportRequests}
        />;
};
