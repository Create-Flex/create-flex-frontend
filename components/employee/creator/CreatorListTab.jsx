import React, { useState, useEffect } from 'react';
import {
    Users,
    User as UserIcon,
    ImageIcon,
    Monitor,
    Smartphone,
    ChevronLeft,
    CheckSquare,
    Plus,
    Trash2,
} from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';
import { creatorService } from '../../../api/creatorService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { mapCreatorFromBackend } from '../../../utils/creatorMapper';
import {
    Container, DetailHeader, BackButton, BackText, CoverSection, CoverImageWrapper, CoverImg, EmptyCover, EmptyCoverText,
    AvatarSection, AvatarWrapper, AvatarImg, EmptyAvatar, InfoSection, CreatorName, MetaInfo, MetaItem, DotSeparator, StatusBadge, Divider,
    TaskSection, TaskHeader, TaskTitle, TaskCount, TaskLegend, LegendItem, LegendDot, LegendValue,
    TaskList, ListHeader, ListHeaderItem, ListBody, TaskItem, TaskContent, CheckButton, TaskText, TaskStatus, StatusTag,
    TaskAssignee, AssigneeInfo, AssigneeAvatar, AssigneeName, DeleteButton, AddTaskRow, AddTaskInputWrapper, AddTaskInput,
    CreatorGrid, CreatorCard, CardCover, CardOverlay, CardContent, CardAvatar, CardInfo, CardName, CardSubscribers, CardStatus, CardStatusBadge
} from './CreatorListTab.styled';

const CreatorDetailView = ({
    creator,
    tasks,
    events,
    onBack,
    onAddEvent,
    onEventClick,
    onAddTask,
    onToggleTask,
    onDeleteTask,
}) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleTaskSubmit = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
        }
    };

    return (
        <Container $bgWhite>
            <DetailHeader>
                <BackButton onClick={onBack}>
                    <ChevronLeft size={20} />
                    <BackText>목록으로 돌아가기</BackText>
                </BackButton>
            </DetailHeader>

            <CoverSection>
                <CoverImageWrapper>
                    {creator.coverUrl || creator.bannerUrl ? (
                        <CoverImg src={creator.coverUrl || creator.bannerUrl} alt="cover" />
                    ) : (
                        <EmptyCover>
                            <ImageIcon size={32} />
                            <EmptyCoverText>커버 이미지 없음</EmptyCoverText>
                        </EmptyCover>
                    )}
                </CoverImageWrapper>

                <AvatarSection>
                    <AvatarWrapper>
                        {creator.avatarUrl ? (
                            <AvatarImg src={creator.avatarUrl} alt="profile" />
                        ) : (
                            <EmptyAvatar>
                                <UserIcon size={40} />
                            </EmptyAvatar>
                        )}
                    </AvatarWrapper>
                </AvatarSection>
            </CoverSection>

            <InfoSection>
                <div>
                    <CreatorName>{creator.name}</CreatorName>
                    <MetaInfo>
                        <MetaItem><Monitor size={14} /> {creator.platform}</MetaItem>
                        <DotSeparator />
                        <MetaItem><Users size={14} /> {creator.subscribers}</MetaItem>
                        <DotSeparator />
                        <StatusBadge $active={creator.status === '활동중'}>
                            {creator.status}
                        </StatusBadge>
                        {creator.contactInfo && (
                            <>
                                <DotSeparator />
                                <MetaItem><Smartphone size={12} /> {creator.contactInfo}</MetaItem>
                            </>
                        )}
                    </MetaInfo>
                </div>
            </InfoSection>

            <Divider />

            <TaskSection>
                <TaskHeader>
                    <TaskTitle>
                        <CheckSquare size={20} className="text-gray-700" style={{ color: '#374151' }} />
                        업무 현황
                        <TaskCount>({tasks.length})</TaskCount>
                    </TaskTitle>
                    <TaskLegend>
                        <LegendItem>
                            <LegendDot $color="#facc15" />
                            진행중 <LegendValue>{tasks.filter(t => t.status === '진행중').length}</LegendValue>
                        </LegendItem>
                        <LegendItem>
                            <LegendDot $color="#22c55e" />
                            완료됨 <LegendValue>{tasks.filter(t => t.status === '완료됨').length}</LegendValue>
                        </LegendItem>
                    </TaskLegend>
                </TaskHeader>

                <TaskList>
                    <ListHeader>
                        <ListHeaderItem $flex>이름</ListHeaderItem>
                        <ListHeaderItem $width="6rem">상태</ListHeaderItem>
                        <ListHeaderItem $width="6rem">담당자</ListHeaderItem>
                    </ListHeader>
                    <ListBody>
                        {tasks.map(task => (
                            <TaskItem key={task.id}>
                                <TaskContent>
                                    <CheckButton
                                        onClick={() => onToggleTask(task.id)}
                                        $completed={task.status === '완료됨'}
                                    >
                                        <CheckSquare size={16} />
                                    </CheckButton>
                                    <TaskText $completed={task.status === '완료됨'}>
                                        {task.title}
                                    </TaskText>
                                </TaskContent>
                                <TaskStatus>
                                    <StatusTag $status={task.status}>
                                        {task.status}
                                    </StatusTag>
                                </TaskStatus>
                                <TaskAssignee>
                                    <AssigneeInfo>
                                        <AssigneeAvatar>
                                            {task.assignee.charAt(0)}
                                        </AssigneeAvatar>
                                        <AssigneeName>{task.assignee}</AssigneeName>
                                    </AssigneeInfo>
                                    <DeleteButton
                                        onClick={() => onDeleteTask(task.id)}
                                        title="삭제"
                                    >
                                        <Trash2 size={14} />
                                    </DeleteButton>
                                </TaskAssignee>
                            </TaskItem>
                        ))}

                        {!isAddingTask ? (
                            <AddTaskRow onClick={() => setIsAddingTask(true)}>
                                <Plus size={14} style={{ marginRight: '0.5rem' }} />
                                <span>새로 만들기...</span>
                            </AddTaskRow>
                        ) : (
                            <AddTaskRow $isEditing>
                                <AddTaskInputWrapper>
                                    <div style={{ color: '#9ca3af' }}><CheckSquare size={16} /></div>
                                    <AddTaskInput
                                        autoFocus
                                        placeholder="업무 내용을 입력하고 Enter를 누르세요"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={handleTaskSubmit}
                                        onBlur={() => {
                                            if (!newTaskTitle.trim()) setIsAddingTask(false);
                                        }}
                                    />
                                </AddTaskInputWrapper>
                            </AddTaskRow>
                        )}
                    </ListBody>
                </TaskList>
            </TaskSection>
        </Container>
    );
};

export const CreatorListTab = ({
    onAddEvent,
    onEventClick,
    onAddTask,
    onToggleTask,
    onDeleteTask,
}) => {
    const { user } = useAuthStore();
    const [myCreators, setMyCreators] = useState([]);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allTasks] = useState([]); // 업무 데이터 (추후 구현)
    const [events] = useState([]); // 이벤트 데이터 (추후 구현)

    // 백엔드에서 담당 크리에이터 목록 불러오기
    useEffect(() => {
        const fetchMyCreators = async () => {
            if (!user || !user.id) {
                setError('로그인 정보가 없습니다.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                console.log('매니저 ID:', user.id);
                
                // 백엔드 API 호출: GET /api/creators/manager/{managerId}
                const response = await creatorService.getMyCreators(user.id);
                
                console.log('백엔드 응답 (담당 크리에이터):', response);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                const formattedCreators = response.map(mapCreatorFromBackend);
                
                console.log('변환된 크리에이터 데이터:', formattedCreators);
                
                setMyCreators(formattedCreators);
            } catch (err) {
                console.error('담당 크리에이터 조회 실패:', err);
                
                if (err.response?.status === 404) {
                    setError('매니저 정보를 찾을 수 없습니다.');
                } else if (err.response?.status === 403) {
                    setError('크리에이터 목록 조회 권한이 없습니다.');
                } else {
                    setError(err.response?.data?.message || '크리에이터 목록을 불러오는데 실패했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyCreators();
    }, [user]);

    // 로딩 중 표시
    if (isLoading) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '16px',
                    color: '#6b7280'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <div>담당 크리에이터 목록을 불러오는 중...</div>
                    </div>
                </div>
            </Container>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    gap: '16px'
                }}>
                    <div style={{ fontSize: '48px' }}>⚠️</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '600' }}>
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </Container>
        );
    }

    // 담당 크리에이터가 없는 경우
    if (myCreators.length === 0) {
        return (
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '64px' }}>📋</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#374151' }}>
                        담당 크리에이터가 없습니다
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                        관리자에게 문의하여 크리에이터를 배정받으세요.
                    </div>
                </div>
            </Container>
        );
    }

    const selectedCreator = myCreators.find(c => c.id === selectedCreatorId);

    // 크리에이터 상세 보기
    if (selectedCreator) {
        return (
            <CreatorDetailView
                creator={selectedCreator}
                tasks={allTasks.filter(t => t.creatorId === selectedCreator.id)}
                events={events.filter(e => e.creatorId === selectedCreator.id)}
                onBack={() => setSelectedCreatorId(null)}
                onAddEvent={onAddEvent}
                onEventClick={onEventClick}
                onAddTask={(title) => onAddTask(title, selectedCreator.id)}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
            />
        );
    }

    // 크리에이터 목록 그리드 표시
    return (
        <Container>
            {/* 크리에이터 카드 그리드 */}
            <CreatorGrid>
                {myCreators.map(creator => (
                    <CreatorCard
                        key={creator.id}
                        onClick={() => setSelectedCreatorId(creator.id)}
                    >
                        <CardCover>
                            {creator.coverUrl || creator.bannerUrl ? (
                                <CoverImg src={creator.coverUrl || creator.bannerUrl} alt="cover" />
                            ) : (
                                <EmptyCover>
                                    <ImageIcon size={32} />
                                </EmptyCover>
                            )}
                            <CardOverlay />
                        </CardCover>
                        <CardContent>
                            <CardAvatar>
                                {creator.avatarUrl ? (
                                    <AvatarImg src={creator.avatarUrl} alt="avatar" />
                                ) : (
                                    <UserIcon size={32} />
                                )}
                            </CardAvatar>
                            <CardInfo>
                                <CardName>
                                    {creator.name}
                                    {renderPlatformIcon(creator.platform, 16)}
                                </CardName>
                                <CardSubscribers>{creator.subscribers}</CardSubscribers>
                                <CardStatus>
                                    <CardStatusBadge $active={creator.status === '활동중'}>
                                        {creator.status}
                                    </CardStatusBadge>
                                </CardStatus>
                            </CardInfo>
                        </CardContent>
                    </CreatorCard>
                ))}
            </CreatorGrid>
        </Container>
    );
};