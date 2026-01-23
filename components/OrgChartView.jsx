import React, { useState } from 'react';
import { Search, Phone, Building, Users, ChevronRight, X, User, Plus, Edit3, Trash2 } from 'lucide-react';
import { UserRole } from '../enums';

// Color Palette for Departments
const DEPT_COLORS = [
    { label: 'Slate', value: 'bg-slate-800' },
    { label: 'Blue', value: 'bg-blue-600' },
    { label: 'Emerald', value: 'bg-emerald-500' },
    { label: 'Purple', value: 'bg-purple-500' },
    { label: 'Orange', value: 'bg-orange-500' },
    { label: 'Indigo', value: 'bg-indigo-600' },
    { label: 'Rose', value: 'bg-rose-500' },
    { label: 'Cyan', value: 'bg-cyan-600' },
    { label: 'Gray', value: 'bg-gray-600' },
    { label: 'Teal', value: 'bg-teal-600' },
];

export const OrgChartView = ({ user, departments, employees, onUpdateDepartments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState(null);

    // Admin Management State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingDeptId, setEditingDeptId] = useState(null);
    const [deptForm, setDeptForm] = useState({
        name: '',
        description: '',
        phone: '',
        color: 'bg-slate-800'
    });

    const isAdmin = user?.role === UserRole.ADMIN;

    // 검색 필터링 (부서명 검색)
    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 선택된 부서의 멤버 필터링
    const getDeptMembers = (deptName) => {
        // Filter employees by department name
        // Note: Employee interface has 'dept' field which corresponds to Department 'name'
        return employees.filter(emp => emp.dept === deptName);
    };

    const handleOpenAdd = () => {
        setModalMode('add');
        setDeptForm({ name: '', description: '', phone: '', color: 'bg-slate-800' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dept, e) => {
        e.stopPropagation();
        setModalMode('edit');
        setEditingDeptId(dept.id);
        setDeptForm({
            name: dept.name,
            description: dept.description,
            phone: dept.phone,
            color: dept.color
        });
        setIsModalOpen(true);
    };

    const handleDeleteDepartment = (id) => {
        if (window.confirm('부서를 삭제하시겠습니까?')) {
            onUpdateDepartments(departments.filter(d => d.id !== id));
            setSelectedDept(null);
        }
    };

    const handleSave = () => {
        if (!deptForm.name) return alert('조직 이름을 입력해주세요.');

        if (modalMode === 'add') {
            const newId = `Dept-${Date.now()}`;
            const newDept = {
                id: newId,
                ...deptForm
            };
            onUpdateDepartments([...departments, newDept]);
        } else if (modalMode === 'edit' && editingDeptId) {
            onUpdateDepartments(departments.map(d => d.id === editingDeptId ? { ...d, ...deptForm } : d));
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Building className="text-gray-800" size={32} /> 회사 조직도
                        </h1>
                        <p className="text-sm text-gray-500">
                            부서별 연락처 및 구성원을 확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative group">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                            <input
                                type="text"
                                placeholder="부서명 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                            />
                        </div>

                        {isAdmin && (
                            <button
                                onClick={handleOpenAdd}
                                className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={16} /> 조직 추가
                            </button>
                        )}
                    </div>
                </div>

                {/* Department Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-[fadeIn_0.2s_ease-out]">
                    {filteredDepartments.map((dept) => {
                        const memberCount = getDeptMembers(dept.name).length;

                        return (
                            <div
                                key={dept.id}
                                onClick={() => setSelectedDept(dept)}
                                className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full relative"
                            >
                                {/* Color Bar */}
                                <div className={`h-2 w-full ${dept.color}`}></div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl bg-gray-50 text-gray-700 group-hover:bg-gray-100 transition-colors`}>
                                            <Building size={24} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">
                                                <Users size={12} />
                                                <span>{memberCount}명</span>
                                            </div>
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => handleOpenEdit(dept, e)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="수정"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                                    <p className="text-xs text-gray-500 mb-6 line-clamp-2 flex-1">{dept.description}</p>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} className="text-gray-400" />
                                            <span className="font-mono">{dept.phone}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Member List Modal */}
            {selectedDept && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedDept(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className={`px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50`}>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {selectedDept.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Phone size={12} /> {selectedDept.phone}</span>
                                    <span className="w-px h-3 bg-gray-300"></span>
                                    <span>총 {getDeptMembers(selectedDept.name).length}명</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDept(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body (List) */}
                        <div className="overflow-y-auto p-6 flex-1">
                            {getDeptMembers(selectedDept.name).length > 0 ? (
                                <div className="space-y-3">
                                    {getDeptMembers(selectedDept.name).map(member => (
                                        <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors bg-white shadow-sm">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="text-gray-400" size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-gray-900">{member.name}</span>
                                                    <span className="text-xs text-gray-400">({member.engName})</span>
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium">{member.role}</div>
                                            </div>
                                            <div>
                                                {member.workStatus === '출근' && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">출근</span>}
                                                {member.workStatus === '퇴근' && <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded">퇴근</span>}
                                                {member.workStatus === '휴가' && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">휴가</span>}
                                                {member.workStatus === '병가' && <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded">병가</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                    <Users size={40} className="mb-2 opacity-50" />
                                    <p className="text-sm">소속된 부서원이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Delete Button) */}
                        {isAdmin && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => handleDeleteDepartment(selectedDept.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors"
                                >
                                    <Trash2 size={16} /> 부서 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">{modalMode === 'add' ? '새 조직 추가' : '조직 정보 수정'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">조직 이름</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                    placeholder="예: 마케팅팀 (Marketing)"
                                    value={deptForm.name}
                                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">조직 설명</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black h-20 resize-none"
                                    placeholder="조직의 역할과 업무에 대해 설명해주세요."
                                    value={deptForm.description}
                                    onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">대표 전화번호</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                                    placeholder="예: 02-1234-5678"
                                    value={deptForm.phone}
                                    onChange={e => setDeptForm({ ...deptForm, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">테마 색상</label>
                                <div className="flex flex-wrap gap-2">
                                    {DEPT_COLORS.map((c) => (
                                        <button
                                            key={c.value}
                                            onClick={() => setDeptForm({ ...deptForm, color: c.value })}
                                            className={`w-6 h-6 rounded-full ${c.value} border-2 ${deptForm.color === c.value ? 'border-black scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">취소</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-sm transition-colors">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
