import React, { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';

const PlatformOption = ({ platform, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`
          cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all
          ${selected ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
       `}
    >
        <div className="mb-2">{renderPlatformIcon(platform, 24)}</div>
        <span className={`text-xs font-medium ${selected ? 'text-black' : 'text-gray-500'}`}>
            {platform === 'Chzzk' ? '치지직' : platform}
        </span>
    </div>
);

export const CreatorModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    employees
}) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        name: '',
        platform: 'YouTube',
        subscribers: '',
        category: '',
        status: '대기중',
        avatarUrl: '',
        contactInfo: '',
        loginId: '',
        password: '',
        managerName: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                platform: initialData.platform,
                subscribers: initialData.subscribers,
                category: initialData.category || '',
                status: (initialData.status === '계약만료' || initialData.status === '종료') ? '대기중' : initialData.status,
                avatarUrl: initialData.avatarUrl,
                contactInfo: initialData.contactInfo || '',
                loginId: initialData.loginId || '',
                password: initialData.password || '',
                managerName: initialData.manager && initialData.manager !== '담당자 없음' ? initialData.manager : ''
            });
        } else {
            setFormData({
                name: '',
                platform: 'YouTube',
                subscribers: '',
                category: '',
                status: '대기중',
                avatarUrl: '',
                contactInfo: '',
                loginId: '',
                password: '',
                managerName: ''
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        if (!formData.name || !formData.platform || !formData.subscribers || !formData.category || !formData.contactInfo || !formData.password) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        onSave(formData, isEdit);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">
                        {isEdit ? '크리에이터 정보 수정' : '새 크리에이터 등록 (Admin)'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Essential Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">기본 정보 (필수)</h4>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">이름</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="크리에이터 이름 입력"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">플랫폼</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['YouTube', 'Twitch', 'Chzzk', 'Instagram', 'TikTok'].map((p) => (
                                        <PlatformOption
                                            key={p}
                                            platform={p}
                                            selected={formData.platform === p}
                                            onClick={() => setFormData({ ...formData, platform: p })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">구독자 수</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="예: 10.5만명"
                                        value={formData.subscribers}
                                        onChange={e => setFormData({ ...formData, subscribers: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">카테고리</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="예: 게임, 먹방"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">기본 연락망</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="전화번호 또는 이메일"
                                    value={formData.contactInfo}
                                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Right Column: Account & Optional */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2 flex items-center gap-1">
                                    <Lock size={12} /> 계정 정보 (필수)
                                </h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">로그인 ID</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="영문 소문자 권장"
                                        value={formData.loginId}
                                        onChange={e => setFormData({ ...formData, loginId: e.target.value })}
                                        disabled={isEdit}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">비밀번호</label>
                                    <input
                                        type="password"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="비밀번호 입력"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">운영 정보</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">담당 매니저 배정</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                        value={formData.managerName}
                                        onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                                    >
                                        <option value="">담당자 없음 (미배정)</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-[10px] text-gray-500 leading-relaxed">
                                        * 프로필 사진과 커버 이미지는 크리에이터 본인이 마이페이지에서 직접 관리합니다. 관리자 및 직원은 수정할 수 없습니다.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">상태</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="대기중">대기중</option>
                                        <option value="활동중">활동중</option>
                                        <option value="휴식중">휴식중</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        {isEdit ? '수정 완료' : '추가하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
