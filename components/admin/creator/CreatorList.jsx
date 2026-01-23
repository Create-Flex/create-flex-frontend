import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, User, MoreHorizontal, Edit3, Trash2, Link as LinkIcon } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';

export const CreatorList = ({
    creators,
    onOpenAddModal,
    onOpenEditModal,
    onDeleteCreator
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuRef = useRef(null);

    const filteredCreators = creators.filter(c =>
        c.name.includes(searchQuery) ||
        c.channelName?.includes(searchQuery)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="크리에이터 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md w-64 focus:outline-none focus:border-gray-400 bg-gray-50/50"
                        />
                    </div>
                    <div className="h-4 w-px bg-gray-300 mx-2"></div>
                    <span className="text-xs text-gray-500 font-medium">총 {creators.length}명</span>
                </div>
                <button onClick={onOpenAddModal} className="flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors">
                    <Plus size={16} /> 등록
                </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-visible bg-white min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500">크리에이터</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500">채널 정보</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500">연락처</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500">담당 매니저</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCreators.map(creator => (
                            <tr
                                key={creator.id}
                                className="hover:bg-gray-50 transition-colors group cursor-pointer relative"
                                onClick={() => onOpenEditModal(creator)}
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" /> : <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><User size={20} /></div>}
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{creator.name}</div>
                                            <div className="text-[10px] text-gray-400">ID: {creator.loginId || creator.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        {renderPlatformIcon(creator.platform, 12)}
                                        <span className="text-sm text-gray-700">{creator.channelName}</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400">구독자 {creator.subscribers}</div>
                                </td>
                                <td className="px-4 py-4">
                                    {creator.contactInfo ? (
                                        <span className="text-xs text-gray-600 font-medium">
                                            {creator.contactInfo}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-between group/manager">
                                        <div>
                                            <div className="text-sm text-gray-800">{creator.manager}</div>
                                            {creator.manager && creator.manager !== '담당자 없음' ? (
                                                <div className="text-[10px] text-[#00C471] flex items-center gap-0.5 mt-0.5">
                                                    <LinkIcon size={8} />
                                                    <span>연결됨</span>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-gray-400 mt-0.5">미배정</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {creator.status === '활동중' && <span className="text-xs font-bold text-[#00C471]">활동중</span>}
                                    {creator.status === '대기중' && <span className="text-xs font-bold text-gray-500">대기중</span>}
                                    {creator.status === '종료' && <span className="text-xs font-bold text-red-500">종료</span>}
                                    {creator.status === '휴식중' && <span className="text-xs font-bold text-yellow-600">휴식중</span>}
                                </td>
                                <td className="px-4 py-4 text-center relative" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => setActiveMenuId(activeMenuId === creator.id ? null : creator.id)}
                                        className={`text-gray-400 hover:bg-gray-200 p-1 rounded transition-colors ${activeMenuId === creator.id ? 'bg-gray-200 text-gray-600' : ''}`}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                    {activeMenuId === creator.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-[fadeIn_0.1s]"
                                        >
                                            <button
                                                onClick={() => onOpenEditModal(creator)}
                                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Edit3 size={12} /> 정보 수정
                                            </button>
                                            <button
                                                onClick={() => onDeleteCreator && onDeleteCreator(creator.id)}
                                                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Trash2 size={12} /> 삭제
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
