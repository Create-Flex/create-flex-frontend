import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {Container,ContentContainer,SectionLayout, MainContent, InnerContainer, HeaderSection, Description, Title} from '../style/HealthPrivate.styled';

import { useAuthStore } from '../../auth/model/useAuthStore';
import { getMyHealth, postMyHealth, putMyHealth } from '../../health/api/healthService';
import { HealthSection } from './HealthSection';
import { HealthResultModal } from '../modal/HealthResultModal';
import {Activity} from 'lucide-react';

export const HealthPrivate = ({
    readOnly = false,
}) => {
    const [memberName, setMemberName] = useState('');
    const [healthList, setHealthList] = useState([]);
    const [healthCheck, setHealthCheck] = useState();
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    const fetchHealth = async () => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 2);
    
        const toLocalDateString = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };
    
        const startDate = toLocalDateString(oneYearAgo);
        const endDate = toLocalDateString(today);
    
        try {
            const { data } = await getMyHealth(startDate, endDate);
            setHealthList(data.healthInfoList);
            setHealthCheck(data.haveHealthChecked);
            setMemberName(data.memberName);
        } catch (err) {
            console.error('Health 조회 실패', err);
        }
    };

    const healthIcon = 

    useEffect(() => {
        fetchHealth();
    }, []);

    const canUpdate = !readOnly;

    return(
        <Container>
            <InnerContainer>
                <HeaderSection>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Activity size={32} />
                        <div className="mb-6">
                            <Title>건강 관리</Title>
                            <Description>지금까지 제출된 건강상태를 기록하고 관리합니다.</Description>
                        </div>
                    </div>
                </HeaderSection>
            </InnerContainer>
            <ContentContainer>
                <SectionLayout>
                    <MainContent>
                        <HealthSection
                            profile={memberName}
                            healthList={healthList}
                            onUpdateHealthList={(newList) => { setHealthList(newList); }}
                            healthCheck={healthCheck}
                            onUpdateHealthCheck={(newBoolean) => { setHealthCheck(newBoolean); }}
                            onOpenResultModal={() => setIsResultModalOpen(true)}
                        />
                    </MainContent>
                </SectionLayout>
            </ContentContainer>
            {canUpdate && (
                <>
                    <HealthResultModal
                        isOpen={isResultModalOpen}
                        onClose={() => setIsResultModalOpen(false)}
                        onUpload={async (data) => {
                            try {
                                const response = await postMyHealth(data);
                                const presignedUrl = response.data.presignedUrl;
                                const file = data.get("file");

                                await putMyHealth(file, presignedUrl);
                                fetchHealth();

                                toast.success('검진 결과가 성공적으로 업로드되었으며, 인사팀 리스트에 반영되었습니다.');
                                setIsResultModalOpen(false);
                            } catch (error) {
                                console.error("업데이트 실패 : ", error);
                                toast.error('업로드 실패');
                            }
                        }}
                    />
                </>
            )}
        </Container>
    );
};