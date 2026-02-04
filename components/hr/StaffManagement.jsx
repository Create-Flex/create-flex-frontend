import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit3, Lock, Home, Mail, Users, Clock, UserPlus, X, AlertCircle, UserCheck, Calendar, ChevronDown } from 'lucide-react';
import { staffService } from '../../api/staffService.js';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    ControlsContainer, SearchWrapper, SearchInput, SearchIconWrapper, AddButton,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
    AvatarWrapper, AvatarImage, UserInfo, NameText, IdText, DeptText, SecondaryText, StatusBadge, StatusDot, StatusLabel, EditButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalBody, ModalFooter,
    FormGrid, FormGroup, Label, InputWrapper, FormInput, SelectWrapper, SelectIconWrapper, FormSelect,
    PrimaryButton, SecondaryButton, ResignationButton, ResignationTextarea, SearchButton
} from './StaffManagement.styled';

export const StaffManagement = ({ onUpdateEmployees, vacationLogs, departments }) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [summary, setSummary] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [departmentList, setDepartmentList] = useState([]); // API에서 가져온 부서 목록

    const [modalType, setModalType] = useState('none');
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [resignationReason, setResignationReason] = useState('');

    // Default department is the first one in the list, or empty if none exist
    const defaultDeptId = departmentList.length > 0 ? departmentList[0].departmentId : '';

    // staffForm handles both Registration and Edit data
    const [staffForm, setStaffForm] = useState({
        memberid: '',
        name: '', engName: '', dept: defaultDeptId, role: '', employeeId: '',
        email: '', personalEmail: '', phone: '', joinDate: '',
        nickname: '', password: '', permission: '직원', address: '', joinType: '경력',
        memberStatus: 'WORKING'
    });

    const fetchEmployees = async (name = '') => {
        setLoading(true);
        try {
            const response = await staffService.getEmployees(name);
            setEmployeeList(response.data.list || []);
            setSummary(response.data.summary || null);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            alert('데이터를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 부서 목록 조회
    const fetchDepartments = async () => {
        try {
            const response = await staffService.getDepartments();
            setDepartmentList(response.data || []);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            alert('부서 목록을 불러오지 못했습니다.');
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments(); // 부서 목록도 함께 조회
    }, []);

    const handleSearch = () => {
        fetchEmployees(searchInput);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const stats = useMemo(() => ({
        total: summary?.totalCount || 0,
        working: summary?.workingCount || 0,
        onLeave: summary?.vacationCount || 0,
        newJoiners: summary?.newHireCount || 0
    }), [summary]);

    const handleManageClick = async (emp) => {
        try {
            const response = await staffService.getEmployeeDetail(emp.memberid);
            const detail = response.data;

            // EMPLOYEE -> 직원, MANAGER -> 매니저, ADMINISTRATOR -> 인사/운영자
            const permissionMap = {
                'EMPLOYEE': '직원',
                'MANAGER': '매니저',
                'ADMINISTRATOR': '인사/운영자'
            };

            setStaffForm({
                memberid: detail.memberid,
                name: detail.memberName,
                engName: detail.engName || '',
                dept: detail.departmentid || defaultDeptId, // departmentId를 저장
                role: detail.task,
                employeeId: detail.memberAccount,
                email: detail.corporEmail,
                personalEmail: detail.personalEmail || '',
                phone: detail.personalCall,
                joinDate: detail.hireDate,
                nickname: detail.nickname || '',
                password: '',
                permission: permissionMap[detail.memberRole] || '직원',
                address: detail.address || '',
                joinType: detail.employmentType === 'EXPERIENCED' ? '경력' : '신입',
                memberStatus: detail.memberStatus || 'WORKING'
            });
            setModalType('edit');
        } catch (error) {
            console.error('Failed to fetch employee detail:', error);
            alert('정보를 불러오지 못했습니다.');
        }
    };

    const handleSave = async () => {
        if (!staffForm.name || !staffForm.employeeId) return alert('필수 정보를 입력해주세요.');

        const permissionToEnum = {
            '직원': 'EMPLOYEE',
            '매니저': 'MANAGER',
            '인사/운영자': 'ADMINISTRATOR'
        };

        const joinTypeToEnum = {
            '신입': 'NEWBIE',
            '경력': 'EXPERIENCED'
        };

        try {
            if (modalType === 'reg') {
                const employeeData = {
                    memberAccount: staffForm.employeeId,
                    memberName: staffForm.name,
                    memberRole: permissionToEnum[staffForm.permission] || 'EMPLOYEE',
                    memberStatus: 'WORKING', // 신규 등록은 기본적으로 WORKING
                    task: staffForm.role,
                    departmentid: staffForm.dept,
                    password: staffForm.password,
                    nickname: staffForm.nickname,
                    personalEmail: staffForm.personalEmail,
                    personalCall: staffForm.phone,
                    address: staffForm.address,
                    engName: staffForm.engName,
                    corporEmail: staffForm.email,
                    hireDate: staffForm.joinDate,
                    employmentType: joinTypeToEnum[staffForm.joinType] || 'EXPERIENCED'
                };

                await staffService.registerEmployee(employeeData);
                alert(`${staffForm.name} 님이 등록되었습니다.`);
            } else {
                const employeeUpdateData = {
                    memberName: staffForm.name,
                    memberRole: permissionToEnum[staffForm.permission] || 'EMPLOYEE',
                    memberStatus: staffForm.memberStatus || 'WORKING',
                    task: staffForm.role,
                    departmentid: staffForm.dept,
                    password: staffForm.password, // 비밀번호가 비어있으면 그대로 전송 (백엔드 처리 필요)
                    nickname: staffForm.nickname,
                    personalEmail: staffForm.personalEmail,
                    personalCall: staffForm.phone,
                    address: staffForm.address,
                    engName: staffForm.engName,
                    corporEmail: staffForm.email,
                    hireDate: staffForm.joinDate,
                    employmentType: joinTypeToEnum[staffForm.joinType] || 'EXPERIENCED'
                };

                await staffService.updateEmployee(staffForm.memberid, employeeUpdateData);
                alert('직원 정보가 수정되었습니다.');
            }
            setModalType('none');
            fetchEmployees();
        } catch (error) {
            console.error('작업 실패:', error);
            alert('작업에 실패했습니다. 입력 정보를 확인해주세요.');
        }
    };

    const handleResignation = () => {
        if (!resignationReason) return alert('사유를 입력해주세요.');

        setModalType('none');
        fetchEmployees();
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
                        placeholder="이름 검색..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchWrapper>
                <AddButton onClick={() => { setStaffForm({ name: '', engName: '', dept: defaultDeptId, role: '', employeeId: '', email: '', personalEmail: '', phone: '', joinDate: '', nickname: '', password: '', permission: '직원', address: '', joinType: '경력' }); setModalType('reg'); }}>
                    <Plus size={16} /> 직원 등록
                </AddButton>
            </ControlsContainer>

            <TableContainer>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeaderCell>이름/부서</TableHeaderCell>
                                <TableHeaderCell>회사 이메일/비상 연락처</TableHeaderCell>
                                <TableHeaderCell>입사일</TableHeaderCell>
                                <TableHeaderCell>근태 상태</TableHeaderCell>
                                <TableHeaderCell $center>관리</TableHeaderCell>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {employeeList.map(emp => (
                                <TableRow key={emp.memberid}>
                                    <TableCell>
                                        <UserInfo>
                                            <AvatarWrapper>
                                                {emp.memberName.charAt(0)}
                                            </AvatarWrapper>
                                            <div>
                                                <NameText>{emp.memberName} <IdText>({emp.memberAccount})</IdText></NameText>
                                                <DeptText>{emp.departmentName} · {emp.task}</DeptText>
                                            </div>
                                        </UserInfo>
                                    </TableCell>
                                    <TableCell $color="#4b5563">
                                        <div>{emp.corporEmail}</div>
                                        <SecondaryText>{emp.personalCall}</SecondaryText>
                                    </TableCell>
                                    <TableCell $color="#4b5563">{emp.hireDate}</TableCell>
                                    <TableCell>
                                        <StatusBadge>
                                            <StatusDot $status={emp.attendanceStatus} />
                                            <StatusLabel $status={emp.attendanceStatus}>{emp.attendanceStatus}</StatusLabel>
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
                )}
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
                                                {departmentList.map(dept => (
                                                    <option key={dept.departmentId} value={dept.departmentId}>
                                                        {dept.departmentName}
                                                    </option>
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
