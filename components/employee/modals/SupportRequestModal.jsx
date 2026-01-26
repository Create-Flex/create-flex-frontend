import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
    ModalBody, ModalFooter, PrimaryButton, SecondaryButton,
    GuideBox, FormGroup, Label, Select, Input, TextArea
} from './Modal.styled';

export const SupportRequestModal = ({
    isOpen,
    onClose,
    type, // 'legal' or 'tax'
    creators,
    onConfirm
}) => {
    const [form, setForm] = useState({
        creatorId: '',
        title: '',
        content: ''
    });

    const handleSubmit = () => {
        if (!form.creatorId || !form.title || !form.content) {
            alert('필수 정보를 입력해주세요.');
            return;
        }
        onConfirm({ ...form, type });
        setForm({ creatorId: '', title: '', content: '' }); // Reset
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
                            >
                                <option value="">크리에이터 선택</option>
                                {creators.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>제목</Label>
                            <Input
                                placeholder="상담 제목을 입력하세요"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>상담 요청 내용</Label>
                            <TextArea
                                rows={5}
                                placeholder="구체적인 내용을 입력해주세요."
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            />
                        </FormGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <SecondaryButton onClick={onClose}>취소</SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>
                        <Check size={16} /> 신청하기
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};
