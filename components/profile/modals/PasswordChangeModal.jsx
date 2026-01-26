import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, ModalBody, ModalFooter,
    PrimaryButton, SecondaryButton, FormStack, Label
} from './Modal.styled';
import { Input } from '../ProfileInfo.styled'; // Reusing Input from ProfileInfo

export const PasswordChangeModal = ({
    isOpen,
    onClose
}) => {
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const handlePasswordChange = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        alert('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
        setPasswordForm({ current: '', new: '', confirm: '' });
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} $maxWidth="24rem">
                <ModalHeader>
                    <ModalTitle>비밀번호 변경</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <FormStack>
                        <div>
                            <Label>현재 비밀번호</Label>
                            <Input
                                type="password"
                                placeholder="현재 비밀번호 입력"
                                value={passwordForm.current}
                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>새 비밀번호</Label>
                            <Input
                                type="password"
                                placeholder="새 비밀번호 입력"
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>새 비밀번호 확인</Label>
                            <Input
                                type="password"
                                placeholder="새 비밀번호 재입력"
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            />
                        </div>
                    </FormStack>
                </ModalBody>
                <ModalFooter>
                    <SecondaryButton onClick={onClose}>취소</SecondaryButton>
                    <PrimaryButton onClick={handlePasswordChange}>
                        변경하기
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};
