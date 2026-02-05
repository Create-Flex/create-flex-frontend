import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
    padding: 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    line-height: 1;
    &:hover { color: #333; }
`;

const Content = styled.div`
    padding: 24px;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: #00C471;
    }
`;

const Footer = styled.div`
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const Button = styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
`;

const CancelButton = styled(Button)`
    background: #f5f5f5;
    border: none;
    color: #666;
    &:hover { background: #eee; }
`;

const SaveButton = styled(Button)`
    background: #00C471;
    border: none;
    color: white;
    &:hover { background: #00a85e; }
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #e74c3c;
    font-size: 13px;
    margin-top: 8px;
`;

const SuccessMessage = styled.p`
    color: #00C471;
    font-size: 13px;
    margin-top: 8px;
`;

const PasswordRequirements = styled.ul`
    font-size: 12px;
    color: #888;
    margin: 8px 0 0 0;
    padding-left: 16px;
`;

export const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const validatePassword = () => {
        if (!formData.currentPassword) {
            setError('현재 비밀번호를 입력해주세요.');
            return false;
        }
        if (!formData.newPassword) {
            setError('새 비밀번호를 입력해주세요.');
            return false;
        }
        if (formData.newPassword.length < 8) {
            setError('새 비밀번호는 8자 이상이어야 합니다.');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (formData.currentPassword === formData.newPassword) {
            setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        setError('');

        try {
            await onSave(formData.currentPassword, formData.newPassword);
            setSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>비밀번호 변경</Title>
                    <CloseButton onClick={handleClose}>&times;</CloseButton>
                </Header>
                <Content>
                    <FormGroup>
                        <Label>현재 비밀번호 *</Label>
                        <Input
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="현재 비밀번호 입력"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>새 비밀번호 *</Label>
                        <Input
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="새 비밀번호 입력"
                        />
                        <PasswordRequirements>
                            <li>8자 이상 입력</li>
                        </PasswordRequirements>
                    </FormGroup>
                    <FormGroup>
                        <Label>새 비밀번호 확인 *</Label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="새 비밀번호 다시 입력"
                        />
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{success}</SuccessMessage>}
                </Content>
                <Footer>
                    <CancelButton onClick={handleClose}>취소</CancelButton>
                    <SaveButton onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </SaveButton>
                </Footer>
            </Modal>
        </Overlay>
    );
};
