import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift } from 'lucide-react';
import * as S from './VacationModal.styled';
import { vacationService } from '../../api/vacationService';
import { useAuthStore } from '../../../auth/model/useAuthStore';
import { useUserStore } from '../../../employee/model/useUserStore';
import { useVacationStore } from '../../model/useVacationStore';

export const VacationModal = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const { userProfile } = useUserStore();
    const { addVacationLog, vacationForm, setVacationForm, resetVacationForm, triggerRefresh } = useVacationStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!vacationForm.startDate || !vacationForm.endDate) {
            return toast.error('날짜를 선택해주세요.');
        }

        const start = new Date(vacationForm.startDate);
        const end = new Date(vacationForm.endDate);
        if (end < start) {
            return toast.error('종료일이 시작일보다 빠를 수 없습니다.');
        }

        let calculatedDays = 1;
        if (vacationForm.type === '반차') {
            calculatedDays = 0.5;
        } else {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        setIsSubmitting(true);

        try {
            const memberId = user?.memberId || user?.id;
            await vacationService.createVacation(vacationForm, memberId);

            // 로컬 상태 업데이트 (UI 반영)
            const newLog = {
                id: Date.now(),
                name: userProfile.name,
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

            addVacationLog(newLog);
            triggerRefresh(); // MyVacation 리스트 새로고침 트리거
            toast.success(`${vacationForm.type} 신청이 완료되었습니다. (사용 일수: ${calculatedDays}일)`);
            resetVacationForm();
            onClose();
        } catch (error) {
            console.error('휴가 신청 실패:', error);
            if (error.response?.status === 403) {
                toast.error('크리에이터는 휴가 신청을 할 수 없습니다.');
            } else {
                toast.error(error.response?.data?.message || '휴가 신청 중 오류가 발생했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <S.Overlay onClick={onClose}>
            <S.ModalContainer onClick={e => e.stopPropagation()}>
                <S.Header>
                    <S.Title>휴가 신청</S.Title>
                    <S.CloseButton onClick={onClose}><X size={20} /></S.CloseButton>
                </S.Header>
                <S.Body>
                    <S.Section>
                        <S.Label>휴가 종류</S.Label>
                        <S.TypeGrid>
                            {['연차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                <S.TypeButton
                                    key={type}
                                    onClick={() => {
                                        // 반차 선택 시 종료일을 시작일과 동일하게 설정
                                        if (type === '반차' && vacationForm.startDate) {
                                            setVacationForm({ ...vacationForm, type, endDate: vacationForm.startDate });
                                        } else {
                                            setVacationForm({ ...vacationForm, type });
                                        }
                                    }}
                                    $active={vacationForm.type === type}
                                >
                                    {type}
                                </S.TypeButton>
                            ))}
                        </S.TypeGrid>
                    </S.Section>

                    {vacationForm.type === '워케이션' && (
                        <S.FormSection $bgColor="rgba(239, 246, 255, 0.4)" $borderColor="#dbeafe">
                            <S.Grid2>
                                <div>
                                    <S.Label><MapPin size={12} /> 근무 장소</S.Label>
                                    <S.Input placeholder="예: 제주 오피스" value={vacationForm.location} onChange={e => setVacationForm({ ...vacationForm, location: e.target.value })} />
                                </div>
                                <div>
                                    <S.Label><Phone size={12} /> 비상 연락망</S.Label>
                                    <S.Input placeholder="예: 010-0000-0000" value={vacationForm.emergencyContact} onChange={e => setVacationForm({ ...vacationForm, emergencyContact: e.target.value })} />
                                </div>
                            </S.Grid2>
                            <div>
                                <S.Label><Target size={12} /> 업무 계획 및 목표</S.Label>
                                <S.TextArea rows={2} placeholder="기간 내 달성할 주요 목표를 입력하세요" value={vacationForm.workGoals} onChange={e => setVacationForm({ ...vacationForm, workGoals: e.target.value })} />
                            </div>
                            <div>
                                <S.Label><ClipboardList size={12} /> 업무 인계 사항</S.Label>
                                <S.TextArea rows={2} placeholder="부재 시 비상 대응 담당자 및 인계 내용을 입력하세요" value={vacationForm.handover} onChange={e => setVacationForm({ ...vacationForm, handover: e.target.value })} />
                            </div>
                        </S.FormSection>
                    )}

                    {vacationForm.type === '경조사' && (
                        <S.FormSection $bgColor="rgba(250, 245, 255, 0.4)" $borderColor="#f3e8ff">
                            <S.Label><Gift size={12} /> 경조사 필수 정보</S.Label>
                            <S.Grid2>
                                <div>
                                    <S.Label>대상(관계)</S.Label>
                                    <S.Input placeholder="예: 본인, 부모 등" value={vacationForm.relationship} onChange={e => setVacationForm({ ...vacationForm, relationship: e.target.value })} />
                                </div>
                                <div>
                                    <S.Label>경조 내용</S.Label>
                                    <S.Input placeholder="예: 결혼, 장례 등" value={vacationForm.eventType} onChange={e => setVacationForm({ ...vacationForm, eventType: e.target.value })} />
                                </div>
                            </S.Grid2>
                        </S.FormSection>
                    )}

                    {vacationForm.type === '병가' && (
                        <S.FormSection $bgColor="rgba(240, 253, 244, 0.4)" $borderColor="#dcfce7">
                            <S.Label><Stethoscope size={14} /> 병가 필수 정보</S.Label>
                            <S.Section style={{ marginBottom: '1rem' }}>
                                <S.Label>증상 및 사유</S.Label>
                                <S.Input placeholder="예: 독감으로 인한 고열 및 몸살" value={vacationForm.symptoms} onChange={e => setVacationForm({ ...vacationForm, symptoms: e.target.value })} />
                            </S.Section>
                            <S.Section>
                                <S.Label><ClipboardList size={14} /> 진료 예정 병원</S.Label>
                                <S.Input placeholder="예: 강남세브란스병원" value={vacationForm.hospital} onChange={e => setVacationForm({ ...vacationForm, hospital: e.target.value })} />
                            </S.Section>
                        </S.FormSection>
                    )}

                    <S.Grid2>
                        <div>
                            <S.Label>시작일</S.Label>
                            <S.Input
                                $focusColor="black"
                                type="date"
                                value={vacationForm.startDate}
                                onChange={e => {
                                    const newStartDate = e.target.value;
                                    // 반차인 경우 종료일도 시작일과 동일하게 설정
                                    if (vacationForm.type === '반차') {
                                        setVacationForm({ ...vacationForm, startDate: newStartDate, endDate: newStartDate });
                                    } else {
                                        setVacationForm({ ...vacationForm, startDate: newStartDate });
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <S.Label>종료일</S.Label>
                            <S.Input
                                $focusColor="black"
                                type="date"
                                value={vacationForm.endDate}
                                onChange={e => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                                disabled={vacationForm.type === '반차'}
                                style={vacationForm.type === '반차' ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                            />
                        </div>
                    </S.Grid2>

                    <S.Section>
                        <S.Label>상세 사유 (선택)</S.Label>
                        <S.TextArea $focusColor="black" rows={3} placeholder="추가적인 사유가 있다면 입력하세요" value={vacationForm.reason} onChange={e => setVacationForm({ ...vacationForm, reason: e.target.value })} />
                    </S.Section>
                </S.Body>

                <S.Footer>
                    <S.CancelButton onClick={onClose}>취소</S.CancelButton>
                    <S.SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? '신청 중...' : '신청 완료'}
                    </S.SubmitButton>
                </S.Footer>
            </S.ModalContainer>
        </S.Overlay>
    );
};
