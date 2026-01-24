import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import {
    TaskSectionWrapper, TaskHeader, TaskTitle, TaskCount, TaskLegend, TaskLegendItem,
    TaskLegendDot, LegendCount, TaskListContainer, TaskListHeader, HeaderItem,
    TaskListBody, TaskItem, TaskItemWrapper, TaskItemContent, TaskToggleBtn, TaskText,
    TaskStatusWrapper, TaskStatusBadge, TaskActionWrapper, TaskDeleteBtn,
    AddTaskBtn, AddTaskInputContainer, InputWrapper, InputIcon, AddTaskInput
} from './TaskSection.styled';

export const TaskSection = ({
    tasks = [],
    onAddTask,
    onToggleTask,
    onDeleteTask
}) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleTaskSubmit = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim() && onAddTask) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
            setIsAddingTask(false);
        }
    };

    const handleBlur = () => {
        if (!newTaskTitle.trim()) {
            setIsAddingTask(false);
        }
    };

    return (
        <TaskSectionWrapper>
            <TaskHeader>
                <TaskTitle>
                    <CheckSquare size={20} className="text-gray-700" style={{ color: '#374151' }} />
                    업무 현황
                    <TaskCount>({tasks.length})</TaskCount>
                </TaskTitle>
                <TaskLegend>
                    <TaskLegendItem>
                        <TaskLegendDot $color="#facc15" />
                        진행중 <LegendCount>{tasks.filter(t => t.status === '진행중').length}</LegendCount>
                    </TaskLegendItem>
                    <TaskLegendItem>
                        <TaskLegendDot $color="#22c55e" />
                        완료됨 <LegendCount>{tasks.filter(t => t.status === '완료됨').length}</LegendCount>
                    </TaskLegendItem>
                </TaskLegend>
            </TaskHeader>

            <TaskListContainer>
                <TaskListHeader>
                    <HeaderItem $flex>이름</HeaderItem>
                    <HeaderItem $width="6rem">상태</HeaderItem> {/* w-24 is 6rem */}
                    <HeaderItem $width="6rem" $align="right">관리</HeaderItem>
                </TaskListHeader>
                <TaskListBody>
                    {tasks.map(task => (
                        <TaskItem key={task.id}>
                            <TaskItemWrapper style={{ width: '100%' }}>
                                <TaskItemContent>
                                    <TaskToggleBtn
                                        $completed={task.status === '완료됨'}
                                        onClick={() => onToggleTask && onToggleTask(task.id)}
                                    >
                                        <CheckSquare size={16} />
                                    </TaskToggleBtn>
                                    <TaskText $completed={task.status === '완료됨'}>
                                        {task.title}
                                    </TaskText>
                                </TaskItemContent>
                                <TaskStatusWrapper>
                                    <TaskStatusBadge $status={task.status}>
                                        {task.status}
                                    </TaskStatusBadge>
                                </TaskStatusWrapper>
                                <TaskActionWrapper>
                                    <TaskDeleteBtn
                                        onClick={() => onDeleteTask && onDeleteTask(task.id)}
                                        title="업무 삭제"
                                    >
                                        <Trash2 size={14} />
                                    </TaskDeleteBtn>
                                </TaskActionWrapper>
                            </TaskItemWrapper>
                        </TaskItem>
                    ))}

                    {!isAddingTask ? (
                        <AddTaskBtn onClick={() => setIsAddingTask(true)}>
                            <Plus size={14} />
                            <span>새로 만들기...</span>
                        </AddTaskBtn>
                    ) : (
                        <AddTaskInputContainer>
                            <InputWrapper>
                                <InputIcon><CheckSquare size={16} /></InputIcon>
                                <AddTaskInput
                                    autoFocus
                                    placeholder="업무 내용을 입력하고 Enter를 누르세요"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={handleTaskSubmit}
                                    onBlur={handleBlur}
                                />
                            </InputWrapper>
                        </AddTaskInputContainer>
                    )}
                </TaskListBody>
            </TaskListContainer>
        </TaskSectionWrapper>
    );
};
