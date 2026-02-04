import React, { useState, useMemo, useEffect } from 'react';
import { Upload, BellRing, Calendar, ArrowRight, RotateCcw, Download, FileText } from 'lucide-react';
import {
    HealthSectionContainer, HealthAlertBox, AlertContentWrapper, AlertTextContent, AlertBadge, AlertTitle, AlertText,
    AlertActionWrapper, ActionButton, AlertIconWrapper, DecorationCircle,
    HistorySectionHeader, SectionTitleWithIcon, FilterBar, FilterLabel, DateInput, ResetButton, SearchButton,
    HistoryList, HistoryItem, HistoryItemContent, HistoryTitleRow, HistoryYearType, HistoryStatus,
    HistoryDateRow, DownloadButton, EmptyState, EmptyIcon, EmptyText
} from './HealthSection.styled';
import { getMyHealth } from '../../api/healthService';

export const HealthSection = ({
    profile,
    checkupHistory,
    onOpenResultModal
}) => {

    const [healthList, setHealthList] = useState([]);
    const [healthCheck, setHealthCheck] = useState();

    useEffect(() => {

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
                const { data } = await getMyHealth(startDate, endDate); // API 호출
                console.log('Health API 응답:', data); // ✅ 여기서 확인
                setHealthList(data.healthInfoList); // 상태에 저장
                setHealthCheck(data.haveHealthChecked);
            } catch (err) {
                console.error('Health 조회 실패', err);
            }
        };
        

        fetchHealth();
    }, []); // 빈 배열 → 컴포넌트 마운트 시 1회

    
    
    // Helper for ISO Date calculation
    const getInitialDates = () => {
        const today = new Date();
        const TwoYearsAgo = new Date();
        TwoYearsAgo.setFullYear(today.getFullYear() - 2);
        return {
            today: today.toISOString().split('T')[0],
            TwoYearsAgo: TwoYearsAgo.toISOString().split('T')[0]
        };
    };

    const initialDates = getInitialDates();
    
    
    // History Filter State
    const [historyStartDate, setHistoryStartDate] = useState(initialDates.TwoYearsAgo);
    const [historyEndDate, setHistoryEndDate] = useState(initialDates.today);

    const healthSearch = async () => {
        try {
            const { data } = await getMyHealth(historyStartDate, historyEndDate);
            console.log('검색 결과:', data);
            setHealthList(data.healthInfoList);
        } catch (e) {
            console.error('검색 실패', e);
        }
    };

    const healthEntries = Array.from(healthList.entries());

    const summaryLabelMap = {
        NORMAL_AB: '정상AB',
        NORMAL_B: '정상B',
        CAUTION: '주의',
        DANGER: '위험',
        RETEST_NEED: '재검 필요'
    };

    return (
        <HealthSectionContainer>
            {healthCheck === false && (
            <HealthAlertBox>
                <AlertContentWrapper>
                    <AlertTextContent>
                        <AlertBadge>대상자 알림</AlertBadge>
                        <AlertTitle>
                            <span style={{ color: '#2563eb' }}>{profile.name}</span>님, <br />
                            2024년 정기 건강검진 대상자입니다.
                        </AlertTitle>
                        <AlertText>
                            올해 12월 31일까지 일반 건강검진을 완료해야 합니다.<br />
                            검진 후 결과를 업로드하여 DB에 저장해주세요.
                        </AlertText>
                        <AlertActionWrapper>
                            <ActionButton onClick={onOpenResultModal}>
                                <Upload size={16} /> 결과 제출하기
                            </ActionButton>
                        </AlertActionWrapper>
                    </AlertTextContent>
                    <AlertIconWrapper>
                        <BellRing className="text-blue-500" size={48} style={{ color: '#3b82f6' }} />
                    </AlertIconWrapper>
                </AlertContentWrapper>
                <DecorationCircle />
            </HealthAlertBox>
            )}
            <div>
                <HistorySectionHeader>
                    <SectionTitleWithIcon>
                        <Calendar size={16} /> 지난 검진 이력
                    </SectionTitleWithIcon>

                    <FilterBar>
                        <FilterLabel>기간</FilterLabel>
                        <DateInput
                            type="date"
                            value={historyStartDate}
                            onChange={(e) => setHistoryStartDate(e.target.value)}
                        />
                        <ArrowRight size={14} style={{ color: '#d1d5db', margin: '0 0.25rem' }} />
                        <DateInput
                            type="date"
                            value={historyEndDate}
                            onChange={(e) => setHistoryEndDate(e.target.value)}
                        />
                        <SearchButton onClick={healthSearch}>검색</SearchButton>
                    </FilterBar>
                </HistorySectionHeader>

                <HistoryList>
                    {healthEntries.length > 0 ? healthEntries.map(([key, value]) => (
                        <HistoryItem key={key}>
                            <HistoryItemContent>
                                <HistoryTitleRow>
                                <HistoryYearType>{value.checkupName} </HistoryYearType>
                                <HistoryStatus $status={value.checkupSummanary}>
                                    {summaryLabelMap[value.checkupSummanary] ?? value.checkupSummanary}
                                </HistoryStatus>
                                </HistoryTitleRow>
                                <HistoryDateRow>
                                <span>{value.checkupDate}</span>
                                </HistoryDateRow>
                            </HistoryItemContent>
                            <DownloadButton title="결과지 다운로드">
                                <Download size={18} />
                            </DownloadButton>
                        </HistoryItem>
                    )) : (
                        <EmptyState>
                            <EmptyIcon><FileText size={40} /></EmptyIcon>
                            <EmptyText>선택한 기간 내 검진 이력이 없습니다.</EmptyText>
                        </EmptyState>
                    )}
                </HistoryList>
            </div>
        </HealthSectionContainer>
    );
};
