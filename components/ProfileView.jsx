import React, { useState, useEffect } from 'react';
import { ProfileInfo } from './profile/ProfileInfo';
import { TaskSection } from './profile/TaskSection';
import { HealthSection } from './profile/HealthSection';
import { ImageUploadModal } from './profile/modals/ImageUploadModal';
import { PasswordChangeModal } from './profile/modals/PasswordChangeModal';
import { HealthResultModal } from './profile/modals/HealthResultModal';
import { EditProfileModal } from './modals/EditProfileModal';
import { ChangePasswordModal } from './modals/ChangePasswordModal';
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
import { vacationService } from '../api/vacationService';
import { creatorService } from '../api/creatorService';
import { useUserStore } from '../stores/useUserStore';
import { useHealthStore } from '../stores/useHealthStore';
import { useVacationStore } from '../stores/useVacationStore';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useUIStore } from '../stores/useUIStore';
import { UserRole } from '../enums';
import { authService } from '../api/authService';

export const ProfileView = ({
    profile, // Optional prop for viewing other profiles
    readOnly = false,
    onBack,
    hideVacationWidget = false,
    hideTasks = false
}) => {
    // Hooks from stores
    const { user } = useAuthStore();
    const { userProfile, updateProfile } = useUserStore();
    const { addEmployeeHealthRecord: addHealthRecord } = useHealthStore();
    const { vacationLogs } = useVacationStore();
    const { allTasks, addTask, toggleTask, deleteTask } = useScheduleStore();
    const { openVacationModal, openPhqModal } = useUIStore();

    // Determine which profile to show
    const displayProfile = profile || userProfile;

    // Local States - must be declared before any conditional returns
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('정보');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Image Update State
    const [imageModalState, setImageModalState] = useState({ isOpen: false, type: 'cover' });

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Edit Profile Modal State
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    // Health Upload State - Mock Data source maintained locally for view history display
    const [checkupHistory, setCheckupHistory] = useState([
        { id: 1, year: '2023', type: '일반 건강검진', date: '2023. 10. 15', result: '정상 (양호)' },
        { id: 2, year: '2022', type: '채용 건강검진', date: '2022. 01. 05', result: '정상 (경미)' },
    ]);

    // 잔여 연차 상태
    const [vacationStats, setVacationStats] = useState({
        total: 15,
        used: 0,
        remaining: 15
    });

    const [creatorInfo, setCreatorInfo] = useState(null);

    const isCurrentUser = user && String(displayProfile?.employeeId) === String(user.id);

    // Check if this profile view is for a Creator
    // Logic: If user is creator, or if the displayed profile has job='Creator'
    const isCreatorProfile = displayProfile?.job === 'Creator' || displayProfile?.rank === 'Creator' || displayProfile?.role === 'CREATOR';

    // 크리에이터 정보 조회
    useEffect(() => {
        const fetchCreatorInfo = async () => {
            if (isCreatorProfile && displayProfile.employeeId) {
                try {
                    const data = await creatorService.getCreatorById(displayProfile.employeeId);
                    setCreatorInfo({
                        subscribers: data.creator_subscribe,
                        category: data.creator_category,
                        platform: data.creator_platform,
                        manager: data.manager_name,
                        email: data.creator_main_contact // 연락처(이메일)
                    });
                } catch (error) {
                    console.error('크리에이터 정보 조회 실패:', error);
                }
            }
        };
        fetchCreatorInfo();
    }, [isCreatorProfile, displayProfile?.employeeId]);

    // 잔여 연차 조회
    useEffect(() => {
        const fetchVacationRemainder = async () => {
            if (!displayProfile) return;
            // 크리에이터는 연차 기능이 없으므로 API 호출 안함
            const isCreator = user?.role === 'CREATOR' || user?.memberRole === 'CREATOR' || displayProfile.role === 'CREATOR' || isCreatorProfile;
            if (!displayProfile.employeeId || isCreator) return;
            try {
                const response = await vacationService.getMyVacationRemainder(displayProfile.employeeId);
                setVacationStats({
                    total: response.totalVacation || 15,
                    used: response.usedVacation || 0,
                    remaining: response.vacationRemainder || 15
                });
            } catch (error) {
                console.error('잔여 연차 조회 에러:', error);
            }
        };
        fetchVacationRemainder();
    }, [displayProfile?.employeeId, isCreatorProfile]);

    // Validation: Only allow updates if it's the current user's profile and not readOnly
    const canUpdate = !readOnly && isCurrentUser;

    // 프로필 데이터가 없으면 렌더링 안함 (App.jsx에서 로딩 처리) - AFTER all hooks
    if (!displayProfile) {
        return null;
    }

    // Derived Data
    const tabs = (readOnly || isCreatorProfile) ? ['정보'] : ['정보', '건강'];
    // Filter vacation logs for displayed user
    const userVacationLogs = vacationLogs.filter(log => log.name === displayProfile.name);

    // Creator Tasks (filter by displayed user ID if creator)
    const creatorTasks = isCreatorProfile && displayProfile.employeeId ? allTasks.filter(t => t.creatorId === displayProfile.employeeId) : [];

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
                                profile={{ ...displayProfile, ...creatorInfo }}
                                isCreator={isCreatorProfile}
                                readOnly={readOnly || !canUpdate}
                                onUpdateProfile={canUpdate ? updateProfile : undefined}
                                onPasswordChangeClick={() => setIsPasswordModalOpen(true)}
                                onEditProfileClick={() => setIsEditProfileModalOpen(true)}
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
                                    <WidgetTitle>잔여 연차</WidgetTitle>
                                </WidgetHeader>
                                <DaysRemaining>
                                    <DaysNumber>{vacationStats.remaining}</DaysNumber>
                                    <DaysText>일</DaysText>
                                </DaysRemaining>

                                <UsageBarContainer>
                                    <UsageItem>
                                        <UsageHeader>
                                            <span>사용 연차 {vacationStats.used} / {vacationStats.total}</span>
                                            <span>{vacationStats.total > 0 ? Math.round((vacationStats.used / vacationStats.total) * 100) : 0}%</span>
                                        </UsageHeader>
                                        <ProgressBarBg>
                                            <ProgressBarFill $width={`${vacationStats.total > 0 ? (vacationStats.used / vacationStats.total) * 100 : 0}%`} $color="#3b82f6" />
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

            {/* 정보 수정 모달 */}
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                profile={displayProfile}
                onSave={async (data) => {
                    const response = await authService.updateMyInfo(data);
                    // 프로필 업데이트
                    const updatedProfile = {
                        ...displayProfile,
                        name: data.memberName,
                        engName: data.engName,
                        address: data.address,
                        personalEmail: data.personalEmail,
                        phone: data.personalCall
                    };
                    updateProfile(updatedProfile);
                    alert('정보가 성공적으로 수정되었습니다.');
                }}
            />

            {/* 비밀번호 변경 모달 */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSave={async (currentPassword, newPassword) => {
                    await authService.changePassword(currentPassword, newPassword);
                }}
            />
        </Container>
    );
};