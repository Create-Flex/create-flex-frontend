import React from 'react';
import { CreatorHealthView } from '../components/shared/Health';
import { INITIAL_HEALTH_RECORDS, INITIAL_ISSUE_LOGS } from '../../../../constants';

export const HealthTab = ({
    myCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
}) => {
    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
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
