import React from 'react';
import { CreatorHealthView } from '../../creator/shared/Health';

export const HealthTab = ({
    myCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
}) => {
    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">크리에이터 건강 관리</h2>
                <p className="text-sm text-gray-500">담당 크리에이터의 건강 상태 및 이슈를 기록하고 관리합니다.</p>
            </div>
            <CreatorHealthView
                creators={myCreators}
                records={healthRecords}
                onUpdateRecords={onUpdateHealthRecords}
                logs={issueLogs}
                onUpdateLogs={onUpdateIssueLogs}
                readOnly={true}
            />
        </div>
    );
};
