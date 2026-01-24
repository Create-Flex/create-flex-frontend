import React, { useState } from 'react';
import { Users, FileText, Activity } from 'lucide-react';
import { CreatorHealthView } from './creator/shared/Health';
import { CreatorList } from './admin/creator/CreatorList';
import { ContractManagement } from './admin/creator/ContractManagement';
import { CreatorModal } from './admin/creator/CreatorModal';
import { AssignManagerModal } from './admin/creator/AssignManagerModal';

import {
    Container, InnerContainer, Breadcrumb, HeaderSection, HeaderContent, IconBox, Title, Description
} from './AdminCreatorView.styled';

export const AdminCreatorView = ({
    user,
    creators,
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    employees,
    currentView
}) => {
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCreator, setEditingCreator] = useState(null);
    const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false);
    const [assignCreatorId, setAssignCreatorId] = useState(null);

    // Handlers
    const handleOpenAdd = () => {
        setEditingCreator(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (creator) => {
        setEditingCreator(creator);
        setIsAddModalOpen(true);
    };

    const handleSaveCreator = (formData, isEdit) => {
        if (isEdit && editingCreator) {
            const updatedCreators = creators.map(c =>
                c.id === editingCreator.id
                    ? {
                        ...c,
                        name: formData.name,
                        platform: formData.platform,
                        subscribers: formData.subscribers,
                        category: formData.category,
                        status: formData.status,
                        avatarUrl: formData.avatarUrl,
                        contactInfo: formData.contactInfo,
                        loginId: formData.loginId,
                        password: formData.password,
                        manager: formData.managerName || '담당자 없음',
                        managementStartDate: formData.managerName ? (c.managementStartDate || new Date().toISOString().split('T')[0]) : undefined,
                        managementEndDate: formData.managerName ? (c.managementEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]) : undefined
                    }
                    : c
            );
            onUpdateCreators(updatedCreators);
        } else {
            const newId = (creators.length + 1).toString();
            const newCreator = {
                id: newId,
                name: formData.name,
                platform: formData.platform,
                status: formData.status,
                subscribers: formData.subscribers,
                avatarUrl: formData.avatarUrl,
                coverUrl: '',
                tags: [],
                category: formData.category,
                manager: formData.managerName || '담당자 없음',
                channelName: formData.name + ' Channel',
                contactInfo: formData.contactInfo,
                contractStatus: 'Drafting',
                loginId: formData.loginId || formData.name.toLowerCase(),
                password: formData.password,
                managementStartDate: formData.managerName ? new Date().toISOString().split('T')[0] : undefined,
                managementEndDate: formData.managerName ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : undefined
            };
            onUpdateCreators([...creators, newCreator]);
        }
        setIsAddModalOpen(false);
    };

    const handleDeleteCreator = (id) => {
        if (window.confirm('정말로 이 크리에이터를 삭제하시겠습니까? (미구현)')) {
            // Implement delete logic here
            alert('삭제 기능은 아직 구현되지 않았습니다.');
        }
    }

    // Not used directly in new structure but kept for logic reference if needed via AssignManagerModal
    const handleAssignManager = (creatorId, managerName) => {
        const updatedCreators = creators.map(c =>
            c.id === creatorId
                ? {
                    ...c,
                    manager: managerName,
                    managementStartDate: managerName !== '담당자 없음' ? new Date().toISOString().split('T')[0] : undefined,
                    managementEndDate: managerName !== '담당자 없음' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : undefined
                }
                : c
        );
        onUpdateCreators(updatedCreators);
        setIsAssignManagerModalOpen(false);
    };

    const renderTitle = () => {
        switch (currentView) {
            case 'admin-creator-list': return '크리에이터 목록관리';
            case 'admin-creator-contract': return '크리에이터 계약관리';
            case 'admin-creator-health': return '크리에이터 건강관리';
            default: return '크리에이터 관리';
        }
    };

    const renderDescription = () => {
        switch (currentView) {
            case 'admin-creator-list': return '전체 소속 크리에이터 목록과 담당자를 관리합니다.';
            case 'admin-creator-contract': return '크리에이터와의 계약서 및 정산 문서를 관리합니다.';
            case 'admin-creator-health': return '크리에이터의 건강 검진 결과 및 심리 상태를 관리합니다.';
            default: return '크리에이터 통합 관리 시스템';
        }
    };

    const renderHeaderIcon = () => {
        switch (currentView) {
            case 'admin-creator-contract': return <FileText size={24} />;
            case 'admin-creator-health': return <Activity size={24} />;
            default: return <Users size={24} />;
        }
    };

    return (
        <Container>
            <InnerContainer>
                <Breadcrumb>HR 관리 / 크리에이터 관리</Breadcrumb>
                <HeaderSection>
                    <HeaderContent>
                        <IconBox>
                            {renderHeaderIcon()}
                        </IconBox>
                        <div>
                            <Title>{renderTitle()}</Title>
                            <Description>{renderDescription()}</Description>
                        </div>
                    </HeaderContent>
                </HeaderSection>

                {(currentView === 'admin-creator-list' || !currentView || currentView === 'creator') && (
                    <CreatorList
                        creators={creators}
                        onOpenAddModal={handleOpenAdd}
                        onOpenEditModal={handleOpenEdit}
                        onDeleteCreator={handleDeleteCreator}
                    />
                )}

                {currentView === 'admin-creator-contract' && (
                    <ContractManagement creators={creators} />
                )}

                {currentView === 'admin-creator-health' && (
                    <CreatorHealthView
                        creators={creators}
                        records={healthRecords}
                        onUpdateRecords={onUpdateHealthRecords}
                        logs={issueLogs}
                        onUpdateLogs={onUpdateIssueLogs}
                        readOnly={true}
                    />
                )}

                {/* Add/Edit Modal */}
                <CreatorModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleSaveCreator}
                    initialData={editingCreator}
                    employees={employees}
                />

                {/* Assign Manager Modal (Optional direct usage) */}
                <AssignManagerModal
                    isOpen={isAssignManagerModalOpen}
                    onClose={() => setIsAssignManagerModalOpen(false)}
                    onSave={handleAssignManager}
                    creatorId={assignCreatorId || ''}
                    employees={employees}
                />
            </InnerContainer>
        </Container>
    );
};
