import React, { useState, useEffect } from 'react';
import { UserRole } from '../../../shared/constants/enums';
import { AdminCreatorView } from './AdminCreatorView';
import { EmployeeCreatorView } from './EmployeeCreatorView';
import { CreatorSchedule } from './components/schedule/CreatorSchedule';
import { CreatorHealth } from './components/health/CreatorHealth';
import * as S from './CreatorManagerView.styled';

import { useAuthStore } from '../../auth/model/useAuthStore';
import { useCreatorStore } from '../model/useCreatorStore';
import { useEmployeeStore } from '../../employee/model/useEmployeeStore';
import { useHealthStore } from '../../health/model/useHealthStore';
import { useScheduleStore } from '../../calendar/model/useScheduleStore';
import { useUserStore } from '../../employee/model/useUserStore';
import { useUIStore } from '../../../shared/model/useUIStore';

import { getCreatorHealth, saveCreatorMental } from '../../health/api/healthService';

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

    const [creatorHealthList, setCreatorHealth] = useState([]);
    const [creatorCountNormal, setCreatorCountNormal] = useState();
    const [creatorCountCaution, setCreatorCountCaution] = useState();
    const [creatorCountDanger, setCreatorCountDanger] = useState();
    const [creatorMentalWarning, setCreatorMentalCount] = useState();
    const [creatorMentalList, setCreatorMental] = useState([]);

    const fetchCreatorHealth = async () => {
        try {
            const { data } = await getCreatorHealth();
            console.log('조회결과 : ', data);
            setCreatorHealth(data.healthInfoList);
            setCreatorMental(data.mentalHealthInfoList);

            const creatorSummanary = data.healthSummanaryCountList
            const normalAB = creatorSummanary.find(item => item.checkupSummanary === 'NORMAL_AB')?.totalCount ?? 0;
            const normalB = creatorSummanary.find(item => item.checkupSummanary === 'NORMAL_B')?.totalCount ?? 0;
            const caution = creatorSummanary.find(item => item.checkupSummanary === 'CAUTION')?.totalCount ?? 0
            const danger = creatorSummanary.find(item => item.checkupSummanary === 'DANGER')?.totalCount ?? 0
            const mentalWorn = data.mentalWarningHealthInfoList.length;
            setCreatorCountNormal(normalAB + normalB);
            setCreatorCountCaution(caution);
            setCreatorCountDanger(danger);
            setCreatorMentalCount(mentalWorn);
        } catch (err) {
            console.error('Health 조회 실패', err);
        }
    }

    useEffect(() => {
        fetchCreatorHealth()
    }, [])

    // Identify the creator based on logged-in user account or ID
    const myCreator = creators.find(c =>
        c.loginId === user.memberAccount ||
        c.id === String(user.memberId) ||
        c.id === String(user.id)
    ) || (user.role === UserRole.CREATOR || user.memberRole === 'CREATOR' ? {
        id: String(user.memberId || user.id),
        name: user.memberName || user.name,
        avatarUrl: user.profileImage || ''
    } : null);
    const isHealthView = currentView === 'creator-health';
    {/*
    if (!myCreator) {
        return (
            <S.MessageContainer>
                연결된 크리에이터 정보를 찾을 수 없습니다.
            </S.MessageContainer>
        );
    }
    */}

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
        creators, setCreators, fetchCreators,
        creatorEvents, setCreatorEvents, fetchCreatorEvents,
        addSupportRequest, supportRequests
    } = useCreatorStore();

    const { employees } = useEmployeeStore();
    const {
        creatorHealthRecords, setCreatorHealthRecords,
        creatorIssueLogs, setCreatorIssueLogs
    } = useHealthStore();

    const { allTasks, addTask, toggleTask, deleteTask } = useScheduleStore();
    const { currentDate, currentView: storeView } = useUIStore();
    const currentView = view || storeView;

    // Fetch creators and events
    useEffect(() => {
        if (creators.length === 0) {
            fetchCreators();
        }
    }, [fetchCreators, creators.length]);

    useEffect(() => {
        if (user && (user.role === UserRole.CREATOR || user.memberRole === 'CREATOR')) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            fetchCreatorEvents(year, month);
        }
    }, [currentDate, user, fetchCreatorEvents]);

    if (!user) return null;

    const isCreator = user.role === UserRole.CREATOR || user.memberRole === 'CREATOR';
    const isAdmin = user.role === UserRole.ADMINISTRATOR || user.memberRole === 'ADMINISTRATOR';

    if (isCreator) {
        return <CreatorSelfView
            user={user}
            creators={creators}
            events={creatorEvents}
            onUpdateEvents={() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                fetchCreatorEvents(year, month);
            }}
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
