import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export const AssignManagerModal = ({
    isOpen,
    onClose,
    onSave,
    creatorId,
    employees
}) => {
    const [managerName, setManagerName] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">담당 매니저 배정</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4">
                        선택한 크리에이터를 담당할 매니저를 선택해주세요.
                    </div>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                        value={managerName}
                        onChange={e => setManagerName(e.target.value)}
                    >
                        <option value="">담당자 없음 (미배정)</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept}/{emp.role})</option>
                        ))}
                    </select>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                    <button onClick={() => onSave(creatorId, managerName)} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-1">
                        <Check size={14} /> 저장
                    </button>
                </div>
            </div>
        </div>
    );
};
