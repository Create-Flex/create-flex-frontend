import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Check } from 'lucide-react';
import { legalTaxService } from '../../../api/legalTaxService';
import { useLegalTaxStore } from '../../../stores/useLegalTaxStore';
import { mapLegalTaxFromBackend } from '../../../utils/legalTaxMapper';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, PrimaryButton, SecondaryButton,
    GuideBox, FormGroup, Label, Select, Input, TextArea
} from './Modal.styled';

export const SupportRequestModal = ({
    isOpen,
    onClose,
    type, // 'legal' or 'tax'
    onConfirm
}) => {
    const [form, setForm] = useState({
        creatorId: '',
        title: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myCreators, setMyCreators] = useState([]);
    const [isLoadingCreators, setIsLoadingCreators] = useState(false);

    const { addRequest, setLoading, setError } = useLegalTaxStore();

    // 모달이 열릴 때 내가 담당하는 크리에이터 목록 가져오기
    useEffect(() => {
        if (isOpen) {
            fetchMyCreators();
        }
    }, [isOpen]);

    const fetchMyCreators = async () => {
        setIsLoadingCreators(true);
        try {
            const creators = await legalTaxService.getMyCreators();

            // 백엔드 응답 형식에 맞게 매핑 (필요시 조정)
            const mappedCreators = creators.map(creator => ({
                id: creator.member_id || creator.memberId,
                name: creator.member_name || creator.memberName || creator.name
            }));

            setMyCreators(mappedCreators);
        } catch (error) {
            console.error('담당 크리에이터 목록 조회 실패:', error);
            setError(error.message);
            toast.error('크리에이터 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoadingCreators(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.creatorId || !form.title || !form.content) {
            toast.error('필수 정보를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        try {
            const requestData = {
                creatorId: parseInt(form.creatorId),
                type: type, // 'legal' or 'tax'
                title: form.title,
                content: form.content
            };

            // API 호출
            const response = await legalTaxService.createRequest(requestData);

            console.log('법률/세무 신청 성공:', response);

            // 성공 시 스토어에 추가 (onConfirm을 통해)
            if (onConfirm) {
                onConfirm({ ...form, type });
            }

            toast.success(response.message || '상담 신청이 완료되었습니다.');

            // 폼 초기화 및 모달 닫기
            setForm({ creatorId: '', title: '', content: '' });
            onClose();
        } catch (error) {
            console.error('법률/세무 신청 실패:', error);
            setError(error.message);
            toast.error('상담 신청에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
                <ModalHeader>
                    <ModalTitle>
                        {type === 'legal' ? '법률 자문 신청' : '세무 상담 신청'}
                    </ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <GuideBox>
                        {type === 'legal'
                            ? '전속 계약서 검토, 저작권 분쟁, 악성 댓글 고소 등 법률적인 지원이 필요한 내용을 작성해주세요.'
                            : '세금 신고, 정산서 발행, 비용 처리 등 세무/회계 관련 문의 사항을 작성해주세요.'}
                    </GuideBox>

                    <div className="space-y-6">
                        <FormGroup>
                            <Label>대상 크리에이터</Label>
                            <Select
                                value={form.creatorId}
                                onChange={e => setForm({ ...form, creatorId: e.target.value })}
                                disabled={isSubmitting || isLoadingCreators}
                            >
                                <option value="">
                                    {isLoadingCreators ? '로딩 중...' : '크리에이터 선택'}
                                </option>
                                {myCreators.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Select>
                            {!isLoadingCreators && myCreators.length === 0 && (
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                    담당하는 크리에이터가 없습니다.
                                </p>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>제목</Label>
                            <Input
                                placeholder="상담 제목을 입력하세요"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>상담 요청 내용</Label>
                            <TextArea
                                rows={5}
                                placeholder="구체적인 내용을 입력해주세요."
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </FormGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                        취소
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                        <Check size={16} /> {isSubmitting ? '신청 중...' : '신청하기'}
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};