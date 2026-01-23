
import React, { useState, useRef, useMemo } from 'react';
import { Bot, Pencil, UserCircle, Activity, Calendar, ChevronLeft, X, Mail, Hash, Briefcase, Building, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift, FileText, Upload, CheckCircle2, AlertCircle, Lock, HelpCircle, Camera, BellRing, ChevronRight, Download, CheckSquare, BrainCircuit, ArrowRight, Search, RotateCcw, Plus, Trash2, Users, Monitor, Link, AtSign, Grid } from 'lucide-react';

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

    // Task state within ProfileView (for adding)
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleTaskSubmit = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim() && onAddTask) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
            setIsAddingTask(false);
        }
    };

    // Image Update State
    const [imageModalState, setImageModalState] = useState({ isOpen: false, type: 'cover' });
    const fileInputRef = useRef(null);

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });



    // Health Upload State
    const [checkupDate, setCheckupDate] = useState(new Date().toISOString().split('T')[0]);
    const [healthStatus, setHealthStatus] = useState('정상 (양호)');
    const [uploadedFile, setUploadedFile] = useState(null);

    // Local History
    const [checkupHistory, setCheckupHistory] = useState([
        { id: 1, year: '2023', type: '일반 건강검진', date: '2023. 10. 15', result: '정상 (양호)' },
        { id: 2, year: '2022', type: '채용 건강검진', date: '2022. 01. 05', result: '정상 (경미)' },
    ]);

    // Helper for ISO Date calculation
    const getInitialDates = () => {
        const today = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        return {
            today: today.toISOString().split('T')[0],
            fiveYearsAgo: fiveYearsAgo.toISOString().split('T')[0]
        };
    };

    const initialDates = getInitialDates();

    // History Filter State - Initialized with 5 years range
    const [historyStartDate, setHistoryStartDate] = useState(initialDates.fiveYearsAgo);
    const [historyEndDate, setHistoryEndDate] = useState(initialDates.today);

    // Filtered History Logic
    const filteredHistory = useMemo(() => {
        return checkupHistory.filter(item => {
            if (!historyStartDate && !historyEndDate) return true;

            // Convert "2023. 10. 15" to "2023-10-15" for comparison
            const formattedDate = item.date.replace(/\. /g, '-').replace(/\.$/, '');

            if (historyStartDate && formattedDate < historyStartDate) return false;
            if (historyEndDate && formattedDate > historyEndDate) return false;

            return true;
        });
    }, [checkupHistory, historyStartDate, historyEndDate]);

    const handleChange = (field, value) => {
        onUpdateProfile({
            ...profile,
            [field]: value
        });
    };

    const handlePasswordChange = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
    };



    const handleHealthUpload = () => {
        if (!uploadedFile) {
            alert('검진 결과 PDF 파일을 업로드해주세요.');
            return;
        }
        if (!checkupDate) {
            alert('검진일을 선택해주세요.');
            return;
        }

        const newLocalRecord = {
            id: Date.now(),
            year: new Date(checkupDate).getFullYear().toString(),
            type: '정기 건강검진',
            date: checkupDate.replace(/-/g, '. '),
            result: healthStatus
        };
        setCheckupHistory([newLocalRecord, ...checkupHistory]);

        if (onAddHealthRecord) {
            const nextYear = new Date(checkupDate);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            const nextCheckStr = nextYear.toISOString().split('T')[0];

            const newHealthRecord = {
                id: Date.now(),
                name: profile.name,
                lastCheck: checkupDate,
                hospital: '병원 (파일참조)',
                result: healthStatus,
                nextCheck: nextCheckStr,
                bp: '-', sugar: '-', chol: '-', bmi: '-'
            };
            onAddHealthRecord(newHealthRecord);
        }

        alert('검진 결과가 성공적으로 업로드되었으며, 인사팀 리스트에 반영되었습니다.');
        setIsResultModalOpen(false);
        setUploadedFile(null);
        setHealthStatus('정상 (양호)');
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateProfile({ ...profile, avatarUrl: reader.result });
                setImageModalState({ ...imageModalState, isOpen: false });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverSelect = (url) => {
        onUpdateProfile({ ...profile, coverUrl: url });
        setImageModalState({ ...imageModalState, isOpen: false });
    };

    const tabs = (readOnly || isCreator) ? ['정보'] : ['정보', '건강'];
    const rejectedLogs = vacationLogs.filter(log => log.name === profile.name && log.status === '반려됨');

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white relative animate-[fadeIn_0.3s_ease-out]">
            {onBack && (
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={onBack}
                        className="bg-white/90 backdrop-blur text-gray-600 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                        <ChevronLeft size={14} /> 돌아가기
                    </button>
                </div>
            )}

            {!readOnly && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setImageModalState({ isOpen: true, type: 'cover' })}
                        className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 bg-white/80 backdrop-blur-sm flex items-center gap-1"
                    >
                        <Camera size={12} /> 커버 변경
                    </button>
                </div>
            )}

            <div
                className="h-48 bg-gray-50 w-full relative group cursor-pointer"
                onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'cover' })}
            >
                {profile.coverUrl ? (
                    <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
                )}
                {!readOnly && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera size={24} />
                    </div>
                )}
            </div>

            <div className="px-12 pb-20 max-w-[1600px] mx-auto">
                <div className="-mt-16 mb-6 relative z-10 inline-block group">
                    <div
                        className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm cursor-pointer relative"
                        onClick={() => !readOnly && setImageModalState({ isOpen: true, type: 'avatar' })}
                    >
                        <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        {!readOnly && (
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Camera size={20} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    </div>
                </div>



                {!isCreator && (
                    <div className="border-b border-gray-200 mb-8">
                        <div className="flex gap-6">
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm cursor-pointer transition-colors ${activeTab === tab
                                        ? 'font-bold text-black border-b-2 border-black'
                                        : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-10 min-h-[400px]">
                        {activeTab === '정보' && (
                            <>
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xs font-bold text-gray-400">기본 정보</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {isCreator ? (
                                            <>
                                                <div className="flex items-center">
                                                    <div className="w-6 text-gray-400 mr-4"><Users size={18} /></div>
                                                    <div className="w-32 text-sm text-gray-500 font-medium">구독자</div>
                                                    <div className="flex-1 text-sm font-bold text-gray-900">
                                                        {profile.subscribers}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-6 text-gray-400 mr-4"><Grid size={18} /></div>
                                                    <div className="w-32 text-sm text-gray-500 font-medium">카테고리</div>
                                                    <div className="flex-1 text-sm text-gray-900">
                                                        {profile.category}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-6 text-gray-400 mr-4"><Monitor size={18} /></div>
                                                    <div className="w-32 text-sm text-gray-500 font-medium">크리에이터 플랫폼</div>
                                                    <div className="flex-1 text-sm text-gray-900">
                                                        {profile.platform}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-6 text-gray-400 mr-4"><Link size={18} /></div>
                                                    <div className="w-32 text-sm text-gray-500 font-medium">매니저 이름</div>
                                                    <div className="flex-1 text-sm text-gray-900 font-medium">
                                                        {profile.manager}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-6 text-gray-400 mr-4"><AtSign size={18} /></div>
                                                    <div className="w-32 text-sm text-gray-500 font-medium">연락처</div>
                                                    <div className="flex-1 text-sm text-gray-800 flex items-center gap-4">
                                                        <span className="text-gray-400">이메일</span>
                                                        <span>{profile.email}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-start">
                                                    <div className="w-6 text-gray-400 mr-4 mt-0.5"><Building size={16} /></div>
                                                    <div className="w-16 text-sm text-gray-500 font-medium">조직</div>
                                                    <div className="flex-1 text-sm text-gray-800">
                                                        <span className="text-gray-400 mr-2">소속</span> {profile.org}
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="w-6 text-gray-400 mr-4 mt-0.5"><Briefcase size={16} /></div>
                                                    <div className="w-16 text-sm text-gray-500 font-medium">직무</div>
                                                    <div className="flex-1 text-sm text-gray-800">
                                                        <span className="text-gray-400 mr-2">수행 직무</span> {profile.job}
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="w-6 text-gray-400 mr-4 mt-0.5"><UserCircle size={16} /></div>
                                                    <div className="w-16 text-sm text-gray-500 font-medium">연락처</div>
                                                    <div className="flex-1 text-sm text-gray-800 space-y-2">
                                                        <div className="flex">
                                                            <span className="text-gray-400 inline-block w-20 shrink-0">이메일</span>
                                                            <span>{profile.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isCreator && !hideTasks && (
                                    <div className="mt-8 pt-8 border-t border-gray-100 animate-[fadeIn_0.2s_ease-out]">
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
                                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="flex items-center bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500">
                                                <div className="flex-1">이름</div>
                                                <div className="w-24">상태</div>
                                                <div className="w-24 text-right pr-2">관리</div>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {tasks.map(task => (
                                                    <div key={task.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer text-sm">
                                                        <div className="flex-1 text-gray-800 flex items-center gap-2">
                                                            <button
                                                                onClick={() => onToggleTask && onToggleTask(task.id)}
                                                                className={`${task.status === '완료됨' ? 'text-[#00C471]' : 'text-gray-300 hover:text-gray-500'}`}
                                                            >
                                                                <CheckSquare size={16} />
                                                            </button>
                                                            <span className={task.status === '완료됨' ? 'text-gray-400 line-through' : 'font-medium'}>
                                                                {task.title}
                                                            </span>
                                                        </div>
                                                        <div className="w-24">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${task.status === '진행중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                'bg-green-50 text-green-700 border-green-200'
                                                                }`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        <div className="w-24 flex items-center justify-end">
                                                            <button
                                                                onClick={() => onDeleteTask && onDeleteTask(task.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                title="업무 삭제"
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
                                )}

                                {!isCreator && (
                                    <div>
                                        <div className="flex justify-between items-start mb-4 border-t border-gray-100 pt-8">
                                            <h3 className="text-xs font-bold text-gray-400 mt-1">개인정보</h3>
                                            {!readOnly && (
                                                <div className="flex flex-col items-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditing(!isEditing)}
                                                        className={`flex items-center gap-1 text-xs hover:text-gray-600 transition-colors ${isEditing ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
                                                    >
                                                        <Pencil size={12} /> {isEditing ? '저장' : '정보 수정'}
                                                    </button>
                                                    <button
                                                        onClick={() => setIsPasswordModalOpen(true)}
                                                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <Lock size={12} /> 비밀번호 변경
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-5">
                                            {!readOnly && (
                                                <div className="flex items-start">
                                                    <div className="w-6 text-gray-400 mr-4"><UserCircle size={18} /></div>
                                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">이름</div>
                                                    <div className="flex-1 text-sm text-gray-800">
                                                        {isEditing ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                                                <div>
                                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">본명</label>
                                                                    <input
                                                                        value={profile.name}
                                                                        onChange={(e) => handleChange('name', e.target.value)}
                                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 font-medium">영문 이름</label>
                                                                    <input
                                                                        value={profile.engName}
                                                                        onChange={(e) => handleChange('engName', e.target.value)}
                                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-1 animate-[fadeIn_0.2s_ease-out]">
                                                                <span className="text-gray-400 mr-2">본명</span> {profile.name}
                                                                <span className="mx-3 text-gray-400 mr-2">영문 이름</span> {profile.engName}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-start">
                                                <div className="w-6 text-gray-400 mr-4 pt-1"><Mail size={16} /></div>
                                                <div className="w-16 text-sm text-gray-500 font-medium pt-1">연락처</div>
                                                <div className="flex-1 text-sm text-gray-800">
                                                    {isEditing && !readOnly ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                                            <div>
                                                                <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">개인 이메일</label>
                                                                <input
                                                                    value={profile.personalEmail}
                                                                    onChange={(e) => handleChange('personalEmail', e.target.value)}
                                                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 font-medium">휴대전화</label>
                                                                <input
                                                                    value={profile.phone}
                                                                    onChange={(e) => handleChange('phone', e.target.value)}
                                                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="py-1 animate-[fadeIn_0.2s_ease-out] space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 w-20 shrink-0">개인 이메일</span> {profile.personalEmail}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 w-20 shrink-0">휴대전화</span> {profile.phone}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!readOnly && (
                                                <div className="flex items-start">
                                                    <div className="w-6 text-gray-400 mr-4 pt-1"><Calendar size={16} /></div>
                                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">입사 정보</div>
                                                    <div className="flex-1 text-sm text-gray-800">
                                                        <div className="flex flex-wrap gap-y-2 py-1 animate-[fadeIn_0.2s_ease-out]">
                                                            <span className="text-gray-400 mr-2">입사일</span> {profile.joinDate}
                                                            <span className="ml-4 text-gray-400 mr-2">입사 유형</span> 경력
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === '건강' && !isCreator && (
                            <div className="space-y-8 animate-[fadeIn_0.2s_ease-in-out]">
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded inline-block mb-3">
                                                대상자 알림
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                <span className="text-blue-600">{profile.name}</span>님, <br />
                                                2024년 정기 건강검진 대상자입니다.
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                올해 12월 31일까지 일반 건강검진을 완료해야 합니다.<br />
                                                검진 후 결과를 업로드하여 DB에 저장해주세요.
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-1"
                                                    onClick={() => setIsResultModalOpen(true)}
                                                >
                                                    <Upload size={16} /> 결과 제출하기
                                                </button>
                                            </div>
                                        </div>
                                        <div className="hidden md:block p-4 bg-white/50 rounded-full border border-blue-100">
                                            <BellRing className="text-blue-500" size={48} />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                                </div>

                                <div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 px-1">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-500" /> 지난 검진 이력
                                        </h3>

                                        {/* Date Filter for Health History */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mr-1">기간</span>
                                                <input
                                                    type="date"
                                                    value={historyStartDate}
                                                    onChange={(e) => setHistoryStartDate(e.target.value)}
                                                    className="text-xs bg-transparent focus:outline-none cursor-pointer text-gray-600"
                                                />
                                                <ArrowRight size={14} className="text-gray-300 mx-1" />
                                                <input
                                                    type="date"
                                                    value={historyEndDate}
                                                    onChange={(e) => setHistoryEndDate(e.target.value)}
                                                    className="text-xs bg-transparent focus:outline-none cursor-pointer text-gray-600"
                                                />
                                                {(historyStartDate !== initialDates.fiveYearsAgo || historyEndDate !== initialDates.today) && (
                                                    <button
                                                        onClick={() => {
                                                            setHistoryStartDate(initialDates.fiveYearsAgo);
                                                            setHistoryEndDate(initialDates.today);
                                                        }}
                                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                                        title="필터 초기화"
                                                    >
                                                        <RotateCcw size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {filteredHistory.length > 0 ? filteredHistory.map((checkup, i) => (
                                            <div key={checkup.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow bg-white group">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-gray-900">{checkup.year}년 {checkup.type}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${checkup.result.includes('정상') || checkup.result.includes('양호') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                                                            {checkup.result}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        <span>{checkup.date}</span>
                                                    </div>
                                                </div>
                                                <button className="text-gray-300 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="결과지 다운로드">
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                                                <p className="text-sm text-gray-400">선택한 기간 내 검진 이력이 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[320px] space-y-4 shrink-0">
                        {!hideVacationWidget && !isCreator && (
                            <div className="bg-[#F9F9F9] rounded-xl p-5 border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm text-gray-800">휴가 사용 현황</h3>
                                    {!readOnly && (
                                        <button
                                            onClick={onOpenVacationModal}
                                            className="bg-white border border-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-50 shadow-sm"
                                        >
                                            휴가 신청
                                        </button>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-gray-900">12.5</span>
                                    <span className="text-sm text-gray-500 ml-1">일 남음</span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>연차</span>
                                            <span>2.5/15</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[16%]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>반차</span>
                                            <span>2회</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 w-[40%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {imageModalState.isOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setImageModalState({ ...imageModalState, isOpen: false })}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">
                                {imageModalState.type === 'cover' ? '커버 이미지 변경' : '프로필 사진 변경'}
                            </h3>
                            <button onClick={() => setImageModalState({ ...imageModalState, isOpen: false })} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            {imageModalState.type === 'cover' ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {MOCK_COVER_IMAGES.map((url, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleCoverSelect(url)}
                                            className="aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all hover:opacity-90"
                                        >
                                            <img src={url} alt={`Cover ${i}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden mb-6 bg-gray-50">
                                        <img src={profile.avatarUrl} alt="Current" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={16} /> 사진 업로드
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                    />
                                    <p className="text-xs text-gray-400 mt-3">JPG, PNG 파일 (최대 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">비밀번호 변경</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">현재 비밀번호</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="현재 비밀번호 입력"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">새 비밀번호</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="새 비밀번호 입력"
                                    value={passwordForm.new}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">새 비밀번호 확인</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="새 비밀번호 재입력"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                            <button onClick={handlePasswordChange} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
                                변경하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isResultModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsResultModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">검진 결과 등록</h3>
                            <button onClick={() => setIsResultModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                <FileText size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-800 text-sm">결과지 업로드 안내</h4>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                        병원에서 발급받은 건강검진 결과표(PDF)를 업로드하여 DB에 저장합니다.<br />
                                        인사/운영팀 건강 관리 리스트에 자동 업데이트 됩니다.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">최근 검진일</label>
                                    <input
                                        type="date"
                                        value={checkupDate}
                                        onChange={(e) => setCheckupDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">종합 판정 상태 선택</label>
                                    <select
                                        value={healthStatus}
                                        onChange={(e) => setHealthStatus(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                    >
                                        <option value="정상 (양호)">정상 (A/B) - 양호</option>
                                        <option value="정상 (경미)">정상 (B) - 경미한 소견</option>
                                        <option value="유소견 (주의)">주의 (식생활 습관 개선 필요)</option>
                                        <option value="유소견 (위험)">위험 (질환 의심/치료 필요)</option>
                                        <option value="재검">재검 필요</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">결과 파일 업로드</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                            <Upload size={24} />
                                        </div>
                                        {uploadedFile ? (
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{uploadedFile.name}</p>
                                                <p className="text-xs text-green-600 mt-1">파일이 선택되었습니다.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm font-bold text-gray-700">PDF 파일을 드래그하거나 클릭하여 업로드</p>
                                                <p className="text-xs text-gray-400 mt-1">최대 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button onClick={() => setIsResultModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                            <button onClick={handleHealthUpload} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm flex items-center gap-1">
                                <CheckCircle2 size={14} /> 저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
