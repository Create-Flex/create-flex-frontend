import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { departmentService } from '../api/departmentService';
import { Search, Phone, Building, Users, ChevronRight, X, User } from 'lucide-react';
import * as S from './OrgChartView.styled';

import { useEmployeeStore } from '../../employee/model/useEmployeeStore';

export const DepartmentReadOnlyView = () => {
    const { departments, setDepartments: onUpdateDepartments } = useEmployeeStore();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            const mappedDepts = response.data.map(d => ({
                id: d.departmentId,
                name: d.departmentName,
                phone: d.departmentCall,
                description: d.departmentDetail,
                color: d.departmentColor,
                memberCount: d.memberCount || 0
            }));
            onUpdateDepartments(mappedDepts);
        } catch (error) {
            console.error("부서 목록 로드 실패:", error);
        }
    };

    const handleCardClick = async (dept) => {
        try {
            const response = await departmentService.getDepartmentDetail(dept.id);
            const mappedMembers = response.data.members.map(m => ({
                id: m.memberId,
                name: m.memberName,
                engName: m.engName,
                role: m.task,
                workStatus: m.attendanceStatus,
                avatarUrl: null
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
    const [selectedDeptMembers, setSelectedDeptMembers] = useState([]);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <S.Container>
            <S.ContentWrapper>
                {/* Header */}
                <S.Header>
                    <div>
                        <S.Title>
                            <Building color="#1f2937" size={32} /> 회사 부서
                        </S.Title>
                        <S.SubTitle>
                            부서별 연락처 및 구성원을 확인할 수 있습니다.
                        </S.SubTitle>
                    </div>

                    <S.HeaderActions>
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
                    </S.HeaderActions>
                </S.Header>

                {/* Department Card Grid */}
                <S.DeptGrid>
                    {filteredDepartments.map((dept) => (
                        <S.DeptCard
                            key={dept.id}
                            onClick={() => handleCardClick(dept)}
                        >
                            <S.DeptColorBar $color={dept.color} />

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
                    ))}
                </S.DeptGrid>
            </S.ContentWrapper>

            {/* Member List Modal */}
            {selectedDept && (
                <S.ModalOverlay onClick={() => setSelectedDept(null)}>
                    <S.ModalContainer onClick={e => e.stopPropagation()}>
                        <S.ModalHeader>
                            <div>
                                <S.ModalTitle>{selectedDept.name}</S.ModalTitle>
                                <S.ModalMeta>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Phone size={12} /> {selectedDept.phone}
                                    </span>
                                    <span style={{ width: '1px', height: '0.75rem', backgroundColor: '#d1d5db' }} />
                                    <span>총 {selectedDeptMembers.length}명</span>
                                </S.ModalMeta>
                            </div>
                            <S.CloseButton onClick={() => setSelectedDept(null)}>
                                <X size={20} />
                            </S.CloseButton>
                        </S.ModalHeader>

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
                    </S.ModalContainer>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};
