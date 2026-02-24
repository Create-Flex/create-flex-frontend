import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ProfileInfo } from './profile/ProfileInfo';
import { HealthSection } from './profile/HealthSection';
import { CreatorTodoBoard } from '../../creator-todo/ui/CreatorTodoBoard';
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

import { useAuthStore } from '../../auth/model/useAuthStore';
import { vacationService } from '../../vacation/api/vacationService';
import { creatorService } from '../../creator/api/creatorService';
import { useUserStore } from '../model/useUserStore';
import { useHealthStore } from '../../health/model/useHealthStore';
import { useVacationStore } from '../../vacation/model/useVacationStore';
import { useUIStore } from '../../../shared/model/useUIStore';
import { UserRole } from '../../../shared/constants/enums';
import { getMyHealth, postMyHealth, putMyHealth } from '../../health/api/healthService';
import { authService } from '../../auth/api/authService';

export const ProfileView = ({
    profile, 
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
    const { openVacationModal, openPhqModal } = useUIStore();

    // Determine which profile to show
    const displayProfile = profile || userProfile;

    // Local States
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('정보');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Image Update State
    const [imageModalState, setImageModalState] = useState({ isOpen: false, type: 'cover' });

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Edit Profile Modal State
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    // Health Upload State
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
    const [healthList, setHealthList] = useState([]);
    const [healthCheck, setHealthCheck] = useState();

    const isCurrentUser = user && String(displayProfile?.employeeId) === String(user.id);

    // Check if this profile view is for a Creator
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
                        email: data.creator_main_contact
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

    const fetchHealth = async () => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 2);

        const toLocalDateString = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const startDate = toLocalDateString(oneYearAgo);
        const endDate = toLocalDateString(today);

        try {
            const { data } = await getMyHealth(startDate, endDate);
            setHealthList(data.healthInfoList);
            setHealthCheck(data.haveHealthChecked);
        } catch (err) {
            console.error('Health 조회 실패', err);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const canUpdate = !readOnly && isCurrentUser;

    if (!displayProfile) {
        return null;
    }

    const tabs = (readOnly || isCreatorProfile) ? ['정보'] : ['정보', '건강'];
    const userVacationLogs = vacationLogs.filter(log => log.name === displayProfile.name);

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
                            {/*
                            {tabs.map((tab) => (
                                <TabItem
                                    key={tab}
                                    $active={activeTab === tab}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </TabItem>
                            ))}
                                */}
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

                            {isCreatorProfile && !hideTasks && displayProfile?.employeeId && (
                                <CreatorTodoBoard creatorId={String(displayProfile.employeeId)} />
                            )}
                        </>)}

                        {activeTab === '건강' && !isCreatorProfile && (
                            <HealthSection
                                profile={displayProfile}
                                healthList={healthList}
                                onUpdateHealthList={(newList) => { setHealthList(newList); }}
                                healthCheck={healthCheck}
                                onUpdateHealthCheck={(newBoolean) => { setHealthCheck(newBoolean); }}
                                onOpenResultModal={() => setIsResultModalOpen(true)}
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
                        onUpload={async (data) => {
                            try {
                                const response = await postMyHealth(data);
                                const presignedUrl = response.data.presignedUrl;
                                const file = data.get("file");

                                await putMyHealth(file, presignedUrl);
                                fetchHealth();

                                toast.success('검진 결과가 성공적으로 업로드되었으며, 인사팀 리스트에 반영되었습니다.');
                                setIsResultModalOpen(false);
                            } catch (error) {
                                console.error("업데이트 실패 : ", error);
                                toast.error('업로드 실패');
                            }
                        }}
                    />
                </>
            )}

            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                profile={displayProfile}
                onSave={async (data) => {
                    const response = await authService.updateMyInfo(data);
                    const updatedProfile = {
                        ...displayProfile,
                        name: data.memberName,
                        engName: data.engName,
                        address: data.address,
                        personalEmail: data.personalEmail,
                        phone: data.personalCall
                    };
                    updateProfile(updatedProfile);
                    toast.success('정보가 성공적으로 수정되었습니다.');
                }}
            />

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