import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import {
    Overlay, Container, Header, Title, CloseButton,
    Body, Footer, Button, Select, HelperText
} from './CreatorModals.styled';

export const AssignManagerModal = ({
    isOpen,
    onClose,
    onSave,
    creatorId,
    employees
}) => {
    const [managerName, setManagerName] = useState('');

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Container $maxWidth="24rem" onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>담당 매니저 배정</Title>
                    <CloseButton onClick={onClose}><X size={20} /></CloseButton>
                </Header>
                <Body>
                    <HelperText>
                        선택한 크리에이터를 담당할 매니저를 선택해주세요.
                    </HelperText>
                    <Select
                        value={managerName}
                        onChange={e => setManagerName(e.target.value)}
                    >
                        <option value="">담당자 없음 (미배정)</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                        ))}
                    </Select>
                </Body>
                <Footer>
                    <Button onClick={onClose}>취소</Button>
                    <Button $primary onClick={() => onSave(creatorId, managerName)}>
                        <Check size={14} /> 저장
                    </Button>
                </Footer>
            </Container>
        </Overlay>
    );
};
