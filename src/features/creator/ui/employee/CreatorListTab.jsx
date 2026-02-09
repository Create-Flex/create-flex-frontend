import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
import { renderPlatformIcon } from '../components/shared/utils';
import { creatorService } from '../../api/creatorService';
import { useAuthStore } from '../../../auth/model/useAuthStore';
import { mapCreatorFromBackend } from '../../../../shared/utils/creatorMapper';
import {
    Container, DetailHeader, BackButton, BackText, CoverSection, CoverImageWrapper, CoverImg, EmptyCover, EmptyCoverText,
    AvatarSection, AvatarWrapper, AvatarImg, EmptyAvatar, InfoSection, CreatorName, MetaInfo, MetaItem, DotSeparator, StatusBadge, Divider,
    TaskSection, TaskHeader, TaskTitle, TaskCount, TaskLegend, LegendItem, LegendDot, LegendValue,
    TaskList, ListHeader, ListHeaderItem, ListBody, TaskItem, TaskContent, CheckButton, TaskText, TaskStatus, StatusTag,
    TaskAssignee, AssigneeName, DeleteButton, AddTaskRow, AddTaskInputWrapper, AddTaskInput,
    CreatorGrid, CreatorCard, CardCover, CardOverlay, CardContent, CardAvatar, CardInfo, CardName, CardSubscribers, CardStatus, CardStatusBadge
} from './CreatorListTab.styled';

// 백엔드 상태를 프론트엔드 형식으로 변환
const mapWorkStatusToFrontend = (backendStatus) => {
    return backendStatus === 'DONE' ? '완료됨' : '진행중';
};

// 프론트엔드 상태를 백엔드 형식으로 변환
const mapWorkStatusToBackend = (frontendStatus) => {
    return frontendStatus === '완료됨' ? 'WORKING' : 'DONE'; // 토글이므로 반대로
};

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
    isTaskLoading,
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
                        <ListHeaderItem $width="6rem">작성자</ListHeaderItem>
                    </ListHeader>
                    <ListBody>
                        {isTaskLoading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                업무 목록을 불러오는 중...
                            </div>
                        ) : tasks.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                                등록된 업무가 없습니다.
                            </div>
                        ) : (
                            tasks.map(task => (
                                <TaskItem key={task.id}>
                                    <TaskContent>
                                        <CheckButton
                                            onClick={() => onToggleTask(task.id, task.status)}
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
                                        <AssigneeName>{task.assignee || '-'}</AssigneeName>
                                        <DeleteButton
                                            onClick={() => onDeleteTask(task.id)}
                                            title="삭제"
                                        >
                                            <Trash2 size={14} />
                                        </DeleteButton>
                                    </TaskAssignee>
                                </TaskItem>
                            ))
                        )}

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
}) => {
    const { user } = useAuthStore();
    const [myCreators, setMyCreators] = useState([]);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]); // 업무 데이터 (백엔드 연동)
    const [isTaskLoading, setIsTaskLoading] = useState(false);
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

    // 크리에이터 선택 시 업무 목록 조회
    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedCreatorId) {
                setTasks([]);
                return;
            }

            try {
                setIsTaskLoading(true);
                const response = await creatorService.getCreatorWorks(selectedCreatorId);

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                const formattedTasks = (response || []).map(work => ({
                    id: work.creatorWorkId,
                    title: work.workName,
                    status: mapWorkStatusToFrontend(work.workStatus),
                    assignee: work.workerName,
                    creatorId: selectedCreatorId
                }));

                setTasks(formattedTasks);
            } catch (err) {
                console.error('크리에이터 업무 목록 조회 실패:', err);
                setTasks([]);
            } finally {
                setIsTaskLoading(false);
            }
        };

        fetchTasks();
    }, [selectedCreatorId]);

    // 업무 추가 핸들러
    const handleAddTask = async (title) => {
        if (!selectedCreatorId || !title.trim()) return;

        try {
            const response = await creatorService.createCreatorWork(selectedCreatorId, title.trim());

            // 새 업무를 목록에 추가
            const newTask = {
                id: response.creatorWorkId,
                title: response.workName,
                status: mapWorkStatusToFrontend(response.workStatus),
                assignee: response.workerName,
                creatorId: selectedCreatorId
            };

            setTasks(prev => [...prev, newTask]);
        } catch (err) {
            console.error('업무 추가 실패:', err);
            toast.error('업무 추가에 실패했습니다.');
        }
    };

    // 업무 상태 토글 핸들러
    const handleToggleTask = async (taskId, currentStatus) => {
        if (!selectedCreatorId) return;

        try {
            const newStatus = mapWorkStatusToBackend(currentStatus);
            const response = await creatorService.updateCreatorWorkStatus(selectedCreatorId, taskId, newStatus);

            // 목록에서 해당 업무 상태 업데이트
            setTasks(prev => prev.map(task =>
                task.id === taskId
                    ? { ...task, status: mapWorkStatusToFrontend(response.workStatus) }
                    : task
            ));
        } catch (err) {
            console.error('업무 상태 변경 실패:', err);
            toast.error('업무 상태 변경에 실패했습니다.');
        }
    };

    // 업무 삭제 핸들러
    const handleDeleteTask = async (taskId) => {
        if (!selectedCreatorId) return;

        if (!window.confirm('이 업무를 삭제하시겠습니까?')) return;

        try {
            await creatorService.deleteCreatorWork(selectedCreatorId, taskId);

            // 목록에서 해당 업무 제거
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err) {
            console.error('업무 삭제 실패:', err);
            toast.error('업무 삭제에 실패했습니다.');
        }
    };

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
                tasks={tasks}
                events={events.filter(e => e.creatorId === selectedCreator.id)}
                onBack={() => setSelectedCreatorId(null)}
                onAddEvent={onAddEvent}
                onEventClick={onEventClick}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                isTaskLoading={isTaskLoading}
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