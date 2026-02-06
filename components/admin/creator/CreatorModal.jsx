import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Lock } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';
import { creatorService } from '../../../api/creatorService';
import { memberService, mapManagerFromBackend } from '../../../api/memberService';
import { useCreatorStore } from '../../../stores/useCreatorStore';
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
    employees // 더 이상 사용하지 않음 (하위 호환성 유지)
}) => {
    const isEdit = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addCreator, updateCreator } = useCreatorStore();

    // 매니저 목록 상태
    const [managers, setManagers] = useState([]);
    const [isLoadingManagers, setIsLoadingManagers] = useState(false);

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
        managerName: '',
        managerId: null
    });

    // 매니저 목록 불러오기
    useEffect(() => {
        if (isOpen) {
            loadManagers();
        }
    }, [isOpen]);

    const loadManagers = async () => {
        setIsLoadingManagers(true);
        try {
            const response = await memberService.getAllManagers();
            const mappedManagers = response.map(mapManagerFromBackend);
            setManagers(mappedManagers);
            console.log('매니저 목록 로드 완료:', mappedManagers);
        } catch (error) {
            console.error('매니저 목록 로드 실패:', error);
            toast.error('매니저 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoadingManagers(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            // 매니저 ID 찾기 (API에서 불러온 매니저 목록 사용)
            const manager = managers.find(mgr => mgr.name === initialData.manager);

            setFormData({
                name: initialData.name,
                platform: initialData.platform,
                subscribers: initialData.subscribers,
                category: initialData.category || '',
                status: (initialData.status === '계약만료' || initialData.status === '종료') ? '대기중' : initialData.status,
                avatarUrl: initialData.avatarUrl,
                contactInfo: initialData.contactInfo || '',
                loginId: initialData.loginId || '',
                password: '', // 수정 시 비밀번호는 비워둠
                managerName: initialData.manager && initialData.manager !== '담당자 없음' ? initialData.manager : '',
                managerId: manager ? manager.id : initialData.managerId || null
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
                managerName: '',
                managerId: null
            });
        }
    }, [initialData, isOpen, managers]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.platform || !formData.subscribers || !formData.category || !formData.contactInfo) {
            toast.error('필수 정보를 모두 입력해주세요.');
            return;
        }

        // 신규 등록 시 비밀번호 필수
        if (!isEdit && !formData.password) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEdit) {
                // 기존 onSave 호출 (부모 컴포넌트 로직 유지)
                if (onSave) {
                    onSave(formData, isEdit);
                }

                // 백엔드 API 호출
                const response = await creatorService.updateCreator(initialData.id, formData);
                console.log('크리에이터 수정 성공:', response);

                // 스토어 업데이트
                updateCreator(initialData.id, {
                    ...initialData,
                    ...formData,
                    manager: formData.managerName || '담당자 없음'
                });

            } else {
                // 기존 onSave 호출 (부모 컴포넌트 로직 유지)
                if (onSave) {
                    onSave(formData, isEdit);
                }

                // 백엔드 API 호출
                const response = await creatorService.createCreator(formData);
                console.log('크리에이터 등록 성공:', response);
            }

            onClose();

        } catch (error) {
            console.error('크리에이터 저장 실패:', error);
            toast.error(error.response?.data?.message || '작업에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManagerChange = (e) => {
        const selectedManagerId = parseInt(e.target.value);
        const selectedManager = managers.find(mgr => mgr.id === selectedManagerId);

        setFormData({
            ...formData,
            managerName: selectedManager ? selectedManager.name : '',
            managerId: selectedManagerId || null
        });
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
                                    disabled={isSubmitting}
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
                                            onClick={() => !isSubmitting && setFormData({ ...formData, platform: p })}
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
                                        disabled={isSubmitting}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>카테고리</Label>
                                    <Input
                                        placeholder="예: 게임, 먹방"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </InputGroup>
                            </Grid>
                            <InputGroup>
                                <Label>기본 연락망</Label>
                                <Input
                                    placeholder="전화번호 또는 이메일"
                                    value={formData.contactInfo}
                                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                    disabled={isSubmitting}
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
                                        disabled={isEdit || isSubmitting}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>비밀번호</Label>
                                    <Input
                                        type="password"
                                        placeholder="비밀번호 입력"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </InputGroup>
                            </Column>

                            <Column>
                                <SectionTitle>운영 정보</SectionTitle>
                                <InputGroup>
                                    <Label>담당 매니저 배정</Label>
                                    <Select
                                        value={formData.managerId || ''}
                                        onChange={handleManagerChange}
                                        disabled={isSubmitting || isLoadingManagers}
                                    >
                                        <option value="">
                                            {isLoadingManagers ? '매니저 목록 로딩 중...' : '담당자 없음 (미배정)'}
                                        </option>
                                        {managers.map(mgr => (
                                            <option key={mgr.id} value={mgr.id}>
                                                {mgr.name} ({mgr.dept})
                                            </option>
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
                                        disabled={isSubmitting}
                                    >
                                        <option value="활동중">활동중</option>
                                        <option value="휴식중">휴식중</option>
                                        <option value="은퇴">은퇴</option>
                                    </Select>
                                </InputGroup>
                            </Column>
                        </Column>
                    </Grid>
                </Body>
                <Footer>
                    <Button onClick={onClose} disabled={isSubmitting}>취소</Button>
                    <Button $primary onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? '처리 중...' : (isEdit ? '수정 완료' : '추가하기')}
                    </Button>
                </Footer>
            </Container>
        </Overlay>
    );
};