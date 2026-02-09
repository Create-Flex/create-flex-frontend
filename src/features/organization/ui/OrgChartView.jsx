import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { departmentService } from '../api/departmentService';
import { Search, Phone, Building, Users, ChevronRight, X, User, Plus, Edit3, Trash2 } from 'lucide-react';
import { UserRole } from '../../../shared/constants/enums';
import * as S from './OrgChartView.styled';

import { useAuthStore } from '../../auth/model/useAuthStore';
import { useEmployeeStore } from '../../employee/model/useEmployeeStore';

const DEPT_COLORS = [
    { label: 'Slate', value: '#1e293b' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Cyan', value: '#0891b2' },
    { label: 'Gray', value: '#4b5563' },
    { label: 'Teal', value: '#0d9488' },
];

export const OrgChartView = () => {
    const { user } = useAuthStore();
    const { departments, setDepartments: onUpdateDepartments, employees } = useEmployeeStore();

    // API Fetch
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            // Map backend data to frontend structure
            const mappedDepts = response.data.map(d => ({
                id: d.departmentId,
                name: d.departmentName,
                phone: d.departmentCall,
                description: d.departmentDetail,
                color: d.departmentColor,
                memberCount: d.memberCount || 0 // 멤버 수 매핑
            }));
            onUpdateDepartments(mappedDepts);
        } catch (error) {
            console.error("부서 목록 로드 실패:", error);
        }
    };

    // 부서 상세 정보 조회 (멤버 목록 포함)
    const handleCardClick = async (dept) => {
        try {
            const response = await departmentService.getDepartmentDetail(dept.id);
            // DepartmentDetailResponse: { departmentId, departmentName, members: [...] }
            // MemberSummaryResponse: { memberId, memberName, engName, task, attendanceStatus }

            // Map backend member to frontend format
            const mappedMembers = response.data.members.map(m => ({
                id: m.memberId,
                name: m.memberName,
                engName: m.engName,
                role: m.task, // 직책/직무
                workStatus: m.attendanceStatus,
                avatarUrl: null // DB에 없으면 null
            }));

            setSelectedDeptMembers(mappedMembers);
            setSelectedDept(dept);
        } catch (error) {
            console.error("부서 상세 정보 로드 실패:", error);
            toast.error("부서 정보를 불러오는데 실패했습니다.");
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedDeptMembers, setSelectedDeptMembers] = useState([]); // 멤버 목록 상태 추가

    // Admin Management State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingDeptId, setEditingDeptId] = useState(null);
    const [deptForm, setDeptForm] = useState({
        name: '',
        description: '',
        phone: '',
        color: '#1e293b'
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
        setDeptForm({ name: '', description: '', phone: '', color: '#1e293b' });
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

    const handleDeleteDepartment = async (id) => {
        if (window.confirm('부서를 삭제하시겠습니까?')) {
            try {
                await departmentService.deleteDepartment(id);
                toast.success('부서가 삭제되었습니다.');
                fetchDepartments();
                setSelectedDept(null);
            } catch (error) {
                toast.error('삭제에 실패했습니다.');
            }
        }
    };

    const handleSave = async () => {
        if (!deptForm.name) return toast.error('조직 이름을 입력해주세요.');

        const apiData = {
            departmentName: deptForm.name,
            departmentDetail: deptForm.description,
            departmentCall: deptForm.phone,
            departmentColor: deptForm.color
        };

        try {
            if (modalMode === 'add') {
                await departmentService.createDepartment(apiData);
                toast.success('부서가 생성되었습니다.');
            } else if (modalMode === 'edit' && editingDeptId) {
                await departmentService.updateDepartment(editingDeptId, apiData);
                toast.success('부서 정보가 수정되었습니다.');
            }
            fetchDepartments();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('저장 중 오류가 발생했습니다.');
        }
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

                        return (
                            <S.DeptCard
                                key={dept.id}
                                onClick={() => handleCardClick(dept)}
                            >
                                {/* Color Bar */}
                                <S.DeptColorBar $color={dept.color}></S.DeptColorBar>

                                <S.DeptContent>
                                    <S.DeptHeader>
                                        <S.DeptIcon>
                                            <Building size={24} />
                                        </S.DeptIcon>
                                        <S.DeptMeta>
                                            <S.MemberBadge>
                                                <Users size={12} />
                                                <span>{dept.memberCount}명</span>
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
                                    <span>총 {selectedDeptMembers.length}명</span>
                                </S.ModalMeta>
                            </div>
                            <S.CloseButton onClick={() => setSelectedDept(null)}>
                                <X size={20} />
                            </S.CloseButton>
                        </S.ModalHeader>

                        {/* Modal Body (List) */}
                        <S.ModalBody>
                            {selectedDeptMembers.length > 0 ? (
                                <S.MemberList>
                                    {selectedDeptMembers.map(member => (
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
                                            $color={c.value}
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
