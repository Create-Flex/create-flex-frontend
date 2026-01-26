import React, { useState } from 'react';
import { ProfileInfo } from './profile/ProfileInfo';
import { TaskSection } from './profile/TaskSection';
import { HealthSection } from './profile/HealthSection';
import { ImageUploadModal } from './profile/modals/ImageUploadModal';
import { PasswordChangeModal } from './profile/modals/PasswordChangeModal';
import { HealthResultModal } from './profile/modals/HealthResultModal';
import { Camera, ChevronLeft } from 'lucide-react';
import {
    Container, HeaderButton, BackButtonWrapper, CoverButtonWrapper, CoverUpdateBtn,
    CoverImageContainer, CoverImage, PlaceholderCover, CoverOverlay,
    ContentContainer, AvatarContainer, AvatarWrapper, AvatarImage,
    NameSection, NameTitle, TabsContainer, TabsList, TabItem,
    SectionLayout, MainContent, SideWidget,
    VacationWidget, WidgetHeader, WidgetTitle, SmallButton,
    DaysRemaining, DaysNumber, DaysText,
    UsageBarContainer, UsageItem, UsageHeader,
    ProgressBarBg, ProgressBarFill
} from './ProfileView.styled';

import { useAuthStore } from '../stores/useAuthStore';
import { useOrgStore } from '../stores/useOrgStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useUIStore } from '../stores/useUIStore';
import { UserRole } from '../enums';

export const ProfileView = ({
    profile, // Optional prop for viewing other profiles
    readOnly = false,
    onBack,
    hideVacationWidget = false,
    hideTasks = false
}) => {
    // Hooks from stores
    const { user } = useAuthStore();
    const { userProfile, updateProfile, addHealthRecord } = useOrgStore();
    const { vacationLogs, allTasks, addTask, toggleTask, deleteTask } = useScheduleStore();
    const { openVacationModal, openPhqModal } = useUIStore();

    // Determine which profile to show
    const displayProfile = profile || userProfile;
    const isCurrentUser = user && displayProfile.employeeId === user.id; // Correct logic requires employeeId match

    // Check if this profile view is for a Creator
    // Logic: If user is creator, or if the displayed profile has job='Creator'
    const isCreatorProfile = displayProfile.job === 'Creator' || displayProfile.rank === 'Creator';

    // Local States
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('정보');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Image Update State
    const [imageModalState, setImageModalState] = useState({ isOpen: false, type: 'cover' });

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Health Upload State - Mock Data source maintained locally for view history display
    const [checkupHistory, setCheckupHistory] = useState([
        { id: 1, year: '2023', type: '일반 건강검진', date: '2023. 10. 15', result: '정상 (양호)' },
        { id: 2, year: '2022', type: '채용 건강검진', date: '2022. 01. 05', result: '정상 (경미)' },
    ]);

    // Derived Data
    const tabs = (readOnly || isCreatorProfile) ? ['정보'] : ['정보', '건강'];
    // Filter vacation logs for displayed user
    const userVacationLogs = vacationLogs.filter(log => log.name === displayProfile.name);

    // Creator Tasks (filter by displayed user ID if creator)
    const creatorTasks = isCreatorProfile && displayProfile.employeeId ? allTasks.filter(t => t.creatorId === displayProfile.employeeId) : [];

    // Validation: Only allow updates if it's the current user's profile and not readOnly
    const canUpdate = !readOnly && isCurrentUser;

    return (
        <Container>
            {onBack && (
                <BackButtonWrapper>
                    <HeaderButton onClick={onBack}>
                        <ChevronLeft size={14} /> 돌아가기
                    </HeaderButton>
                </BackButtonWrapper>
            )}

            {canUpdate && (
                <CoverButtonWrapper>
                    <CoverUpdateBtn onClick={() => setImageModalState({ isOpen: true, type: 'cover' })}>
                        <Camera size={12} /> 커버 변경
                    </CoverUpdateBtn>
                </CoverButtonWrapper>
            )}

            <CoverImageContainer onClick={() => canUpdate && setImageModalState({ isOpen: true, type: 'cover' })}>
                {displayProfile.coverUrl ? (
                    <CoverImage src={displayProfile.coverUrl} alt="Cover" />
                ) : (
                    <PlaceholderCover />
                )}
                {canUpdate && (
                    <CoverOverlay className="overlay">
                        <Camera size={24} />
                    </CoverOverlay>
                )}
            </CoverImageContainer>

            <ContentContainer>
                <AvatarContainer>
                    <AvatarWrapper className="group" onClick={() => canUpdate && setImageModalState({ isOpen: true, type: 'avatar' })}>
                        <AvatarImage src={displayProfile.avatarUrl} alt="Profile" />
                        {canUpdate && (
                            <CoverOverlay className="overlay">
                                <Camera size={20} />
                            </CoverOverlay>
                        )}
                    </AvatarWrapper>
                </AvatarContainer>

                <NameSection>
                    <NameTitle>{displayProfile.name}</NameTitle>
                </NameSection>

                {!isCreatorProfile && (
                    <TabsContainer>
                        <TabsList>
                            {tabs.map((tab) => (
                                <TabItem
                                    key={tab}
                                    $active={activeTab === tab}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </TabItem>
                            ))}
                        </TabsList>
                    </TabsContainer>
                )}

                <SectionLayout>
                    <MainContent>
                        {activeTab === '정보' && (<>
                            <ProfileInfo
                                profile={displayProfile}
                                isCreator={isCreatorProfile}
                                readOnly={readOnly || !canUpdate}
                                onUpdateProfile={canUpdate ? updateProfile : undefined}
                                onPasswordChangeClick={() => setIsPasswordModalOpen(true)}
                            />

                            {isCreatorProfile && !hideTasks && (
                                <TaskSection
                                    tasks={creatorTasks}
                                    onAddTask={(title) => {
                                        if (canUpdate) addTask(title, user.id, user.name)
                                    }}
                                    onToggleTask={canUpdate ? toggleTask : undefined}
                                    onDeleteTask={canUpdate ? deleteTask : undefined}
                                    readOnly={readOnly || !canUpdate}
                                />
                            )}
                        </>)}

                        {activeTab === '건강' && !isCreatorProfile && (
                            <HealthSection
                                profile={displayProfile}
                                checkupHistory={checkupHistory}
                                onOpenResultModal={() => setIsResultModalOpen(true)}
                                readOnly={readOnly || !canUpdate}
                            />
                        )}
                    </MainContent>

                    <SideWidget>
                        {!hideVacationWidget && !isCreatorProfile && (
                            <VacationWidget>
                                <WidgetHeader>
                                    <WidgetTitle>휴가 사용 현황</WidgetTitle>
                                    {canUpdate && (
                                        <SmallButton onClick={openVacationModal}>
                                            휴가 신청
                                        </SmallButton>
                                    )}
                                </WidgetHeader>
                                <DaysRemaining>
                                    <DaysNumber>12.5</DaysNumber>
                                    <DaysText>일 남음</DaysText>
                                </DaysRemaining>

                                <UsageBarContainer>
                                    <UsageItem>
                                        <UsageHeader>
                                            <span>연차</span>
                                            <span>2.5/15</span>
                                        </UsageHeader>
                                        <ProgressBarBg>
                                            <ProgressBarFill $width="16%" $color="#22c55e" />
                                        </ProgressBarBg>
                                    </UsageItem>
                                    <UsageItem>
                                        <UsageHeader>
                                            <span>반차</span>
                                            <span>2회</span>
                                        </UsageHeader>
                                        <ProgressBarBg>
                                            <ProgressBarFill $width="40%" $color="#f97316" />
                                        </ProgressBarBg>
                                    </UsageItem>
                                </UsageBarContainer>
                            </VacationWidget>
                        )}
                    </SideWidget>
                </SectionLayout>
            </ContentContainer>

            {/* Modals - Only render if can update or if viewing details that might need modals? 
                Actually image upload and password change are only for current user. 
                Health Result might be viewable? But here it is for upload.
            */}
            {canUpdate && (
                <>
                    <ImageUploadModal
                        isOpen={imageModalState.isOpen}
                        onClose={() => setImageModalState({ ...imageModalState, isOpen: false })}
                        type={imageModalState.type}
                        currentImage={imageModalState.type === 'cover' ? displayProfile.coverUrl : displayProfile.avatarUrl}
                        onImageSelect={(url) => {
                            updateProfile({ ...displayProfile, coverUrl: url });
                            setImageModalState({ ...imageModalState, isOpen: false });
                        }}
                        onImageUpload={(result) => {
                            updateProfile({ ...displayProfile, avatarUrl: result });
                            setImageModalState({ ...imageModalState, isOpen: false });
                        }}
                    />

                    <PasswordChangeModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => setIsPasswordModalOpen(false)}
                    />

                    <HealthResultModal
                        isOpen={isResultModalOpen}
                        onClose={() => setIsResultModalOpen(false)}
                        onUpload={(data) => {
                            const newLocalRecord = {
                                id: Date.now(),
                                year: new Date(data.date).getFullYear().toString(),
                                type: '정기 건강검진',
                                date: data.date.replace(/-/g, '. '),
                                result: data.status
                            };
                            setCheckupHistory([newLocalRecord, ...checkupHistory]);

                            if (addHealthRecord) {
                                const nextYear = new Date(data.date);
                                nextYear.setFullYear(nextYear.getFullYear() + 1);
                                const nextCheckStr = nextYear.toISOString().split('T')[0];

                                const newHealthRecord = {
                                    id: Date.now(),
                                    name: displayProfile.name,
                                    lastCheck: data.date,
                                    hospital: '병원 (파일참조)',
                                    result: data.status,
                                    nextCheck: nextCheckStr,
                                    bp: '-', sugar: '-', chol: '-', bmi: '-'
                                };
                                addHealthRecord(newHealthRecord);
                            }
                            alert('검진 결과가 성공적으로 업로드되었으며, 인사팀 리스트에 반영되었습니다.');
                            setIsResultModalOpen(false);
                        }}
                    />
                </>
            )}
        </Container>
    );
};
