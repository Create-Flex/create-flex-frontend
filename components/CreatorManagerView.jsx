import React from 'react';
import { UserRole } from '../enums';
import { AdminCreatorView } from './AdminCreatorView';
import { EmployeeCreatorView } from './EmployeeCreatorView';
import { CreatorSchedule } from './creator/schedule/CreatorSchedule';
import { CreatorHealth } from './creator/health/CreatorHealth';
import * as S from './CreatorManagerView.styled';

import { useAuthStore } from '../stores/useAuthStore';
import { useCreatorStore } from '../stores/useCreatorStore';
import { useOrgStore } from '../stores/useOrgStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useUIStore } from '../stores/useUIStore';

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
    // Identify the creator based on logged-in user account or ID
    const myCreator = creators.find(c =>
        c.loginId === user.memberAccount ||
        c.id === String(user.memberId) ||
        c.id === String(user.id)
    );
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

export const CreatorManagerView = ({ view }) => {
    const { user } = useAuthStore();
    const {
        creators, setCreators,
        creatorHealthRecords, setCreatorHealthRecords,
        creatorIssueLogs, setCreatorIssueLogs,
        creatorEvents, setCreatorEvents,
        addSupportRequest, supportRequests
    } = useCreatorStore();

    const { employees } = useOrgStore();
    const { allTasks, addTask, toggleTask, deleteTask } = useScheduleStore();
    const { currentView: storeView } = useUIStore();
    const currentView = view || storeView;

    if (!user) return null;

    const isCreator = user.role === UserRole.CREATOR || user.memberRole === 'CREATOR';
    const isAdmin = user.role === UserRole.ADMINISTRATOR || user.memberRole === 'ADMINISTRATOR';

    if (isCreator) {
        return <CreatorSelfView
            user={user}
            creators={creators}
            events={creatorEvents}
            onUpdateEvents={setCreatorEvents}
            healthRecords={creatorHealthRecords}
            onUpdateHealthRecords={setCreatorHealthRecords}
            issueLogs={creatorIssueLogs}
            onUpdateIssueLogs={setCreatorIssueLogs}
            currentView={currentView}
        />;
    }

    return isAdmin
        ? <AdminCreatorView
            user={user}
            creators={creators}
            onUpdateCreators={setCreators}
            healthRecords={creatorHealthRecords}
            onUpdateHealthRecords={setCreatorHealthRecords}
            issueLogs={creatorIssueLogs}
            onUpdateIssueLogs={setCreatorIssueLogs}
            employees={employees}
            currentView={currentView}
        />
        : <EmployeeCreatorView
            user={user}
            creators={creators}
            onUpdateCreators={setCreators}
            healthRecords={creatorHealthRecords}
            onUpdateHealthRecords={setCreatorHealthRecords}
            issueLogs={creatorIssueLogs}
            onUpdateIssueLogs={setCreatorIssueLogs}
            events={creatorEvents}
            onUpdateEvents={setCreatorEvents}
            onAddSupportRequest={addSupportRequest}
            allTasks={allTasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            currentView={currentView}
            supportRequests={supportRequests}
        />;
};
