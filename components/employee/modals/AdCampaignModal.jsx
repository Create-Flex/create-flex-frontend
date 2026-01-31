import React, { useState } from 'react';
import { X } from 'lucide-react';
import { advertisementService } from '../../../api/AdvertisementService';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, PrimaryButton, SecondaryButton,
    FormGroup, Input, TextArea, Select
} from './Modal.styled';

export const AdCampaignModal = ({
    isOpen,
    onClose,
    creators,
    onSuccess,
}) => {
    const [form, setForm] = useState({
        brandName: '',
        campaignTitle: '',
        budget: '',
        creatorId: '',
        description: '',
        targetDate: new Date().toISOString().split('T')[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!form.brandName || !form.campaignTitle || !form.budget || !form.creatorId) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('광고 등록 요청:', form);
            
            const response = await advertisementService.createAdvertisement({
                creatorId: Number(form.creatorId),
                brandName: form.brandName,
                campaignTitle: form.campaignTitle,
                budget: form.budget,
                description: form.description,
                targetDate: form.targetDate
            });
            
            console.log('광고 등록 성공:', response);
            
            alert(response.message || '광고 캠페인이 성공적으로 등록되었습니다.');
            
            // 폼 초기화
            setForm({
                brandName: '',
                campaignTitle: '',
                budget: '',
                creatorId: '',
                description: '',
                targetDate: new Date().toISOString().split('T')[0],
            });
            
            // 모달 닫기
            onClose();
            
            // 부모에게 성공 알림 (목록 새로고침용)
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('광고 등록 실패:', error);
            alert(error.response?.data?.message || '광고 캠페인 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
                <ModalHeader>
                    <ModalTitle>광고 캠페인 등록</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-5">
                        <FormGroup>
                            <Input
                                placeholder="광고주 (브랜드명)"
                                value={form.brandName}
                                onChange={e => setForm({ ...form, brandName: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Input
                                placeholder="제품 / 캠페인명"
                                value={form.campaignTitle}
                                onChange={e => setForm({ ...form, campaignTitle: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Input
                                placeholder="제안 단가"
                                value={form.budget}
                                onChange={e => setForm({ ...form, budget: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ flex: 1 }}>
                                <Select
                                    value={form.creatorId}
                                    onChange={e => setForm({ ...form, creatorId: e.target.value })}
                                    disabled={isSubmitting}
                                >
                                    <option value="">담당 크리에이터 선택</option>
                                    {creators.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    type="date"
                                    value={form.targetDate}
                                    onChange={e => setForm({ ...form, targetDate: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <FormGroup>
                            <TextArea
                                rows={4}
                                placeholder="상세 내용"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            * 등록된 목표 일정은 제안 수락 시 일정에 자동 반영됩니다.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                        취소
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? '등록 중...' : '등록하기'}
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};