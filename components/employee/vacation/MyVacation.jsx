import React, { useState, useMemo } from 'react';
import { VacationModal } from '../../modals/VacationModal';
import {
    Plane, ArrowRight, Filter, Plus, Timer, CheckCircle2, XCircle,
    AlertCircle, MapPin, Gift, Info, X, Stethoscope
} from 'lucide-react';
import {
    Container, TableContainer, ControlBar, FilterGroup, DateRangePicker, FilterLabel, DateInput,
    SelectWrapper, TypeSelect, RequestButton, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    TypeBadge, StatusBadge, ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, InfoLabel, InfoValue, DetailSection, DetailGrid, DetailInfoBox, DetailHeader, DetailRow,
    PrimaryButton,
    DetailDateRow, DetailDateItem, DateLabel, ReasonBox, RejectionBox, RejectionText,
    SelectIcon, TruncatedContent, CenterContent, MonoText
} from './MyVacation.styled';

const getISODate = (date) => date.toISOString().split('T')[0];

export const MyVacation = ({ vacationLogs, onUpdateVacationLogs, userName }) => {
    const today = new Date();
    // 오늘 기준 한 달 전/후 설정
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    const [startDate, setStartDate] = useState(getISODate(oneMonthAgo));
    const [endDate, setEndDate] = useState(getISODate(oneMonthLater));
    const [vacationTypeFilter, setVacationTypeFilter] = useState('All');

    // 모달 상태
    const [selectedDetailLog, setSelectedDetailLog] = useState(null);
    const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);

    // 휴가 신청 폼 상태
    const [vacationForm, setVacationForm] = useState({
        type: '연차', startDate: '', endDate: '', reason: '',
        location: '', emergencyContact: '', workGoals: '', handover: '',
        relationship: '', eventType: '', symptoms: '', hospital: ''
    });

    // --- Mock Data & Filtering ---
    const mockVacations = [
        { id: 201, name: '이채연', type: '연차', startDate: '2026-01-20', endDate: '2026-01-21', days: 2, status: '승인됨', reason: '가족 여행' },
        { id: 202, name: '이채연', type: '워케이션', startDate: '2026-01-15', endDate: '2026-01-17', days: 3, status: '승인됨', reason: '제주도 워케이션', location: '제주 오피스', emergencyContact: '010-1111-2222', workGoals: '모바일 앱 v2.0 기획 마무리', handover: '김민재 매니저' },
        { id: 203, name: '이채연', type: '경조사', startDate: '2026-01-28', endDate: '2026-01-28', days: 1, status: '대기중', reason: '동생 졸업식 참여', relationship: '형제/자매', eventType: '졸업' },
        { id: 204, name: '이채연', type: '경조사', startDate: '2026-01-12', endDate: '2026-01-12', days: 1, status: '반려됨', reason: '사촌 결혼식', rejectionReason: '경조사 휴가 규정상 본인/부모/조부모/형제자매까지만 유급 지원이 가능합니다. 개인 연차를 사용해주세요.' },
        { id: 205, name: '이채연', type: '병가', startDate: '2026-01-05', endDate: '2026-01-06', days: 2, status: '승인됨', reason: '독감 치료', symptoms: '고열 및 인후통', hospital: '강남내과' },
    ];

    const displayVacationLogs = useMemo(() => {
        const combined = [...mockVacations, ...vacationLogs.filter(v => v.name === userName)];
        return Array.from(new Map(combined.map(item => [item.id, item])).values());
    }, [vacationLogs, userName]);

    const filteredVacations = displayVacationLogs.filter(log => {
        const isWithinDateRange = log.startDate >= startDate && log.startDate <= endDate;
        const matchesType = vacationTypeFilter === 'All' || log.type === vacationTypeFilter;
        return isWithinDateRange && matchesType;
    });

    const handleVacationSubmit = () => {
        if (!vacationForm.startDate || !vacationForm.endDate) return alert('날짜를 선택해주세요.');

        const start = new Date(vacationForm.startDate);
        const end = new Date(vacationForm.endDate);

        if (end < start) return alert('종료일이 시작일보다 빠를 수 없습니다.');

        let calculatedDays = 1;
        if (vacationForm.type === '반차') {
            calculatedDays = 0.5;
        } else {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        const newLog = {
            id: Date.now(),
            name: userName,
            type: vacationForm.type,
            startDate: vacationForm.startDate,
            endDate: vacationForm.endDate,
            days: calculatedDays,
            requestDate: new Date().toISOString().split('T')[0],
            status: '대기중',
            reason: vacationForm.reason || `${vacationForm.type} 신청`,
            location: vacationForm.location,
            emergencyContact: vacationForm.emergencyContact,
            workGoals: vacationForm.workGoals,
            handover: vacationForm.handover,
            relationship: vacationForm.relationship,
            eventType: vacationForm.eventType,
            symptoms: vacationForm.symptoms,
            hospital: vacationForm.hospital
        };

        if (onUpdateVacationLogs) onUpdateVacationLogs([newLog, ...vacationLogs]);
        alert(`${vacationForm.type} 신청이 완료되었습니다. (사용 일수: ${calculatedDays}일)`);
        setIsVacationModalOpen(false);
        setVacationForm({
            type: '연차', startDate: '', endDate: '', reason: '', location: '', emergencyContact: '', workGoals: '', handover: '', relationship: '', eventType: '', symptoms: '', hospital: ''
        });
    };

    return (
        <Container>
            {/* Vacation Logs Table & Filters */}
            <TableContainer>
                <ControlBar>
                    <FilterGroup>
                        <DateRangePicker>
                            <FilterLabel>기간</FilterLabel>
                            <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <ArrowRight size={14} color="#d1d5db" style={{ margin: '0 0.25rem' }} />
                            <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </DateRangePicker>

                        <SelectWrapper>
                            <TypeSelect
                                value={vacationTypeFilter}
                                onChange={(e) => setVacationTypeFilter(e.target.value)}
                            >
                                <option value="All">모든 유형</option>
                                <option value="연차">연차</option>
                                <option value="반차">반차</option>
                                <option value="경조사">경조사</option>
                                <option value="병가">병가</option>
                                <option value="워케이션">워케이션</option>
                            </TypeSelect>
                            <SelectIcon>
                                <Filter size={14} />
                            </SelectIcon>
                        </SelectWrapper>
                    </FilterGroup>

                    <RequestButton onClick={() => setIsVacationModalOpen(true)}>
                        <Plus size={14} /> 휴가 신청
                    </RequestButton>
                </ControlBar>

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell>휴가 기간</TableHeaderCell>
                            <TableHeaderCell>유형</TableHeaderCell>
                            <TableHeaderCell>사용 일수</TableHeaderCell>
                            <TableHeaderCell>신청 사유</TableHeaderCell>
                            <TableHeaderCell $align="center">승인 상태</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredVacations.map((log) => (
                            <TableRow key={log.id} onClick={() => setSelectedDetailLog(log)}>
                                <TableCell $bold $color="#111827">{log.startDate} ~ {log.endDate}</TableCell>
                                <TableCell>
                                    <TypeBadge $type={log.type}>{log.type}</TypeBadge>
                                </TableCell>
                                <TableCell $bold $color="#1f2937">{log.days}일</TableCell>
                                <TableCell $color="#6b7280">
                                    <TruncatedContent>{log.reason}</TruncatedContent>
                                </TableCell>
                                <TableCell>
                                    <CenterContent>
                                        <StatusBadge $status={log.status}>
                                            {log.status === '대기중' && <Timer size={12} />}
                                            {log.status === '승인됨' && <CheckCircle2 size={12} />}
                                            {log.status === '반려됨' && <XCircle size={12} />}
                                            {log.status === '대기중' ? '승인대기중' : log.status}
                                        </StatusBadge>
                                    </CenterContent>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 휴가 상세 내역 모달 */}
            {selectedDetailLog && (
                <ModalOverlay $zIndex={105} onClick={() => setSelectedDetailLog(null)}>
                    <ModalContent $maxWidth="28rem" onClick={e => e.stopPropagation()}>
                        <ModalHeader $bg="#f9fafb">
                            <ModalTitle>
                                <Plane size={20} color="#2563eb" /> 휴가 신청 상세
                            </ModalTitle>
                            <CloseButton onClick={() => setSelectedDetailLog(null)}><X size={20} /></CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <DetailGrid>
                                <div>
                                    <InfoLabel>휴가 종류</InfoLabel>
                                    <InfoValue>
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>{selectedDetailLog.type}
                                    </InfoValue>
                                </div>
                                <div>
                                    <InfoLabel>신청 상태</InfoLabel>
                                    <StatusBadge $status={selectedDetailLog.status}>
                                        {selectedDetailLog.status === '대기중' ? '승인대기중' : selectedDetailLog.status}
                                    </StatusBadge>
                                </div>
                            </DetailGrid>

                            <div className="mt-6">
                                <InfoLabel>휴가 기간</InfoLabel>
                                <InfoValue>
                                    <DetailDateRow>
                                        <DetailDateItem>
                                            <DateLabel>시작일</DateLabel>
                                            <span>{selectedDetailLog.startDate}</span>
                                        </DetailDateItem>
                                        <ArrowRight size={16} color="#d1d5db" />
                                        <DetailDateItem $align="right">
                                            <DateLabel>종료일</DateLabel>
                                            <span>{selectedDetailLog.endDate}</span>
                                        </DetailDateItem>
                                    </DetailDateRow>
                                </InfoValue>
                            </div>

                            <div className="mt-6">
                                <InfoLabel>신청 사유</InfoLabel>
                                <ReasonBox>
                                    {selectedDetailLog.reason || '입력된 사유가 없습니다.'}
                                </ReasonBox>
                            </div>

                            <div className="mt-6">
                                {selectedDetailLog.type === '워케이션' && (
                                    <DetailInfoBox $type="워케이션">
                                        <DetailHeader $color="#1d4ed8"><Info size={14} /> 워케이션 상세 내역</DetailHeader>
                                        <DetailRow>
                                            <span>근무 장소</span><span>{selectedDetailLog.location || '-'}</span>
                                        </DetailRow>
                                        <DetailRow>
                                            <span>비상 연락망</span><MonoText>{selectedDetailLog.emergencyContact || '-'}</MonoText>
                                        </DetailRow>
                                        <DetailRow $col $border $pt>
                                            <span>업무 목표</span><span>{selectedDetailLog.workGoals || '-'}</span>
                                        </DetailRow>
                                        <DetailRow $col $border $pt>
                                            <span>업무 인계 사항</span><span>{selectedDetailLog.handover || '-'}</span>
                                        </DetailRow>
                                    </DetailInfoBox>
                                )}
                                {selectedDetailLog.type === '병가' && (
                                    <DetailInfoBox $type="병가">
                                        <DetailHeader $color="#15803d"><Stethoscope size={14} /> 병가 상세 내역</DetailHeader>
                                        <DetailRow>
                                            <span>증상/사유</span><span>{selectedDetailLog.symptoms || '-'}</span>
                                        </DetailRow>
                                        <DetailRow>
                                            <span>진료 병원</span><span>{selectedDetailLog.hospital || '-'}</span>
                                        </DetailRow>
                                    </DetailInfoBox>
                                )}
                                {selectedDetailLog.type === '경조사' && (
                                    <DetailInfoBox $type="경조사">
                                        <DetailHeader $color="#7e22ce"><Gift size={14} /> 경조사 상세 내역</DetailHeader>
                                        <DetailRow>
                                            <span>대상(관계)</span><span>{selectedDetailLog.relationship || '-'}</span>
                                        </DetailRow>
                                        <DetailRow>
                                            <span>경조 내용</span><span>{selectedDetailLog.eventType || '-'}</span>
                                        </DetailRow>
                                    </DetailInfoBox>
                                )}
                            </div>

                            {selectedDetailLog.status === '반려됨' && selectedDetailLog.rejectionReason && (
                                <RejectionBox>
                                    <DetailHeader $color="#b91c1c"><AlertCircle size={14} /> 관리자 반려 사유</DetailHeader>
                                    <RejectionText>
                                        {selectedDetailLog.rejectionReason}
                                    </RejectionText>
                                </RejectionBox>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <PrimaryButton onClick={() => setSelectedDetailLog(null)}>닫기</PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}

            {isVacationModalOpen && (
                <VacationModal
                    isOpen={isVacationModalOpen}
                    onClose={() => setIsVacationModalOpen(false)}
                    form={vacationForm}
                    setForm={setVacationForm}
                    onSubmit={handleVacationSubmit}
                />
            )}
        </Container>
    );
};
