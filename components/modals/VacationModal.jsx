import React from 'react';
import { X, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift } from 'lucide-react';
import * as S from './VacationModal.styled';

export const VacationModal = ({ isOpen, onClose, form, setForm, onSubmit }) => {
    if (!isOpen) return null;

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
                                    onClick={() => setForm({ ...form, type })}
                                    $active={form.type === type}
                                >
                                    {type}
                                </S.TypeButton>
                            ))}
                        </S.TypeGrid>
                    </S.Section>

                    {form.type === '워케이션' && (
                        <S.FormSection $bgColor="rgba(239, 246, 255, 0.4)" $borderColor="#dbeafe">
                            <S.Grid2>
                                <div>
                                    <S.Label><MapPin size={12} /> 근무 장소</S.Label>
                                    <S.Input placeholder="예: 제주 오피스" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                </div>
                                <div>
                                    <S.Label><Phone size={12} /> 비상 연락망</S.Label>
                                    <S.Input placeholder="예: 010-0000-0000" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                                </div>
                            </S.Grid2>
                            <div>
                                <S.Label><Target size={12} /> 업무 계획 및 목표</S.Label>
                                <S.TextArea rows={2} placeholder="기간 내 달성할 주요 목표를 입력하세요" value={form.workGoals} onChange={e => setForm({ ...form, workGoals: e.target.value })} />
                            </div>
                            <div>
                                <S.Label><ClipboardList size={12} /> 업무 인계 사항</S.Label>
                                <S.TextArea rows={2} placeholder="부재 시 비상 대응 담당자 및 인계 내용을 입력하세요" value={form.handover} onChange={e => setForm({ ...form, handover: e.target.value })} />
                            </div>
                        </S.FormSection>
                    )}

                    {form.type === '경조사' && (
                        <S.FormSection $bgColor="rgba(250, 245, 255, 0.4)" $borderColor="#f3e8ff">
                            <S.Label><Gift size={12} /> 경조사 필수 정보</S.Label>
                            <S.Grid2>
                                <div>
                                    <S.Label>대상(관계)</S.Label>
                                    <S.Input placeholder="예: 본인, 부모 등" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} />
                                </div>
                                <div>
                                    <S.Label>경조 내용</S.Label>
                                    <S.Input placeholder="예: 결혼, 장례 등" value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} />
                                </div>
                            </S.Grid2>
                        </S.FormSection>
                    )}

                    {form.type === '병가' && (
                        <S.FormSection $bgColor="rgba(240, 253, 244, 0.4)" $borderColor="#dcfce7">
                            <S.Label><Stethoscope size={14} /> 병가 필수 정보</S.Label>
                            <S.Section style={{ marginBottom: '1rem' }}>
                                <S.Label>증상 및 사유</S.Label>
                                <S.Input placeholder="예: 독감으로 인한 고열 및 몸살" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} />
                            </S.Section>
                            <S.Section>
                                <S.Label><ClipboardList size={14} /> 진료 예정 병원</S.Label>
                                <S.Input placeholder="예: 강남세브란스병원" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} />
                            </S.Section>
                        </S.FormSection>
                    )}

                    <S.Grid2>
                        <div>
                            <S.Label>시작일</S.Label>
                            <S.Input $focusColor="black" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                        </div>
                        <div>
                            <S.Label>종료일</S.Label>
                            <S.Input $focusColor="black" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                        </div>
                    </S.Grid2>

                    <S.Section>
                        <S.Label>상세 사유 (선택)</S.Label>
                        <S.TextArea $focusColor="black" rows={3} placeholder="추가적인 사유가 있다면 입력하세요" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                    </S.Section>
                </S.Body>

                <S.Footer>
                    <S.CancelButton onClick={onClose}>취소</S.CancelButton>
                    <S.SubmitButton onClick={onSubmit}>신청 완료</S.SubmitButton>
                </S.Footer>
            </S.ModalContainer>
        </S.Overlay>
    );
};
