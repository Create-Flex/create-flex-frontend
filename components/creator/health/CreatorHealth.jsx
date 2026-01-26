import React, { useState } from 'react';
import { Activity, ClipboardList } from 'lucide-react';
import { CreatorHealthView, PhqSurveyModal } from '../shared/Health';
import * as S from './CreatorHealth.styled';

export const CreatorHealth = ({
    creator,
    creators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs
}) => {
    const [isPhqModalOpen, setIsPhqModalOpen] = useState(false);

    const handlePhqSubmit = () => {
        const newLog = {
            id: Date.now(),
            creator: creator.name,
            date: new Date().toISOString().split('T')[0],
            category: 'PHQ-9 자가진단',
            description: '자가 건강 설문을 완료하였습니다. (점수: 8점 / 정상 범위)',
            status: '확인완료'
        };
        onUpdateIssueLogs([newLog, ...issueLogs]);
        alert('설문이 완료되었습니다. 결과가 담당 매니저에게 공유되었습니다.');
        setIsPhqModalOpen(false);
    };

    return (
        <S.Container>
            <S.Header>
                <S.HeaderContent>
                    <S.HeaderTop>
                        <S.TitleContainer>
                            <S.Title>
                                <Activity color="#00C471" size={32} />
                                건강 관리
                            </S.Title>
                            <S.SubTitle>
                                나의 건강 상태와 검진 기록을 확인하세요.
                            </S.SubTitle>
                        </S.TitleContainer>
                        <S.HeaderActions>
                            <S.SurveyButton onClick={() => setIsPhqModalOpen(true)}>
                                <ClipboardList size={20} />
                                자가진단 설문 시작
                            </S.SurveyButton>
                        </S.HeaderActions>
                    </S.HeaderTop>
                </S.HeaderContent>
            </S.Header>

            <S.ContentArea>
                <S.ContentWrapper>
                    <S.HealthViewWrapper>
                        <CreatorHealthView
                            creators={[creator]}
                            records={healthRecords}
                            onUpdateRecords={onUpdateHealthRecords}
                            logs={issueLogs}
                            onUpdateLogs={onUpdateIssueLogs}
                            readOnly={false}
                            isCreator={true}
                        />
                    </S.HealthViewWrapper>
                </S.ContentWrapper>
            </S.ContentArea>

            {isPhqModalOpen && (
                <PhqSurveyModal
                    onClose={() => setIsPhqModalOpen(false)}
                    onSubmit={handlePhqSubmit}
                />
            )}
        </S.Container>
    );
};
