import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Lock, Home, Mail, Users, Clock, UserPlus, X, AlertCircle, UserCheck, Calendar, ChevronDown } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    ControlsContainer, SearchWrapper, SearchInput, SearchIconWrapper, AddButton,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    AvatarWrapper, AvatarImage, UserInfo, NameText, IdText, DeptText, SecondaryText, StatusBadge, StatusDot, StatusLabel, EditButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalBody, ModalFooter,
    FormGrid, FormGroup, Label, InputWrapper, FormInput, SelectWrapper, SelectIconWrapper, FormSelect,
    PrimaryButton, SecondaryButton, ResignationButton, ResignationTextarea
} from './StaffManagement.styled';

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
        });
    };

    const StatCard = ({ label, value, icon: Icon, subLabel }) => (
        <StatCardContainer>
            <StatHeader>
                <StatLabel>{label}</StatLabel>
                <Icon size={18} color="#1f2937" />
            </StatHeader>
            <StatValueWrapper>
                <StatValue>{value}</StatValue>
                <StatUnit>명</StatUnit>
            </StatValueWrapper>
            {subLabel && <StatSubLabel>{subLabel}</StatSubLabel>}
        </StatCardContainer>
    );

    return (
        <Container>
            <StatsGrid>
                <StatCard label="총 직원수" value={stats.total} icon={Users} subLabel="현재 등록된 전체 구성원 수입니다." />
                <StatCard label="현재 근무중" value={stats.working} icon={UserCheck} subLabel="실시간 업무 상태가 '출근'인 인원" />
                <StatCard label="휴가/부재" value={stats.onLeave} icon={Calendar} subLabel="연차, 반차, 병가 등으로 부재중인 인원" />
                <StatCard label="신규 입사자" value={stats.newJoiners} icon={UserPlus} subLabel="최근 1년 이내 입사한 신규 인력" />
            </StatsGrid>

            <ControlsContainer>
                <SearchWrapper>
                    <SearchIconWrapper>
                        <Search size={14} />
                    </SearchIconWrapper>
                    <SearchInput
                        type="text"
                        placeholder="이름, 부서 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchWrapper>
                <AddButton onClick={() => { setStaffForm({ name: '', engName: '', dept: defaultDept, role: '', employeeId: '', email: '', personalEmail: '', phone: '', joinDate: '', nickname: '', password: '', permission: '직원', address: '', joinType: '경력' }); setModalType('reg'); }}>
                    <Plus size={16} /> 직원 등록
                </AddButton>
            </ControlsContainer>

            <TableContainer>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell>이름/부서</TableHeaderCell>
                            <TableHeaderCell>연락처</TableHeaderCell>
                            <TableHeaderCell>입사일</TableHeaderCell>
                            <TableHeaderCell>근태 상태</TableHeaderCell>
                            <TableHeaderCell $center>관리</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map(emp => (
                            <TableRow key={emp.id}>
                                <TableCell>
                                    <UserInfo>
                                        <AvatarWrapper>
                                            {emp.avatarUrl ? <AvatarImage src={emp.avatarUrl} /> : emp.name.charAt(0)}
                                        </AvatarWrapper>
                                        <div>
                                            <NameText>{emp.name} <IdText>({emp.id})</IdText></NameText>
                                            <DeptText>{emp.dept} · {emp.role}</DeptText>
                                        </div>
                                    </UserInfo>
                                </TableCell>
                                <TableCell $color="#4b5563">
                                    <div>{emp.email}</div>
                                    <SecondaryText>{emp.phone}</SecondaryText>
                                </TableCell>
                                <TableCell $color="#4b5563">{emp.joinDate}</TableCell>
                                <TableCell>
                                    <StatusBadge>
                                        <StatusDot $status={emp.workStatus} />
                                        <StatusLabel $status={emp.workStatus}>{emp.workStatus}</StatusLabel>
                                    </StatusBadge>
                                </TableCell>
                                <TableCell $center>
                                    <EditButton onClick={() => handleManageClick(emp)}>
                                        <Edit3 size={16} />
                                    </EditButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {(modalType === 'reg' || modalType === 'edit') && (
                <ModalOverlay onClick={() => setModalType('none')}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{modalType === 'reg' ? '신규 직원 등록' : '직원 정보 관리'}</ModalTitle>
                            <CloseButton onClick={() => setModalType('none')}><X size={24} /></CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <div className="space-y-5">
                                <FormGrid>
                                    <FormGroup>
                                        <Label>이름</Label>
                                        <FormInput $standalone placeholder="예: 홍길동" value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>영문 이름</Label>
                                        <FormInput $standalone placeholder="예: Gildong Hong" value={staffForm.engName} onChange={e => setStaffForm({ ...staffForm, engName: e.target.value })} />
                                    </FormGroup>
                                </FormGrid>

                                <FormGrid>
                                    <FormGroup>
                                        <Label>사번</Label>
                                        <FormInput $standalone placeholder="예: AB123" value={staffForm.employeeId} onChange={e => setStaffForm({ ...staffForm, employeeId: e.target.value })} disabled={modalType === 'edit'} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>입사일</Label>
                                        <FormInput $standalone type="date" value={staffForm.joinDate} onChange={e => setStaffForm({ ...staffForm, joinDate: e.target.value })} />
                                    </FormGroup>
                                </FormGrid>

                                <FormGrid>
                                    <FormGroup>
                                        <Label>부서</Label>
                                        <SelectWrapper>
                                            <FormSelect
                                                value={staffForm.dept}
                                                onChange={e => handleDeptChange(e.target.value)}
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                                ))}
                                            </FormSelect>
                                            <SelectIconWrapper>
                                                <ChevronDown size={14} />
                                            </SelectIconWrapper>
                                        </SelectWrapper>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>직무</Label>
                                        <FormInput
                                            $standalone
                                            placeholder="예: 마케팅 팀장"
                                            value={staffForm.role}
                                            onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                                        />
                                    </FormGroup>
                                </FormGrid>

                                <FormGrid>
                                    <FormGroup>
                                        <Label>닉네임</Label>
                                        <FormInput $standalone placeholder="예: 닉" value={staffForm.nickname} onChange={e => setStaffForm({ ...staffForm, nickname: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>패스워드</Label>
                                        <InputWrapper>
                                            <Lock size={14} />
                                            <FormInput type="password" placeholder="비밀번호" value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} />
                                        </InputWrapper>
                                    </FormGroup>
                                </FormGrid>

                                <FormGrid>
                                    <FormGroup>
                                        <Label>권한</Label>
                                        <SelectWrapper>
                                            <FormSelect
                                                value={staffForm.permission}
                                                onChange={e => setStaffForm({ ...staffForm, permission: e.target.value })}
                                            >
                                                <option value="직원">직원</option>
                                                <option value="매니저">매니저</option>
                                                <option value="인사/운영자">인사/운영자</option>
                                            </FormSelect>
                                            <SelectIconWrapper>
                                                <ChevronDown size={14} />
                                            </SelectIconWrapper>
                                        </SelectWrapper>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>입사 유형</Label>
                                        <SelectWrapper>
                                            <FormSelect
                                                value={staffForm.joinType}
                                                onChange={e => setStaffForm({ ...staffForm, joinType: e.target.value })}
                                            >
                                                <option value="신입">신입</option>
                                                <option value="경력">경력</option>
                                            </FormSelect>
                                            <SelectIconWrapper>
                                                <ChevronDown size={14} />
                                            </SelectIconWrapper>
                                        </SelectWrapper>
                                    </FormGroup>
                                </FormGrid>

                                <FormGroup>
                                    <Label>주소</Label>
                                    <InputWrapper>
                                        <Home size={14} />
                                        <FormInput placeholder="예: 서울시 강남구..." value={staffForm.address} onChange={e => setStaffForm({ ...staffForm, address: e.target.value })} />
                                    </InputWrapper>
                                </FormGroup>

                                <FormGrid>
                                    <FormGroup>
                                        <Label>사내 이메일</Label>
                                        <InputWrapper>
                                            <Mail size={14} />
                                            <FormInput placeholder="example@company.com" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
                                        </InputWrapper>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>연락처</Label>
                                        <FormInput $standalone placeholder="010-0000-0000" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
                                    </FormGroup>
                                </FormGrid>
                                <FormGroup>
                                    <Label>개인 이메일</Label>
                                    <FormInput $standalone placeholder="example@gmail.com" value={staffForm.personalEmail} onChange={e => setStaffForm({ ...staffForm, personalEmail: e.target.value })} />
                                </FormGroup>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            {modalType === 'edit' && (
                                <ResignationButton onClick={() => setModalType('resignation')}>
                                    퇴사처리
                                </ResignationButton>
                            )}
                            <SecondaryButton onClick={() => setModalType('none')}>취소</SecondaryButton>
                            <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}

            {modalType === 'resignation' && (
                <ModalOverlay onClick={() => setModalType('edit')}>
                    <ModalContainer $maxWidth="28rem" onClick={e => e.stopPropagation()}>
                        <ModalHeader $borderColor="#fee2e2" $bgColor="#fef2f2">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '9999px', display: 'flex' }}>
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, color: '#7f1d1d', fontSize: '1.125rem' }}>퇴사 처리</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#b91c1c' }}>직원의 근무 상태가 '퇴직'으로 변경됩니다.</p>
                                </div>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.625' }}>
                                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', display: 'block', marginBottom: '0.25rem' }}>{staffForm.name}</span>
                                    님의 퇴사 처리를 진행하시겠습니까?<br />
                                    처리 후에는 복구할 수 없습니다.
                                </p>
                            </div>

                            <div>
                                <Label>퇴사 사유 (필수)</Label>
                                <ResignationTextarea
                                    placeholder="구체적인 퇴사 사유를 입력해주세요."
                                    value={resignationReason}
                                    onChange={e => setResignationReason(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <SecondaryButton onClick={() => setModalType('edit')}>취소</SecondaryButton>
                            <PrimaryButton $danger onClick={handleResignation}>
                                퇴사 처리 확정
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
