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

// Mock DB for Cover Images
const MOCK_COVER_IMAGES = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
];

export const ProfileView = ({
    profile,
    onUpdateProfile,
    readOnly = false,
    onBack,
    vacationLogs = [],
    onAddHealthRecord,
    isCreator = false,
    hideVacationWidget = false,
    tasks = [],
    onOpenPhqModal,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    hideTasks = false,
    onOpenVacationModal
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('정보');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Task state within ProfileView (for adding) logic moved to TaskSection

    // Image Update State
    const [imageModalState, setImageModalState] = useState({ isOpen: false, type: 'cover' });

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Health Upload State
    // Local History (Data source)
    const [checkupHistory, setCheckupHistory] = useState([
        { id: 1, year: '2023', type: '일반 건강검진', date: '2023. 10. 15', result: '정상 (양호)' },
        { id: 2, year: '2022', type: '채용 건강검진', date: '2022. 01. 05', result: '정상 (경미)' },
    ]);

    const tabs = (readOnly || isCreator) ? ['정보'] : ['정보', '건강'];
    const rejectedLogs = vacationLogs.filter(log => log.name === profile.name && log.status === '반려됨');

    return (
        <Container>
            {onBack && (
                <BackButtonWrapper>
                    <HeaderButton onClick={onBack}>
                        <ChevronLeft size={14} /> 돌아가기
                    </HeaderButton>
                </BackButtonWrapper>
            )}

            {!readOnly && (
                <CoverButtonWrapper>
                    <CoverUpdateBtn onClick={() => setImageModalState({ isOpen: true, type: 'cover' })}>
                        <Camera size={12} /> 커버 변경
                    </CoverUpdateBtn>
                </CoverButtonWrapper>
            )}

            <CoverImageContainer onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'cover' })}>
                {profile.coverUrl ? (
                    <CoverImage src={profile.coverUrl} alt="Cover" />
                ) : (
                    <PlaceholderCover />
                )}
                {!readOnly && (
                    <CoverOverlay className="overlay">
                        <Camera size={24} />
                    </CoverOverlay>
                )}
            </CoverImageContainer>

            <ContentContainer>
                <AvatarContainer>
                    <AvatarWrapper className="group" onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'avatar' })}>
                        <AvatarImage src={profile.avatarUrl} alt="Profile" />
                        {!readOnly && (
                            <CoverOverlay className="overlay">
                                <Camera size={20} />
                            </CoverOverlay>
                        )}
                    </AvatarWrapper>
                </AvatarContainer>

                <NameSection>
                    <NameTitle>{profile.name}</NameTitle>
                </NameSection>

                {!isCreator && (
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
                                profile={profile}
                                isCreator={isCreator}
                                readOnly={readOnly}
                                onUpdateProfile={onUpdateProfile}
                                onPasswordChangeClick={() => setIsPasswordModalOpen(true)}
                            />

                            {isCreator && !hideTasks && (
                                <TaskSection
                                    tasks={tasks}
                                    onAddTask={onAddTask}
                                    onToggleTask={onToggleTask}
                                    onDeleteTask={onDeleteTask}
                                />
                            )}
                        </>)}

                        {activeTab === '건강' && !isCreator && (
                            <HealthSection
                                profile={profile}
                                checkupHistory={checkupHistory}
                                onOpenResultModal={() => setIsResultModalOpen(true)}
                            />
                        )}
                    </MainContent>

                    <SideWidget>
                        {!hideVacationWidget && !isCreator && (
                            <VacationWidget>
                                <WidgetHeader>
                                    <WidgetTitle>휴가 사용 현황</WidgetTitle>
                                    {!readOnly && (
                                        <SmallButton onClick={onOpenVacationModal}>
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

            <ImageUploadModal
                isOpen={imageModalState.isOpen}
                onClose={() => setImageModalState({ ...imageModalState, isOpen: false })}
                type={imageModalState.type}
                currentImage={imageModalState.type === 'cover' ? profile.coverUrl : profile.avatarUrl}
                onImageSelect={(url) => {
                    onUpdateProfile({ ...profile, coverUrl: url });
                    setImageModalState({ ...imageModalState, isOpen: false });
                }}
                onImageUpload={(result) => {
                    onUpdateProfile({ ...profile, avatarUrl: result });
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

                    if (onAddHealthRecord) {
                        const nextYear = new Date(data.date);
                        nextYear.setFullYear(nextYear.getFullYear() + 1);
                        const nextCheckStr = nextYear.toISOString().split('T')[0];

                        const newHealthRecord = {
                            id: Date.now(),
                            name: profile.name,
                            lastCheck: data.date,
                            hospital: '병원 (파일참조)',
                            result: data.status,
                            nextCheck: nextCheckStr,
                            bp: '-', sugar: '-', chol: '-', bmi: '-'
                        };
                        onAddHealthRecord(newHealthRecord);
                    }
                    alert('검진 결과가 성공적으로 업로드되었으며, 인사팀 리스트에 반영되었습니다.');
                    setIsResultModalOpen(false);
                }}
            />
        </Container>
    );
};
