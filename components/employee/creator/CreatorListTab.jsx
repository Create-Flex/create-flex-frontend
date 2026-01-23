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
        <div className="bg-white relative animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 p-1.5 -ml-1.5 pr-3 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-all group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium">목록으로 돌아가기</span>
                </button>
            </div>

            <div className="relative mb-12">
                <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden shadow-sm">
                    {creator.coverUrl ? (
                        <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-300 flex flex-col items-center">
                            <ImageIcon size={32} />
                            <span className="text-xs mt-2">커버 이미지 없음</span>
                        </div>
                    )}
                </div>

                <div className="absolute -bottom-10 left-8 z-10">
                    <div className="w-24 h-24 rounded-lg border-4 border-white shadow-md overflow-hidden bg-white">
                        {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-5 flex items-center justify-center text-gray-400">
                                <UserIcon size={40} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pl-36 mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><Monitor size={14} /> {creator.platform}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Users size={14} /> {creator.subscribers}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className={`text-xs font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                            {creator.status}
                        </span>
                        {creator.contactInfo && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-500 flex items-center gap-1"><Smartphone size={12} /> {creator.contactInfo}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-200 w-full mb-8"></div>

            <div className="animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <CheckSquare size={20} className="text-gray-700" />
                        업무 현황
                        <span className="text-sm font-normal text-gray-500 ml-1">({tasks.length})</span>
                    </h3>
                    <div className="flex gap-4 text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            진행중 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '진행중').length}</span>
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            완료됨 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '완료됨').length}</span>
                        </span>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex items-center bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500">
                        <div className="flex-1">이름</div>
                        <div className="w-24">상태</div>
                        <div className="w-24">담당자</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {tasks.map(task => (
                            <div key={task.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer text-sm">
                                <div className="flex-1 text-gray-800 flex items-center gap-2">
                                    <button
                                        onClick={() => onToggleTask(task.id)}
                                        className={`${task.status === '완료됨' ? 'text-[#00C471]' : 'text-gray-300 hover:text-gray-500'}`}
                                    >
                                        <CheckSquare size={16} />
                                    </button>
                                    <span className={task.status === '완료됨' ? 'text-gray-400 line-through' : ''}>
                                        {task.title}
                                    </span>
                                </div>
                                <div className="w-24">
                                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${task.status === '진행중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="w-24 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[9px] font-bold">
                                            {task.assignee.charAt(0)}
                                        </div>
                                        <span className="text-gray-600 text-xs">{task.assignee}</span>
                                    </div>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="삭제"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!isAddingTask ? (
                            <div
                                onClick={() => setIsAddingTask(true)}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-gray-400 text-sm group"
                            >
                                <Plus size={14} className="mr-2 group-hover:text-gray-600" />
                                <span className="group-hover:text-gray-600">새로 만들기...</span>
                            </div>
                        ) : (
                            <div className="flex items-center px-4 py-3 bg-gray-50/50">
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="text-gray-400"><CheckSquare size={16} /></div>
                                    <input
                                        autoFocus
                                        className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="업무 내용을 입력하고 Enter를 누르세요"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={handleTaskSubmit}
                                        onBlur={() => {
                                            if (!newTaskTitle.trim()) setIsAddingTask(false);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
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
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myCreators.map(creator => (
                    <div
                        key={creator.id}
                        onClick={() => setSelectedCreatorId(creator.id)}
                        className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white relative"
                    >
                        <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                            {creator.coverUrl ? (
                                <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-300">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                        </div>
                        <div className="p-5 relative">
                            <div className="w-16 h-16 rounded-lg border-4 border-white shadow-sm overflow-hidden absolute -top-10 left-5 bg-white">
                                {creator.avatarUrl ? (
                                    <img src={creator.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-5 flex items-center justify-center text-gray-400">
                                        <UserIcon size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    {creator.name}
                                    {renderPlatformIcon(creator.platform, 16)}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">{creator.subscribers}</p>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                                        {creator.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
