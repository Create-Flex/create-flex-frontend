import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Users, FileText, Activity, Network, Scale } from 'lucide-react';
import { CreatorHealthView } from './components/shared/Health';
import { CreatorList } from './admin/CreatorList';
import { ContractManagement } from './admin/ContractManagement';
import { CreatorModal } from './admin/CreatorModal';
import { AssignManagerModal } from './admin/AssignManagerModal';

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
        // Modal 내부에서 Store를 직접 업데이트하므로,
        // 이곳에서의 수동 상태 관리는 더 이상 필요하지 않습니다.
        setIsAddModalOpen(false);
    };

    const handleDeleteCreator = (id) => {
        if (window.confirm('정말로 이 크리에이터를 삭제하시겠습니까? (미구현)')) {
            // Implement delete logic here
            toast.error('삭제 기능은 아직 구현되지 않았습니다.');
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
            case 'admin-creator-list': return <Users size={32} />;
            case 'admin-creator-contract': return <FileText size={32} />;
            case 'admin-creator-health': return <Activity size={32} />;
            case 'hr-teams': return <Network size={32} />;
            case 'hr-support': return <Scale size={32} />;
            default: return <Users size={32} />;
        }
    };

    return (
        <Container>
            <InnerContainer>
                {/* Breadcrumb removed or kept? User asked for Title Style. Keeping breadcrumb as context. */}
                {/* Breadcrumb removed */}
                <HeaderSection>
                    <HeaderContent>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {renderHeaderIcon()}
                            <div>
                                <Title>{renderTitle()}</Title>
                                <Description>{renderDescription()}</Description>
                            </div>
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
                {currentView === 'employee-creator-calendar' && (
                    <CalendarTab
                        onAddEvent={(dateStr) => {
                            setEventModalData({
                                date: dateStr || new Date().toISOString().split('T')[0],
                                creatorId: '',
                                title: '',
                                type: 'content',
                                content: ''
                            });
                            setIsEventModalOpen(true);
                        }}
                        onEventClick={setSelectedEvent}
                    />
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
