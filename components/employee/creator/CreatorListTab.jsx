import React, { useState } from 'react';
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
                    {creator.coverUrl ? (
                        <CoverImg src={creator.coverUrl} alt="cover" />
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
    selectedCreatorId,
    setSelectedCreatorId,
    myCreators,
    allTasks,
    events,
    onAddEvent,
    onEventClick,
    onAddTask,
    onToggleTask,
    onDeleteTask,
}) => {
    const selectedCreator = myCreators.find(c => c.id === selectedCreatorId);

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

    return (
        <Container>
            <CreatorGrid>
                {myCreators.map(creator => (
                    <CreatorCard
                        key={creator.id}
                        onClick={() => setSelectedCreatorId(creator.id)}
                    >
                        <CardCover>
                            {creator.coverUrl ? (
                                <CoverImg src={creator.coverUrl} alt="cover" />
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
