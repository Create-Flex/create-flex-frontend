import React, { useState, useMemo } from 'react';
import { Upload, BellRing, Calendar, ArrowRight, RotateCcw, Download, FileText } from 'lucide-react';
import {
    HealthSectionContainer, HealthAlertBox, AlertContentWrapper, AlertTextContent, AlertBadge, AlertTitle, AlertText,
    AlertActionWrapper, ActionButton, AlertIconWrapper, DecorationCircle,
    HistorySectionHeader, SectionTitleWithIcon, FilterBar, FilterLabel, DateInput, ResetButton,
    HistoryList, HistoryItem, HistoryItemContent, HistoryTitleRow, HistoryYearType, HistoryStatus,
    HistoryDateRow, DownloadButton, EmptyState, EmptyIcon, EmptyText
} from './HealthSection.styled';

export const HealthSection = ({
    profile,
    checkupHistory,
    onOpenResultModal
}) => {
    // Helper for ISO Date calculation
    const getInitialDates = () => {
        const today = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        return {
            today: today.toISOString().split('T')[0],
            fiveYearsAgo: fiveYearsAgo.toISOString().split('T')[0]
        };
    };

    const initialDates = getInitialDates();

    // History Filter State
    const [historyStartDate, setHistoryStartDate] = useState(initialDates.fiveYearsAgo);
    const [historyEndDate, setHistoryEndDate] = useState(initialDates.today);

    // Filtered History Logic
    const filteredHistory = useMemo(() => {
        return checkupHistory.filter(item => {
            if (!historyStartDate && !historyEndDate) return true;

            // Convert "2023. 10. 15" to "2023-10-15" for comparison
            const formattedDate = item.date.replace(/\. /g, '-').replace(/\.$/, '');

            if (historyStartDate && formattedDate < historyStartDate) return false;
            if (historyEndDate && formattedDate > historyEndDate) return false;

            return true;
        });
    }, [checkupHistory, historyStartDate, historyEndDate]);

    return (
        <HealthSectionContainer>
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
                        {(historyStartDate !== initialDates.fiveYearsAgo || historyEndDate !== initialDates.today) && (
                            <ResetButton
                                onClick={() => {
                                    setHistoryStartDate(initialDates.fiveYearsAgo);
                                    setHistoryEndDate(initialDates.today);
                                }}
                                title="필터 초기화"
                            >
                                <RotateCcw size={14} />
                            </ResetButton>
                        )}
                    </FilterBar>
                </HistorySectionHeader>

                <HistoryList>
                    {filteredHistory.length > 0 ? filteredHistory.map((checkup) => (
                        <HistoryItem key={checkup.id}>
                            <HistoryItemContent>
                                <HistoryTitleRow>
                                    <HistoryYearType>{checkup.year}년 {checkup.type}</HistoryYearType>
                                    <HistoryStatus $status={checkup.result}>
                                        {checkup.result}
                                    </HistoryStatus>
                                </HistoryTitleRow>
                                <HistoryDateRow>
                                    <span>{checkup.date}</span>
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
