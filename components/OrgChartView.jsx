import React, { useState } from 'react';
import { Search, Phone, Building, Users, ChevronRight, X, User, Plus, Edit3, Trash2 } from 'lucide-react';
import { UserRole } from '../enums';
import * as S from './OrgChartView.styled';

import { useAuthStore } from '../stores/useAuthStore';
import { useOrgStore } from '../stores/useOrgStore';

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

export const OrgChartView = () => {
    const { user } = useAuthStore();
    const { departments, setDepartments: onUpdateDepartments, employees } = useOrgStore();

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
        <S.Container>
            <S.ContentWrapper>
                {/* Header */}
                <S.Header>
                    <div>
                        <S.Title>
                            <Building color="#1f2937" size={32} /> 회사 조직도
                        </S.Title>
                        <S.SubTitle>
                            부서별 연락처 및 구성원을 확인할 수 있습니다.
                        </S.SubTitle>
                    </div>

                    <S.HeaderActions>
                        {/* Search */}
                        <S.SearchInputWrapper>
                            <S.SearchIconWrapper>
                                <Search size={16} />
                            </S.SearchIconWrapper>
                            <S.SearchInput
                                type="text"
                                placeholder="부서명 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </S.SearchInputWrapper>

                        {isAdmin && (
                            <S.AddButton onClick={handleOpenAdd}>
                                <Plus size={16} /> 조직 추가
                            </S.AddButton>
                        )}
                    </S.HeaderActions>
                </S.Header>

                {/* Department Card Grid */}
                <S.DeptGrid>
                    {filteredDepartments.map((dept) => {
                        const memberCount = getDeptMembers(dept.name).length;

                        return (
                            <S.DeptCard
                                key={dept.id}
                                onClick={() => setSelectedDept(dept)}
                            >
                                {/* Color Bar */}
                                <S.DeptColorBar className={dept.color}></S.DeptColorBar>

                                <S.DeptContent>
                                    <S.DeptHeader>
                                        <S.DeptIcon>
                                            <Building size={24} />
                                        </S.DeptIcon>
                                        <S.DeptMeta>
                                            <S.MemberBadge>
                                                <Users size={12} />
                                                <span>{memberCount}명</span>
                                            </S.MemberBadge>
                                            {isAdmin && (
                                                <S.EditButton
                                                    onClick={(e) => handleOpenEdit(dept, e)}
                                                    title="수정"
                                                >
                                                    <Edit3 size={14} />
                                                </S.EditButton>
                                            )}
                                        </S.DeptMeta>
                                    </S.DeptHeader>

                                    <S.DeptName>{dept.name}</S.DeptName>
                                    <S.DeptDescription>{dept.description}</S.DeptDescription>

                                    <S.DeptFooter>
                                        <S.DeptPhone>
                                            <Phone size={14} color="#9ca3af" />
                                            <span>{dept.phone}</span>
                                        </S.DeptPhone>
                                        <ChevronRight size={16} color="#d1d5db" />
                                    </S.DeptFooter>
                                </S.DeptContent>
                            </S.DeptCard>
                        );
                    })}
                </S.DeptGrid>
            </S.ContentWrapper>

            {/* Member List Modal */}
            {selectedDept && (
                <S.ModalOverlay onClick={() => setSelectedDept(null)}>
                    <S.ModalContainer onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <S.ModalHeader>
                            <div>
                                <S.ModalTitle>
                                    {selectedDept.name}
                                </S.ModalTitle>
                                <S.ModalMeta>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12} /> {selectedDept.phone}</span>
                                    <span style={{ width: '1px', height: '0.75rem', backgroundColor: '#d1d5db' }}></span>
                                    <span>총 {getDeptMembers(selectedDept.name).length}명</span>
                                </S.ModalMeta>
                            </div>
                            <S.CloseButton onClick={() => setSelectedDept(null)}>
                                <X size={20} />
                            </S.CloseButton>
                        </S.ModalHeader>

                        {/* Modal Body (List) */}
                        <S.ModalBody>
                            {getDeptMembers(selectedDept.name).length > 0 ? (
                                <S.MemberList>
                                    {getDeptMembers(selectedDept.name).map(member => (
                                        <S.MemberItem key={member.id}>
                                            <S.Avatar>
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.name} />
                                                ) : (
                                                    <User color="#9ca3af" size={20} />
                                                )}
                                            </S.Avatar>
                                            <S.MemberInfo>
                                                <S.MemberNameRow>
                                                    <S.MemberName>{member.name}</S.MemberName>
                                                    <S.MemberEngName>({member.engName})</S.MemberEngName>
                                                </S.MemberNameRow>
                                                <S.MemberRole>{member.role}</S.MemberRole>
                                            </S.MemberInfo>
                                            <div>
                                                <S.StatusBadge $status={member.workStatus}>
                                                    {member.workStatus}
                                                </S.StatusBadge>
                                            </div>
                                        </S.MemberItem>
                                    ))}
                                </S.MemberList>
                            ) : (
                                <S.EmptyState>
                                    <Users size={40} color="#d1d5db" />
                                    <p>소속된 부서원이 없습니다.</p>
                                </S.EmptyState>
                            )}
                        </S.ModalBody>

                        {/* Modal Footer (Delete Button) */}
                        {isAdmin && (
                            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                                <S.DeleteButton
                                    onClick={() => handleDeleteDepartment(selectedDept.id)}
                                >
                                    <Trash2 size={16} /> 부서 삭제
                                </S.DeleteButton>
                            </div>
                        )}
                    </S.ModalContainer>
                </S.ModalOverlay>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <S.ModalContainer onClick={e => e.stopPropagation()} $maxWidth="28rem">
                        <S.ModalHeader>
                            <h3 style={{ fontWeight: 700, color: '#111827' }}>{modalMode === 'add' ? '새 조직 추가' : '조직 정보 수정'}</h3>
                            <S.CloseButton onClick={() => setIsModalOpen(false)}><X size={20} /></S.CloseButton>
                        </S.ModalHeader>
                        <S.FormContainer>
                            <S.FormField>
                                <S.Label>조직 이름</S.Label>
                                <S.Input
                                    placeholder="예: 마케팅팀 (Marketing)"
                                    value={deptForm.name}
                                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                />
                            </S.FormField>
                            <S.FormField>
                                <S.Label>조직 설명</S.Label>
                                <S.TextArea
                                    placeholder="조직의 역할과 업무에 대해 설명해주세요."
                                    value={deptForm.description}
                                    onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                                />
                            </S.FormField>
                            <S.FormField>
                                <S.Label>대표 전화번호</S.Label>
                                <S.Input
                                    placeholder="예: 02-1234-5678"
                                    value={deptForm.phone}
                                    onChange={e => setDeptForm({ ...deptForm, phone: e.target.value })}
                                />
                            </S.FormField>
                            <S.FormField>
                                <S.Label>테마 색상</S.Label>
                                <S.ColorGrid>
                                    {DEPT_COLORS.map((c) => (
                                        <S.ColorButton
                                            key={c.value}
                                            onClick={() => setDeptForm({ ...deptForm, color: c.value })}
                                            className={c.value}
                                            $isSelected={deptForm.color === c.value}
                                            title={c.label}
                                        />
                                    ))}
                                </S.ColorGrid>
                            </S.FormField>
                        </S.FormContainer>
                        <S.ModalFooter>
                            <S.FooterButton onClick={() => setIsModalOpen(false)}>취소</S.FooterButton>
                            <S.FooterButton $primary onClick={handleSave}>저장</S.FooterButton>
                        </S.ModalFooter>
                    </S.ModalContainer>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};
