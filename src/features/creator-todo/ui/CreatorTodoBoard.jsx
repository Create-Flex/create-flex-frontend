import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../../auth/model/useAuthStore';
import { creatorTodoService } from '../api/creatorTodoService';
import {
    BoardContainer, BoardHeader, BoardTitle, BoardCount,
    ColumnsWrapper, Column, ColumnHeader, ColumnTitle, ColumnDot, ColumnCount, DropZone,
    TodoCard, TodoContent, TodoMeta, TodoAuthor, TodoActions, ActionButton,
    AddTodoButton, AddTodoInput, AddTodoTextarea, AddTodoActions, AddConfirmButton,
    EditInput, LoadingContainer
} from './CreatorTodoBoard.styled';

const COLUMN_COLORS = {
    '할 일': '#3b82f6',
    '진행 중': '#f59e0b',
    '완료': '#22c55e',
};

// position 계산: 컬럼 내 마지막 아이템 뒤에 배치
const getNewPosition = (todos) => {
    if (!todos || todos.length === 0) return 1.0;
    const maxPos = Math.max(...todos.map(t => t.position || 0));
    return maxPos + 1.0;
};

// 드래그 후 새 position 계산
const calcPosition = (todos, destIndex) => {
    if (todos.length === 0) return 1.0;
    if (destIndex === 0) {
        return (todos[0]?.position || 1.0) / 2;
    }
    if (destIndex >= todos.length) {
        return (todos[todos.length - 1]?.position || 0) + 1.0;
    }
    const before = todos[destIndex - 1]?.position || 0;
    const after = todos[destIndex]?.position || before + 2;
    return (before + after) / 2;
};

export const CreatorTodoBoard = ({ creatorId }) => {
    const { token, user } = useAuthStore();
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingColumnId, setAddingColumnId] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const stompClient = useRef(null);
    const clientUuid = useRef(crypto.randomUUID());
    const handleWsMessageRef = useRef(null);
    const columnsRef = useRef([]);
    columnsRef.current = columns; // 항상 최신 columns 유지 (stale closure 방지)

    // 초기 데이터 로딩 (silent=true 이면 로딩 스피너 없이 갱신)
    const fetchBoard = useCallback(async (silent = false) => {
        if (!creatorId) return;
        try {
            if (!silent) setIsLoading(true);
            const data = await creatorTodoService.getBoard(creatorId);
            // sequence 순 정렬, 각 컬럼 내 todo는 position 순
            const sorted = (data || [])
                .sort((a, b) => a.sequence - b.sequence)
                .map(col => ({
                    ...col,
                    todos: (col.todos || []).sort((a, b) => a.position - b.position),
                }));
            setColumns(sorted);
        } catch (error) {
            console.error('칸반 보드 조회 실패:', error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [creatorId]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

    // WebSocket 연결
    useEffect(() => {
        if (!token || !creatorId) return;

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
        const client = new Client({
            webSocketFactory: () => new SockJS(`${baseUrl}/ws-stomp`),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: () => { },
            onConnect: () => {
                client.subscribe(`/sub/creator-todo/${creatorId}`, (message) => {
                    const payload = JSON.parse(message.body);
                    // ref를 통해 항상 최신 핸들러 호출
                    handleWsMessageRef.current?.(payload);
                });
            },
            onStompError: (frame) => {
                console.error('Todo STOMP 에러:', frame.headers['message']);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (client) client.deactivate();
        };
    }, [token, creatorId]);

    // WebSocket 메시지 핸들러
    const handleWsMessage = useCallback((payload) => {
        const { type, clientUuid: senderUuid } = payload;

        // 내가 보낸 메시지는 무시 (이미 낙관적 업데이트 완료)
        if (senderUuid === clientUuid.current) return;

        switch (type) {
            case 'MOVE_SUCCESS': {
                const todoId = Number(payload.todoId);
                const destColId = Number(payload.columnId); // 백엔드 필드명: columnId
                const newPosition = Number(payload.newPosition);

                setColumns(prev => {
                    let movedTodo = null;
                    // 기존 컬럼에서 해당 todo 제거
                    const withoutTodo = prev.map(col => {
                        const todo = col.todos.find(t => Number(t.id) === todoId);
                        if (todo) {
                            movedTodo = { ...todo, columnId: destColId, position: newPosition };
                            return { ...col, todos: col.todos.filter(t => Number(t.id) !== todoId) };
                        }
                        return col;
                    });
                    if (!movedTodo) return prev;
                    // 목적지 컬럼에 삽입 후 position 순 정렬
                    return withoutTodo.map(col => {
                        if (col.id !== destColId) return col;
                        const newTodos = [...col.todos, movedTodo].sort((a, b) => a.position - b.position);
                        return { ...col, todos: newTodos };
                    });
                });
                break;
            }
            case 'TODO_CREATED': {
                const todo = payload;
                setColumns(prev => prev.map(col => {
                    if (col.id !== todo.columnId) return col;
                    // 이미 존재하면 무시
                    if (col.todos.some(t => t.id === todo.id)) return col;
                    const newTodos = [...col.todos, todo].sort((a, b) => a.position - b.position);
                    return { ...col, todos: newTodos };
                }));
                break;
            }
            case 'TODO_UPDATED': {
                const numTodoId = Number(payload.todoId);
                const { content } = payload;
                setColumns(prev => prev.map(col => ({
                    ...col,
                    todos: col.todos.map(t => Number(t.id) === numTodoId ? { ...t, content } : t),
                })));
                break;
            }
            case 'TODO_DELETED': {
                const numTodoId = Number(payload.todoId);
                setColumns(prev => prev.map(col => ({
                    ...col,
                    todos: col.todos.filter(t => Number(t.id) !== numTodoId),
                })));
                break;
            }
            case 'ERROR': {
                // 롤백: 서버에서 에러 시 전체 데이터 재조회
                toast.error('동기화 오류가 발생했습니다. 새로고침합니다.');
                fetchBoard();
                break;
            }
            default:
                break;
        }
    }, [fetchBoard]);

    // 항상 최신 핸들러를 ref에 유지
    handleWsMessageRef.current = handleWsMessage;

    // 드래그 앤 드롭 핸들러
    const onDragEnd = useCallback((result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColId = parseInt(source.droppableId);
        const destColId = parseInt(destination.droppableId);

        // columnsRef에서 실제 todo 객체를 찾아서 id 사용 (임시 ID 문제 방지)
        const sourceCol = columnsRef.current.find(c => c.id === sourceColId);
        const movedTodo = sourceCol?.todos[source.index];

        if (!movedTodo || !movedTodo.id) {
            console.warn('Invalid todo for drag:', movedTodo);
            return;
        }

        const todoId = movedTodo.id;

        // 낙관적 업데이트
        setColumns(prev => {
            const updated = prev.map(col => ({
                ...col,
                todos: [...col.todos],
            }));

            const sourceCol = updated.find(c => c.id === sourceColId);
            const destCol = updated.find(c => c.id === destColId);
            if (!sourceCol || !destCol) return prev;

            const [movedTodo] = sourceCol.todos.splice(source.index, 1);
            if (!movedTodo) return prev;

            const newPosition = calcPosition(destCol.todos, destination.index);
            movedTodo.position = newPosition;
            movedTodo.columnId = destColId;
            destCol.todos.splice(destination.index, 0, movedTodo);

            return updated;
        });

        // WebSocket 발행 (임시 ID가 아닌 경우에만)
        // 임시 ID는 13자리 이상 (Date.now()로 생성)
        const isTempId = String(todoId).length >= 13;
        if (stompClient.current?.connected && !isTempId) {
            const destColTodos = columnsRef.current.find(c => c.id === destColId)?.todos.filter(t => t.id !== todoId) || [];
            stompClient.current.publish({
                destination: '/pub/todo/move',
                body: JSON.stringify({
                    todoId,
                    targetColumnId: destColId,
                    newPosition: calcPosition(destColTodos, destination.index),
                    creatorId,
                    clientUuid: clientUuid.current,
                }),
            });
        }
    }, [creatorId]);

    // Todo 추가
    const handleAddTodo = async (columnId) => {
        if (!newContent.trim()) return;
        const content = newContent.trim();
        setNewContent('');
        setAddingColumnId(null);

        // 낙관적 추가
        const tempId = Date.now();
        const col = columns.find(c => c.id === columnId);
        const tempTodo = {
            id: tempId,
            columnId,
            content,
            position: getNewPosition(col?.todos),
            createdBy: user?.memberId || user?.id,
            createdByName: user?.memberName || user?.name || '',
            createdAt: new Date().toISOString(),
        };
        setColumns(prev => prev.map(c => {
            if (c.id !== columnId) return c;
            return { ...c, todos: [...c.todos, tempTodo] };
        }));

        try {
            const created = await creatorTodoService.createTodo({ creatorId, columnId, content });
            // 임시 ID를 실제 ID로 교체
            setColumns(prev => prev.map(c => ({
                ...c,
                todos: c.todos.map(t => t.id === tempId ? { ...t, ...created } : t),
            })));
            // WebSocket 발행
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: '/pub/todo/create',
                    body: JSON.stringify({
                        creatorId,
                        todoId: created.id,
                        columnId,
                        content,
                        clientUuid: clientUuid.current,
                    }),
                });
            }
        } catch (error) {
            console.error('Todo 생성 실패:', error);
            toast.error('할 일 추가에 실패했습니다.');
            // 롤백
            setColumns(prev => prev.map(c => ({
                ...c,
                todos: c.todos.filter(t => t.id !== tempId),
            })));
        }
    };

    // Todo 수정
    const handleUpdateTodo = async (todoId) => {
        if (!editContent.trim()) return;
        const content = editContent.trim();
        const prevContent = columns.flatMap(c => c.todos).find(t => t.id === todoId)?.content;

        // 낙관적 업데이트
        setColumns(prev => prev.map(c => ({
            ...c,
            todos: c.todos.map(t => t.id === todoId ? { ...t, content } : t),
        })));
        setEditingTodoId(null);
        setEditContent('');

        try {
            await creatorTodoService.updateTodo({ todoId, content });
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: '/pub/todo/update',
                    body: JSON.stringify({ creatorId, todoId, content, clientUuid: clientUuid.current }),
                });
            }
        } catch (error) {
            console.error('Todo 수정 실패:', error);
            toast.error('수정에 실패했습니다.');
            // 롤백
            setColumns(prev => prev.map(c => ({
                ...c,
                todos: c.todos.map(t => t.id === todoId ? { ...t, content: prevContent } : t),
            })));
        }
    };

    // Todo 삭제
    const handleDeleteTodo = async (todoId) => {
        // 낙관적 삭제
        const backup = columns;
        setColumns(prev => prev.map(c => ({
            ...c,
            todos: c.todos.filter(t => t.id !== todoId),
        })));

        try {
            await creatorTodoService.deleteTodo(todoId);
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: '/pub/todo/delete',
                    body: JSON.stringify({ creatorId, todoId, clientUuid: clientUuid.current }),
                });
            }
        } catch (error) {
            console.error('Todo 삭제 실패:', error);
            toast.error('삭제에 실패했습니다.');
            setColumns(backup);
        }
    };

    const totalCount = columns.reduce((acc, col) => acc + (col.todos?.length || 0), 0);

    if (isLoading) {
        return <LoadingContainer>칸반 보드를 불러오는 중...</LoadingContainer>;
    }

    return (
        <BoardContainer>
            <BoardHeader>
                <BoardTitle>
                    <ClipboardList size={20} style={{ color: '#374151' }} />
                    할일 목록
                    <BoardCount>({totalCount})</BoardCount>
                </BoardTitle>
            </BoardHeader>

            <DragDropContext onDragEnd={onDragEnd}>
                <ColumnsWrapper>
                    {columns.map(col => (
                        <Column key={col.id}>
                            <ColumnHeader>
                                <ColumnTitle>
                                    <ColumnDot $color={COLUMN_COLORS[col.title] || '#9ca3af'} />
                                    {col.title}
                                </ColumnTitle>
                                <ColumnCount>{col.todos?.length || 0}</ColumnCount>
                            </ColumnHeader>

                            <Droppable droppableId={String(col.id)}>
                                {(provided, snapshot) => (
                                    <DropZone
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        $isDraggingOver={snapshot.isDraggingOver}
                                    >
                                        {col.todos.map((todo, index) => (
                                            <Draggable
                                                key={todo.id}
                                                draggableId={String(todo.id)}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <TodoCard
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        $isDragging={snapshot.isDragging}
                                                    >
                                                        {editingTodoId === todo.id ? (
                                                            <EditInput
                                                                autoFocus
                                                                rows={2}
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleUpdateTodo(todo.id);
                                                                    }
                                                                    if (e.key === 'Escape') {
                                                                        setEditingTodoId(null);
                                                                        setEditContent('');
                                                                    }
                                                                }}
                                                                onBlur={() => handleUpdateTodo(todo.id)}
                                                            />
                                                        ) : (
                                                            <>
                                                                <TodoContent>{todo.content}</TodoContent>
                                                                <TodoMeta>
                                                                    <TodoAuthor>{todo.createdByName || ''}</TodoAuthor>
                                                                    <TodoActions>
                                                                        <ActionButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingTodoId(todo.id);
                                                                                setEditContent(todo.content);
                                                                            }}
                                                                        >
                                                                            <Pencil size={12} />
                                                                        </ActionButton>
                                                                        <ActionButton
                                                                            $danger
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteTodo(todo.id);
                                                                            }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </ActionButton>
                                                                    </TodoActions>
                                                                </TodoMeta>
                                                            </>
                                                        )}
                                                    </TodoCard>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {addingColumnId === col.id ? (
                                            <AddTodoInput>
                                                <AddTodoTextarea
                                                    autoFocus
                                                    rows={2}
                                                    placeholder="할 일을 입력하세요"
                                                    value={newContent}
                                                    onChange={(e) => setNewContent(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleAddTodo(col.id);
                                                        }
                                                        if (e.key === 'Escape') {
                                                            setAddingColumnId(null);
                                                            setNewContent('');
                                                        }
                                                    }}
                                                />
                                                <AddTodoActions>
                                                    <AddConfirmButton onClick={() => { setAddingColumnId(null); setNewContent(''); }}>
                                                        취소
                                                    </AddConfirmButton>
                                                    <AddConfirmButton $primary onClick={() => handleAddTodo(col.id)}>
                                                        추가
                                                    </AddConfirmButton>
                                                </AddTodoActions>
                                            </AddTodoInput>
                                        ) : (
                                            <AddTodoButton onClick={() => { setAddingColumnId(col.id); setNewContent(''); }}>
                                                <Plus size={14} /> 새로 만들기
                                            </AddTodoButton>
                                        )}
                                    </DropZone>
                                )}
                            </Droppable>
                        </Column>
                    ))}
                </ColumnsWrapper>
            </DragDropContext>
        </BoardContainer>
    );
};
