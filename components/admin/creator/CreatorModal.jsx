import React, { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';
import {
    Overlay, Container, Header, Title, CloseButton,
    Body, Footer, Button, SectionTitle, InputGroup, Label, Input, Select,
    Grid, Column, InfoBox, PlatformGrid, PlatformItem, PlatformName
} from './CreatorModals.styled';

const PlatformOption = ({ platform, selected, onClick }) => (
    <PlatformItem $selected={selected} onClick={onClick}>
        <div style={{ marginBottom: '0.5rem' }}>{renderPlatformIcon(platform, 24)}</div>
        <PlatformName $selected={selected}>
            {platform === 'Chzzk' ? '치지직' : platform}
        </PlatformName>
    </PlatformItem>
);

export const CreatorModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    employees
}) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        name: '',
        platform: 'YouTube',
        subscribers: '',
        category: '',
        status: '대기중',
        avatarUrl: '',
        contactInfo: '',
        loginId: '',
        password: '',
        managerName: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                platform: initialData.platform,
                subscribers: initialData.subscribers,
                category: initialData.category || '',
                status: (initialData.status === '계약만료' || initialData.status === '종료') ? '대기중' : initialData.status,
                avatarUrl: initialData.avatarUrl,
                contactInfo: initialData.contactInfo || '',
                loginId: initialData.loginId || '',
                password: initialData.password || '',
                managerName: initialData.manager && initialData.manager !== '담당자 없음' ? initialData.manager : ''
            });
        } else {
            setFormData({
                name: '',
                platform: 'YouTube',
                subscribers: '',
                category: '',
                status: '대기중',
                avatarUrl: '',
                contactInfo: '',
                loginId: '',
                password: '',
                managerName: ''
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        if (!formData.name || !formData.platform || !formData.subscribers || !formData.category || !formData.contactInfo || !formData.password) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        onSave(formData, isEdit);
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Container $maxWidth="42rem" onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>
                        {isEdit ? '크리에이터 정보 수정' : '새 크리에이터 등록 (Admin)'}
                    </Title>
                    <CloseButton onClick={onClose}><X size={20} /></CloseButton>
                </Header>
                <Body>
                    <Grid $mdCols={2} $gap="2rem">
                        {/* Left Column: Essential Info */}
                        <Column>
                            <SectionTitle>기본 정보 (필수)</SectionTitle>
                            <InputGroup>
                                <Label>이름</Label>
                                <Input
                                    placeholder="크리에이터 이름 입력"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>플랫폼</Label>
                                <PlatformGrid>
                                    {['YouTube', 'Twitch', 'Chzzk', 'Instagram', 'TikTok'].map((p) => (
                                        <PlatformOption
                                            key={p}
                                            platform={p}
                                            selected={formData.platform === p}
                                            onClick={() => setFormData({ ...formData, platform: p })}
                                        />
                                    ))}
                                </PlatformGrid>
                            </InputGroup>
                            <Grid $cols={2}>
                                <InputGroup>
                                    <Label>구독자 수</Label>
                                    <Input
                                        placeholder="예: 10.5만명"
                                        value={formData.subscribers}
                                        onChange={e => setFormData({ ...formData, subscribers: e.target.value })}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>카테고리</Label>
                                    <Input
                                        placeholder="예: 게임, 먹방"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </InputGroup>
                            </Grid>
                            <InputGroup>
                                <Label>기본 연락망</Label>
                                <Input
                                    placeholder="전화번호 또는 이메일"
                                    value={formData.contactInfo}
                                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                />
                            </InputGroup>
                        </Column>

                        {/* Right Column: Account & Optional */}
                        <Column $gap="1.5rem">
                            <Column>
                                <SectionTitle>
                                    <Lock size={12} style={{ marginRight: '0.25rem' }} /> 계정 정보 (필수)
                                </SectionTitle>
                                <InputGroup>
                                    <Label>로그인 ID</Label>
                                    <Input
                                        placeholder="영문 소문자 권장"
                                        value={formData.loginId}
                                        onChange={e => setFormData({ ...formData, loginId: e.target.value })}
                                        disabled={isEdit}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>비밀번호</Label>
                                    <Input
                                        type="password"
                                        placeholder="비밀번호 입력"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </InputGroup>
                            </Column>

                            <Column>
                                <SectionTitle>운영 정보</SectionTitle>
                                <InputGroup>
                                    <Label>담당 매니저 배정</Label>
                                    <Select
                                        value={formData.managerName}
                                        onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                                    >
                                        <option value="">담당자 없음 (미배정)</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                                        ))}
                                    </Select>
                                </InputGroup>
                                <InfoBox>
                                    * 프로필 사진과 커버 이미지는 크리에이터 본인이 마이페이지에서 직접 관리합니다. 관리자 및 직원은 수정할 수 없습니다.
                                </InfoBox>
                                <InputGroup>
                                    <Label>상태</Label>
                                    <Select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="대기중">대기중</option>
                                        <option value="활동중">활동중</option>
                                        <option value="휴식중">휴식중</option>
                                    </Select>
                                </InputGroup>
                            </Column>
                        </Column>
                    </Grid>
                </Body>
                <Footer>
                    <Button onClick={onClose}>취소</Button>
                    <Button $primary onClick={handleSubmit}>
                        {isEdit ? '수정 완료' : '추가하기'}
                    </Button>
                </Footer>
            </Container>
        </Overlay>
    );
};
