import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Lock, Home, Mail, Phone, Users, Clock, UserPlus, X, AlertCircle, UserCheck, Calendar, ChevronDown } from 'lucide-react';

export const StaffManagement = ({ employees, onUpdateEmployees, vacationLogs, departments }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalType, setModalType] = useState('none');
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [resignationReason, setResignationReason] = useState('');

    // Default department is the first one in the list, or empty if none exist
    const defaultDept = departments.length > 0 ? departments[0].name : '';

    // staffForm handles both Registration and Edit data
    const [staffForm, setStaffForm] = useState({
        name: '', engName: '', dept: defaultDept, role: '', employeeId: '',
        email: '', personalEmail: '', phone: '', joinDate: '',
        nickname: '', password: '', permission: '직원', address: '', joinType: '경력'
    });

    const stats = useMemo(() => ({
        total: employees.length,
        working: employees.filter(e => e.workStatus === '출근').length,
        onLeave: employees.filter(e => ['휴가', '병가'].includes(e.workStatus)).length,
        newJoiners: employees.filter(e => {
            const diff = Math.abs(new Date().getTime() - new Date(e.joinDate).getTime());
            return diff / (1000 * 60 * 60 * 24) <= 365;
        }).length
    }), [employees]);

    const filteredEmployees = employees.filter(e =>
        e.name.includes(searchQuery) || e.dept.includes(searchQuery) || (e.nickname && e.nickname.includes(searchQuery))
    );

    const handleManageClick = (emp) => {
        setEditingStaffId(emp.id);

        // Ensure current dept exists in options, otherwise fallback to default
        const deptExists = departments.some(d => d.name === emp.dept);
        const currentDept = deptExists ? emp.dept : defaultDept;

        setStaffForm({
            name: emp.name, engName: emp.engName, dept: currentDept, role: emp.role, employeeId: emp.id,
            email: emp.email, personalEmail: emp.personalEmail || '', phone: emp.phone,
            joinDate: emp.joinDate, nickname: emp.nickname || '', password: '',
            permission: '직원', address: '', joinType: '경력'
        });
        setModalType('edit');
    };

    const handleSave = () => {
        if (!staffForm.name || !staffForm.employeeId) return alert('필수 정보를 입력해주세요.');

        if (modalType === 'reg') {
            const newEmp = {
                id: staffForm.employeeId,
                name: staffForm.name,
                engName: staffForm.engName,
                dept: staffForm.dept,
                role: staffForm.role,
                workStatus: '퇴근',
                email: staffForm.email,
                personalEmail: staffForm.personalEmail,
                phone: staffForm.phone,
                joinDate: staffForm.joinDate,
                nickname: staffForm.nickname,
                rank: staffForm.joinType === '신입' ? 'Level 1' : 'Level 2'
            };
            onUpdateEmployees([...employees, newEmp]);
            alert(`${staffForm.name} 님이 등록되었습니다.`);
        } else {
            onUpdateEmployees(employees.map(e => e.id === editingStaffId ? {
                ...e,
                name: staffForm.name,
                engName: staffForm.engName,
                dept: staffForm.dept,
                role: staffForm.role,
                email: staffForm.email,
                personalEmail: staffForm.personalEmail,
                phone: staffForm.phone,
                joinDate: staffForm.joinDate,
                nickname: staffForm.nickname
            } : e));
            alert('직원 정보가 수정되었습니다.');
        }
        setModalType('none');
    };

    const handleResignation = () => {
        if (!resignationReason) return alert('사유를 입력해주세요.');
        onUpdateEmployees(employees.map(e => e.id === editingStaffId ? { ...e, workStatus: '퇴직' } : e));
        setModalType('none');
    };

    const handleDeptChange = (newDept) => {
        setStaffForm({
            ...staffForm,
            dept: newDept,
            // role is kept as is unless specific requirement to clear it
        });
    };

    const StatCard = ({ label, value, icon: Icon, subLabel }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{label}</span>
                <Icon size={18} className="text-gray-800" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900 leading-tight">{value}</span>
                <span className="text-sm text-gray-400 font-medium">명</span>
            </div>
            {subLabel && <p className="text-[11px] text-gray-400 mt-2">{subLabel}</p>}
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="총 직원수" value={stats.total} icon={Users} subLabel="현재 등록된 전체 구성원 수입니다." />
                <StatCard label="현재 근무중" value={stats.working} icon={UserCheck} subLabel="실시간 업무 상태가 '출근'인 인원" />
                <StatCard label="휴가/부재" value={stats.onLeave} icon={Calendar} subLabel="연차, 반차, 병가 등으로 부재중인 인원" />
                <StatCard label="신규 입사자" value={stats.newJoiners} icon={UserPlus} subLabel="최근 1년 이내 입사한 신규 인력" />
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="이름, 부서 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-black transition-colors" />
                </div>
                <button onClick={() => { setStaffForm({ name: '', engName: '', dept: defaultDept, role: '', employeeId: '', email: '', personalEmail: '', phone: '', joinDate: '', nickname: '', password: '', permission: '직원', address: '', joinType: '경력' }); setModalType('reg'); }} className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm"><Plus size={16} /> 직원 등록</button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                        <tr><th className="px-6 py-3 border-r border-gray-200">이름/부서</th><th className="px-6 py-3 border-r border-gray-200">연락처</th><th className="px-6 py-3 border-r border-gray-200">입사일</th><th className="px-6 py-3 border-r border-gray-200">근태 상태</th><th className="px-6 py-3 text-center">관리</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-r border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">{emp.avatarUrl ? <img src={emp.avatarUrl} className="w-full h-full object-cover" /> : emp.name.charAt(0)}</div>
                                        <div><div className="font-bold text-gray-900">{emp.name} <span className="text-gray-400 font-normal text-xs">({emp.id})</span></div><div className="text-xs text-gray-500">{emp.dept} · {emp.role}</div></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 border-r border-gray-100"><div>{emp.email}</div><div className="text-xs text-gray-400">{emp.phone}</div></td>
                                <td className="px-6 py-4 text-gray-600 border-r border-gray-100">{emp.joinDate}</td>
                                <td className="px-6 py-4 border-r border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        {emp.workStatus === '출근' && <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-green-700 font-medium text-xs">업무중</span></>}
                                        {emp.workStatus === '퇴근' && <><span className="w-2 h-2 rounded-full bg-gray-300"></span><span className="text-gray-500 text-xs">퇴근</span></>}
                                        {(emp.workStatus === '휴가' || emp.workStatus === '병가') && <><span className={`w-2 h-2 rounded-full ${emp.workStatus === '병가' ? 'bg-red-500' : 'bg-blue-500'}`}></span><span className="text-xs font-medium">{emp.workStatus}</span></>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center"><button onClick={() => handleManageClick(emp)} className="text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-full transition-all"><Edit3 size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(modalType === 'reg' || modalType === 'edit') && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setModalType('none')}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10"><h3 className="text-xl font-bold text-gray-900">{modalType === 'reg' ? '신규 직원 등록' : '직원 정보 관리'}</h3><button onClick={() => setModalType('none')}><X size={24} /></button></div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">이름</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="예: 홍길동" value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">영문 이름</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="예: Gildong Hong" value={staffForm.engName} onChange={e => setStaffForm({ ...staffForm, engName: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">사번</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="예: AB123" value={staffForm.employeeId} onChange={e => setStaffForm({ ...staffForm, employeeId: e.target.value })} disabled={modalType === 'edit'} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">입사일</label>
                                        <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" value={staffForm.joinDate} onChange={e => setStaffForm({ ...staffForm, joinDate: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">부서</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                                                value={staffForm.dept}
                                                onChange={e => handleDeptChange(e.target.value)}
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">직무</label>
                                        <input
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                            placeholder="예: 마케팅 팀장"
                                            value={staffForm.role}
                                            onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">닉네임</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="예: 닉" value={staffForm.nickname} onChange={e => setStaffForm({ ...staffForm, nickname: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">패스워드</label>
                                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-black">
                                            <Lock size={14} className="text-gray-400" />
                                            <input type="password" className="w-full text-sm outline-none" placeholder="비밀번호" value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">권한</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                            value={staffForm.permission}
                                            onChange={e => setStaffForm({ ...staffForm, permission: e.target.value })}
                                        >
                                            <option value="직원">직원</option>
                                            <option value="매니저">매니저</option>
                                            <option value="인사/운영자">인사/운영자</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">입사 유형</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                            value={staffForm.joinType}
                                            onChange={e => setStaffForm({ ...staffForm, joinType: e.target.value })}
                                        >
                                            <option value="신입">신입</option>
                                            <option value="경력">경력</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">주소</label>
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-black">
                                        <Home size={14} className="text-gray-400" />
                                        <input className="w-full text-sm outline-none" placeholder="예: 서울시 강남구..." value={staffForm.address} onChange={e => setStaffForm({ ...staffForm, address: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">사내 이메일</label>
                                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-black">
                                            <Mail size={14} className="text-gray-400" />
                                            <input className="w-full text-sm outline-none" placeholder="example@company.com" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">연락처</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="010-0000-0000" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">개인 이메일</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" placeholder="example@gmail.com" value={staffForm.personalEmail} onChange={e => setStaffForm({ ...staffForm, personalEmail: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                            {modalType === 'edit' && <button onClick={() => setModalType('resignation')} className="px-6 py-2.5 text-sm text-white bg-red-500 rounded-xl font-bold mr-auto">퇴사처리</button>}
                            <button onClick={() => setModalType('none')} className="px-6 py-2.5 text-sm text-gray-500">취소</button>
                            <button onClick={handleSave} className="px-8 py-2.5 text-sm bg-black text-white rounded-xl font-bold">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {modalType === 'resignation' && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setModalType('edit')}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3 bg-red-50">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-800 text-lg">퇴사 처리</h3>
                                <p className="text-xs text-red-600">직원의 근무 상태가 '퇴직'으로 변경됩니다.</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="text-center py-2">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-bold text-gray-900 text-lg block mb-1">{staffForm.name}</span>
                                    님의 퇴사 처리를 진행하시겠습니까?<br />
                                    처리 후에는 복구할 수 없습니다.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">퇴사 사유 (필수)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400"
                                    placeholder="구체적인 퇴사 사유를 입력해주세요."
                                    value={resignationReason}
                                    onChange={e => setResignationReason(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={() => setModalType('edit')}
                                className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleResignation}
                                className="px-5 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md shadow-red-200 transition-all flex items-center gap-2"
                            >
                                퇴사 처리 확정
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
