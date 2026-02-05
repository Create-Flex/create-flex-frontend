import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, FileText, Download, Calendar, User, Activity, ArrowRight, Trash2, Edit3, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import {
    Container, StatsGrid, StatCardContainer, StatHeader, StatLabel, IconWrapper, StatValueWrapper, StatValue, StatUnit, StatSubLabel,
    ControlsContainer, FilterGroup, SearchWrapper, SearchInput, SearchIconWrapper, SelectWrapper, ResultSelect, SelectIconWrapper, DateFilter, DateLabel, DateInput, DateRangeArrow, ResetButton,
    TableContainer, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, ResultBadge, ActionButtonsData, ActionIconBtn,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalBody, FormSection, FormGroup, FormGrid, FormLabel, FormInput, FormSelect,
    InfoValue, AttachmentCard, FileIconWrapper, FileName, FileSize, DownloadBtn, Disclaimer, ModalFooter, FooterBtn,
    AttachmentSection, AttachmentHeader, AttachmentLabel, FileContent, ButtonGroup, SearchButton
} from './HealthManagement.styled';
import { getManageHealth, getManageSearch } from '../../api/healthService';

export const HealthManagement = ({ healthRecords: initialRecords }) => {
    // CRUD 기능을 위해 로컬 상태로 관리 (App.tsx를 수정할 수 없는 제약 사항 때문)
    const [records, setRecords] = useState(initialRecords);

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const [name, setName] = useState('');
    const [resultFilter, setResultFilter] = useState('All'); // 결과 필터 상태 추가
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [healthManageList, setHealthManage] = useState([]);
    const [manageCountNormal, setManageCountNormal] = useState(0);
    const [manageCountCaution, setManageCountCaution] = useState(0);
    const [manageCountDanger, setManageCountDanger] = useState(0);
    const [menageCountRetest, setManageCountRetest] = useState(0);

    // 모달 및 편집 상태
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    const fetchManageHealth = async () => {
        try{
            const {data} = await getManageHealth();
            console.log('조회결과 : ', data);
            setHealthManage(data.healthInfoList);
                
            const manageSummanary = data.healthSummanaryCountList
            const normalAB = manageSummanary.find(item => item.checkupSummanary === 'NORMAL_AB')?.totalCount ?? 0;
            const normalB = manageSummanary.find(item => item.checkupSummanary === 'NORMAL_B')?.totalCount ?? 0;
            const caution = manageSummanary.find(item => item.checkupSummanary === 'CAUTION')?.totalCount ?? 0;
            const danger = manageSummanary.find(item => item.checkupSummanary === 'DANGER')?.totalCount ?? 0;
            const retest = manageSummanary.find(item => item.checkupSummanary === 'RETEST_NEED')?.totalCount ?? 0;
            setManageCountNormal(normalAB + normalB);
            setManageCountCaution(caution);
            setManageCountDanger(danger);
            setManageCountRetest(retest);
            } catch (err) {
                console.error('Health 조회 실패', err);
        }
    }

    const healthManageSearch = async () => {
            try {
                const { data } = await getManageSearch(name, startDate, endDate);
                console.log('검색 결과:', data);
                setHealthManage(data.healthInfoList);
            } catch (e) {
                console.error('검색 실패', e);
            }
        };

    useEffect(() => {
        fetchManageHealth();
    }, []);

    const handleReset = () =>{
        fetchManageHealth();
    }

    const handleSearch = () =>{
        console.log('검색정보 : ', name, ", ", startDate, ", ", endDate);
        healthManageSearch();
    }
    
    

    // 필터링된 데이터
    const filtered = useMemo(() => {
        return records.filter(h => {
            const matchesName = h.name.includes(name);
            const matchesResult = resultFilter === 'All' || h.result.includes(resultFilter);

            let matchesDate = true;
            if (h.lastCheck !== '-') {
                matchesDate = h.lastCheck >= startDate && h.lastCheck <= endDate;
            } else {
                matchesDate = false;
            }

            return matchesName && matchesDate && matchesResult;
        });
    }, [records, name, startDate, endDate, resultFilter]);

    // CRUD 핸들러
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('정말로 이 건강 검진 기록을 삭제하시겠습니까?')) {
            setRecords(records.filter(r => r.id !== id));
            if (selectedRecord?.id === id) setSelectedRecord(null);
        }
    };

    const handleEditStart = () => {
        if (!selectedRecord) return;
        setEditForm({ ...selectedRecord });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editForm) return;
        setRecords(records.map(r => r.id === editForm.id ? editForm : r));
        setSelectedRecord(editForm);
        setIsEditing(false);
        setEditForm(null);
        alert('기록이 수정되었습니다.');
    };

    const StatCard = ({ label, value, icon: Icon, colorClass, subLabel }) => (
        <StatCardContainer>
            <StatHeader>
                <StatLabel>{label}</StatLabel>
                <IconWrapper $colorClass={colorClass}>
                    <Icon size={16} />
                </IconWrapper>
            </StatHeader>
            <div>
                <StatValueWrapper>
                    <StatValue>{value}</StatValue>
                    <StatUnit>명</StatUnit>
                </StatValueWrapper>
                <StatSubLabel>{subLabel}</StatSubLabel>
            </div>
        </StatCardContainer>
    );

    const summaryLabelMap = {
        NORMAL_AB: '정상AB',
        NORMAL_B: '정상B',
        CAUTION: '주의',
        DANGER: '위험',
        RETEST_NEED: '재검 필요'
    };

    return (
        <Container>
            {/* Statistics Dashboard */}
            <StatsGrid>
                <StatCard
                    label="정상 (양호/경미)"
                    value={manageCountNormal}
                    icon={CheckCircle2}
                    colorClass="green"
                    subLabel="건강 상태가 양호한 인원"
                />
                <StatCard
                    label="주의 (유소견)"
                    value={manageCountCaution}
                    icon={AlertTriangle}
                    colorClass="orange"
                    subLabel="추적 관찰이 필요한 인원"
                />
                <StatCard
                    label="위험 (질환의심)"
                    value={manageCountDanger}
                    icon={AlertCircle}
                    colorClass="red"
                    subLabel="정밀 검사가 필요한 인원"
                />
                <StatCard
                    label="재검 필요"
                    value={menageCountRetest}
                    icon={RefreshCw}
                    colorClass="purple"
                    subLabel="재검사가 확정된 인원"
                />
            </StatsGrid>

            {/* Filter Toolbar */}
            <ControlsContainer>
                <FilterGroup>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <Search size={14} />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="직원 이름 검색..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </SearchWrapper>
                    {/*}
                    <SelectWrapper>
                        <ResultSelect
                            value={resultFilter}
                            onChange={(e) => setResultFilter(e.target.value)}
                        >
                            <option value="All">판정 결과 전체</option>
                            <option value="정상">정상</option>
                            <option value="주의">유소견 (주의)</option>
                            <option value="위험">유소견 (위험)</option>
                            <option value="재검">재검 필요</option>
                        </ResultSelect>
                        <SelectIconWrapper>
                            <ChevronDown size={14} />
                        </SelectIconWrapper>
                    </SelectWrapper>
                    */}
                    <DateFilter>
                        <Calendar size={14} color="#9ca3af" />
                        <DateLabel>검진일</DateLabel>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <DateRangeArrow>
                            <ArrowRight size={12} />
                        </DateRangeArrow>
                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </DateFilter>
                    <SearchWrapper>
                        <SearchButton onClick={handleSearch}>검색</SearchButton>
                    </SearchWrapper>
                </FilterGroup>

                <ResetButton
                    onClick={() => {
                        handleReset();
                        setName('');
                        setStartDate('');
                        setEndDate('');
                    }}
                >
                    필터 초기화
                </ResetButton>
            </ControlsContainer>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeaderCell>이름</TableHeaderCell>
                            <TableHeaderCell>최근 검진일</TableHeaderCell>
                            <TableHeaderCell>       </TableHeaderCell>
                            <TableHeaderCell $center>결과 판정</TableHeaderCell>
                            <TableHeaderCell $right>관리</TableHeaderCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {healthManageList.length > 0 ? healthManageList.map((rec) => (
                            <TableRow
                                key={`${rec.healthId}-${rec.checkupDate}`}
                                onClick={() => { setSelectedRecord(rec); setIsEditing(false); }}
                            >
                                <TableCell $bold $color="#111827">
                                    {rec.checkupName}
                                </TableCell>
                                <TableCell $color="#4b5563">
                                    {rec.checkupDate}
                                </TableCell>
                                <TableCell>     </TableCell>
                                <TableCell $center>
                                    <ResultBadge $result={rec.checkupSummanary}>
                                        {summaryLabelMap[rec.checkupSummanary] ?? rec.checkupSummanary}
                                    </ResultBadge>
                                </TableCell>
                                <TableCell $right>
                                    <ActionButtonsData>
                                        {/*
                                        <ActionIconBtn
                                            onClick={(e) => { e.stopPropagation(); setSelectedRecord(rec); handleEditStart(); }}
                                            title="기록 수정"
                                        >
                                            <Edit3 size={14} />
                                        </ActionIconBtn>
                                        */}
                                        <ActionIconBtn
                                            $danger
                                            onClick={(e) => handleDelete(rec.id, e)}
                                            title="기록 삭제"
                                        >
                                            <Trash2 size={14} />
                                        </ActionIconBtn>
                                    </ActionButtonsData>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <tr>
                                <TableCell colSpan={5} $center $color="#9ca3af" style={{ padding: '5rem 1.5rem' }}>
                                    선택한 기간 및 검색 조건에 맞는 건강 기록이 없습니다.
                                </TableCell>
                            </tr>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Detail / Edit Modal */}
            {selectedRecord && (
                <ModalOverlay onClick={() => setSelectedRecord(null)}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <ModalHeader>
                            <ModalTitle>
                                <Activity size={18} color="#2563eb" />
                                {isEditing ? '기록 수정' : '건강검진 상세 내역'}
                            </ModalTitle>
                            <CloseButton onClick={() => setSelectedRecord(null)}>
                                <X size={20} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            {isEditing && editForm ? (
                                <FormSection>
                                    <FormGroup>
                                        <FormLabel>성명</FormLabel>
                                        <FormInput value={editForm.name} disabled $disabled />
                                    </FormGroup>
                                    <FormGrid>
                                        <FormGroup>
                                            <FormLabel>검진일</FormLabel>
                                            <FormInput type="date" value={editForm.lastCheck} onChange={e => setEditForm({ ...editForm, lastCheck: e.target.value })} />
                                        </FormGroup>
                                        {/* "검진 기관" field removed as per user request */}
                                    </FormGrid>
                                    <FormGroup>
                                        <FormLabel>종합 판정</FormLabel>
                                        <SelectWrapper>
                                            <FormSelect
                                                value={editForm.result}
                                                onChange={e => setEditForm({ ...editForm, result: e.target.value })}
                                            >
                                                <option value="정상 (양호)">정상 (양호)</option>
                                                <option value="정상 (경미)">정상 (경미)</option>
                                                <option value="유소견 (주의)">유소견 (주의)</option>
                                                <option value="유소견 (위험)">유소견 (위험)</option>
                                                <option value="재검 필요">재검 필요</option>
                                            </FormSelect>
                                        </SelectWrapper>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel>다음 검진 예정일</FormLabel>
                                        <FormInput type="date" value={editForm.nextCheck} onChange={e => setEditForm({ ...editForm, nextCheck: e.target.value })} />
                                    </FormGroup>
                                </FormSection>
                            ) : (
                                <>
                                    <FormGrid>
                                        <FormGroup>
                                            <FormLabel>성명</FormLabel>
                                            <InfoValue $bold $color="#111827">
                                                <User size={14} color="#6b7280" /> {selectedRecord.checkupName}
                                            </InfoValue>
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>최근 검진일</FormLabel>
                                            <InfoValue>
                                                <Calendar size={14} color="#6b7280" /> {selectedRecord.checkupDate}
                                            </InfoValue>
                                        </FormGroup>
                                    </FormGrid>

                                    <FormGrid>
                                        {/* "검진 기관" field removed from display as per user request */}
                                        <FormGroup>
                                            <FormLabel>종합 판정</FormLabel>
                                            <ResultBadge $result={selectedRecord.checkupSummanary}>
                                                {summaryLabelMap[selectedRecord.checkupSummanary] ?? selectedRecord.checkupSummanary}
                                            </ResultBadge>
                                        </FormGroup>
                                    </FormGrid>

                                    <AttachmentSection>
                                        <AttachmentHeader>
                                            <AttachmentLabel>첨부 파일</AttachmentLabel>
                                        </AttachmentHeader>
                                        <AttachmentCard>
                                            <FileContent>
                                                <FileIconWrapper>
                                                    <FileText size={20} />
                                                </FileIconWrapper>
                                                <div>
                                                    <FileName>{selectedRecord.checkupName}_건강검진결과표.pdf</FileName>
                                                    <FileSize>2.4 MB</FileSize>
                                                </div>
                                            </FileContent>
                                            <DownloadBtn title="결과지 다운로드" onClick={() => window.open(selectedRecord.checkupFileUrl, "_blank")}>
                                                <Download size={18} />
                                            </DownloadBtn>
                                        </AttachmentCard>
                                    </AttachmentSection>

                                    <Disclaimer>
                                        * 관리자는 모든 건강 정보를 확인하고 수정할 권한이 있습니다.
                                    </Disclaimer>
                                </>
                            )}
                        </ModalBody>

                        <ModalFooter $between={!isEditing}>
                            {isEditing ? (
                                <>
                                    <FooterBtn $secondary onClick={() => setIsEditing(false)}>취소</FooterBtn>
                                    <FooterBtn $primary onClick={handleSaveEdit}>변경사항 저장</FooterBtn>
                                </>
                            ) : (
                                <>
                                    <FooterBtn $danger onClick={(e) => handleDelete(selectedRecord.id, e)}>
                                        <Trash2 size={14} /> 삭제
                                    </FooterBtn>
                                    <ButtonGroup>
                                        <FooterBtn $outline onClick={handleEditStart}>수정하기</FooterBtn>
                                        <FooterBtn $primary onClick={() => setSelectedRecord(null)}>확인</FooterBtn>
                                    </ButtonGroup>
                                </>
                            )}
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
