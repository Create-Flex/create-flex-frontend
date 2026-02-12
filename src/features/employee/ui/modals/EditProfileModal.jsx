import React, { useState, useEffect } from 'react';
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
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
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

export const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState({
        memberName: '',
        engName: '',
        address: '',
        personalEmail: '',
        personalCall: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                memberName: profile.name || '',
                engName: profile.engName || '',
                address: profile.address || '',
                personalEmail: profile.personalEmail || '',
                personalCall: profile.phone || ''
            });
            setError('');
        }
    }, [profile, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (!formData.memberName.trim()) {
            setError('이름을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || '정보 수정에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>내 정보 수정</Title>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </Header>
                <Content>
                    <FormGroup>
                        <Label>이름 (한글) *</Label>
                        <Input
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleChange}
                            placeholder="홍길동"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>영어 이름</Label>
                        <Input
                            name="engName"
                            value={formData.engName}
                            onChange={handleChange}
                            placeholder="Hong Gildong"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>주소</Label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="서울시 강남구..."
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>개인 이메일</Label>
                        <Input
                            name="personalEmail"
                            type="email"
                            value={formData.personalEmail}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>전화번호</Label>
                        <Input
                            name="personalCall"
                            value={formData.personalCall}
                            onChange={handleChange}
                            placeholder="010-1234-5678"
                        />
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Content>
                <Footer>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                    <SaveButton onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? '저장 중...' : '저장'}
                    </SaveButton>
                </Footer>
            </Modal>
        </Overlay>
    );
};
