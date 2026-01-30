import React, { useState, useEffect } from 'react';
import { CalendarIcon, X, User as UserIcon, CheckCircle2 } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, PrimaryButton, SecondaryButton,
    FormGroup, Label, Select, Input, TextArea
} from './Modal.styled';

export const EventModal = ({
    isOpen,
    onClose,
    date,
    initialCreatorId,
    creators,
    onConfirm
}) => {
    const [form, setForm] = useState({
        creatorId: initialCreatorId || '',
        title: '',
        date: date || new Date().toISOString().split('T')[0],
        type: 'content',
        content: '',
        partnerCreators: [],
    });
    const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setForm(prev => ({
                ...prev,
                creatorId: initialCreatorId || prev.creatorId,
                date: date || prev.date
            }));
        }
    }, [isOpen, date, initialCreatorId]);

    const potentialPartners = creators.filter(c => c.id !== form.creatorId && c.name.includes(partnerSearchQuery));

    const togglePartnerCreator = (creatorId) => {
        setForm(prev => {
            const exists = prev.partnerCreators.includes(creatorId);
            return {
                ...prev,
                partnerCreators: exists
                    ? prev.partnerCreators.filter(id => id !== creatorId)
                    : [...prev.partnerCreators, creatorId],
            };
        });
    };

    const handleSubmit = () => {
        if (!form.title || !form.creatorId) {
            alert('제목과 주최 크리에이터를 모두 입력해주세요.');
            return;
        }
        onConfirm(form);
        // Do not reset form here if parent closes modal, or reset?
        // Resetting form is safer.
        setForm({
            creatorId: initialCreatorId || '',
            title: '',
            date: date || new Date().toISOString().split('T')[0],
            type: 'content',
            content: '',
            partnerCreators: [],
        });
        setPartnerSearchQuery('');
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
                <ModalHeader>
                    <ModalTitle>
                        <CalendarIcon size={20} style={{ color: '#2563eb' }} />
                        새 일정 추가
                    </ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <FormGroup>
                            <Label>일정 제목</Label>
                            <Input
                                $autoFocus
                                placeholder="제목을 입력하세요"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>주최 크리에이터</Label>
                            <Select
                                value={form.creatorId}
                                onChange={e => setForm({ ...form, creatorId: e.target.value })}
                            >
                                <option value="">선택하세요</option>
                                {creators.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>
                                ))}
                            </Select>
                        </FormGroup>

                        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <FormGroup>
                                <Label>날짜 선택</Label>
                                <Input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>유형 선택</Label>
                                <Select
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="content">콘텐츠</option>
                                    <option value="live">라이브</option>
                                    <option value="meeting">미팅</option>
                                    <option value="joint">합방</option>
                                    <option value="other">기타</option>
                                </Select>
                            </FormGroup>
                        </div>

                        {form.type === 'joint' && (
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 animate-[fadeIn_0.2s_ease-out]" style={{ backgroundColor: '#faf5ff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #f3e8ff' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', marginBottom: '0.75rem' }}>
                                    <UserIcon size={14} /> 합방 참여 크리에이터 선택 (최소 1명)
                                </h4>

                                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                                    <Input
                                        placeholder="이름으로 검색..."
                                        value={partnerSearchQuery}
                                        onChange={e => setPartnerSearchQuery(e.target.value)}
                                        style={{ paddingLeft: '2.25rem' }}
                                    />
                                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#d8b4fe' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                </div>

                                <div style={{ maxHeight: '140px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                    {potentialPartners.length > 0 ? potentialPartners.map(creator => {
                                        const isSelected = form.partnerCreators.includes(creator.id);
                                        return (
                                            <div
                                                key={creator.id}
                                                onClick={() => togglePartnerCreator(creator.id)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderRadius: '0.5rem',
                                                    cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                                                    backgroundColor: isSelected ? 'white' : 'transparent',
                                                    borderColor: isSelected ? '#e9d5ff' : 'transparent',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                                                        {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? 700 : 400, color: isSelected ? '#581c87' : '#4b5563' }}>
                                                        {creator.name}
                                                    </span>
                                                </div>
                                                {isSelected && <CheckCircle2 size={16} color="#9333ea" />}
                                            </div>
                                        );
                                    }) : (
                                        <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>검색 결과가 없습니다.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <FormGroup>
                            <Label>상세 내용</Label>
                            <TextArea
                                rows={3}
                                placeholder="상세 정보를 입력하세요"
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            />
                        </FormGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <SecondaryButton onClick={onClose}>취소</SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>
                        등록 완료
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};
