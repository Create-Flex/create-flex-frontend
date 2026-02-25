import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download, X, Search } from 'lucide-react';
import contractService from '../../api/contractService';
import { renderPlatformIcon } from '../components/shared/utils';
import { creatorService } from '../../api/creatorService';
import { useCreatorStore } from '../../model/useCreatorStore';
import { mapCreatorFromBackend } from '../../../../shared/utils/creatorMapper';
import {
    Container, ContentArea, Header, Title, SubTitle, AddButton,
    ControlBar, SearchGroup, SearchWrapper, SearchIconWrapper, SearchInput, Divider, CountText, SearchButton,
    ContractList, ContractCard, CardLeft, IconBox,
    ContractInfo, ContractName, MetaInfo, MetaText, Dot,
    ActionArea, DownloadButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton,
    ModalBody, InputGroup, Label, Input, GridContainer,
    ModalFooter, FooterButton
} from './ContractManagement.styled';

export const ContractManagement = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractForm, setContractForm] = useState({
        contract_name: '',
        creator_name: '',
        contract_start: '',
        contract_end: '',
        file: null
    });
    const [searchQuery, setSearchQuery] = useState('');

    // 계약 목록 조회
    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async (name = searchQuery) => {
        try {
            setLoading(true);
            const data = await contractService.getAllContracts(name);
            setContracts(data);
        } catch (error) {
            console.error('계약 목록 조회 실패:', error);
            toast.error('계약 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 실행 함수
    const handleSearch = () => {
        fetchContracts(searchQuery.trim());
    };

    // 엔터키 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 계약서 등록
    const handleContractSubmit = async () => {
        // 필수 항목 검증
        if (!contractForm.contract_name || !contractForm.creator_name) {
            toast.error('계약서 제목과 크리에이터 이름은 필수입니다.');
            return;
        }

        if (!contractForm.contract_start || !contractForm.contract_end) {
            toast.error('계약 시작일과 종료일을 입력해주세요.');
            return;
        }

        // 날짜 유효성 검증
        if (new Date(contractForm.contract_start) > new Date(contractForm.contract_end)) {
            toast.error('계약 시작일이 종료일보다 늦을 수 없습니다.');
            return;
        }

        try {
            setLoading(true);

            // FormData 생성
            const formData = new FormData();

            // 메타데이터를 JSON 객체로 구성
            const requestData = {
                contract_name: contractForm.contract_name,
                creator_name: contractForm.creator_name,
                contract_start: contractForm.contract_start,
                contract_end: contractForm.contract_end
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            if (contractForm.file) {
                formData.append('file', contractForm.file);
            }

            const response = await contractService.createContract(formData);

            // S3에 실제 파일 업로드
            if (response.presigned_url && contractForm.file) {
                await contractService.uploadFileToS3(contractForm.file, response.presigned_url);
            }

            toast.success('계약서가 성공적으로 등록되었습니다.');

            // 폼 초기화 및 모달 닫기
            handleCloseModal();

            // 목록 새로고침
            fetchContracts();
        } catch (error) {
            console.error('계약 등록 실패:', error);
            const errorMessage = error.response?.data?.message || '계약 등록에 실패했습니다.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsContractModalOpen(false);
        setContractForm({
            contract_name: '',
            creator_name: '',
            contract_start: '',
            contract_end: '',
            file: null
        });
    };

    // 계약서 다운로드
    const handleDownload = (e, contractFileUrl) => {
        e.stopPropagation();
        if (!contractFileUrl) {
            toast.error('다운로드할 파일이 없습니다.');
            return;
        }

        // 새 창에서 URL 열기 (다운로드)
        window.open(contractFileUrl, '_blank');
    };

    // 계약 상태 확인
    const getContractStatus = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today < start) return '예정';
        if (today > end) return '종료';
        return '진행중';
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/-/g, '.');
    };

    return (
        <Container>
            <ContentArea>
                <Header>
                    <div>
                        <Title>계약 문서 현황</Title>
                        <SubTitle>전속 계약 및 광고 계약 문서를 통합 관리합니다.</SubTitle>
                    </div>
                </Header>

                <ControlBar>
                    <SearchGroup>
                        <SearchWrapper>
                            <SearchIconWrapper>
                                <Search size={14} />
                            </SearchIconWrapper>
                            <SearchInput
                                type="text"
                                placeholder="크리에이터 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </SearchWrapper>
                        <SearchButton onClick={handleSearch}>
                            검색
                        </SearchButton>
                        <Divider />
                        <CountText>총 {contracts.length}건</CountText>
                    </SearchGroup>
                    <AddButton onClick={() => setIsContractModalOpen(true)}>
                        + 새 계약서 작성
                    </AddButton>
                </ControlBar>

                {loading && contracts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                        로딩중...
                    </div>
                ) : contracts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                        등록된 계약서가 없습니다.
                    </div>
                ) : (
                    <ContractList>
                        {contracts.map(contract => (
                            <ContractCard key={contract.contract_id}>
                                <CardLeft>
                                    <IconBox onClick={(e) => handleDownload(e, contract.contract_file_url)}>
                                        <FileText size={20} />
                                    </IconBox>
                                    <ContractInfo>
                                        <ContractName onClick={(e) => handleDownload(e, contract.contract_file_url)}>
                                            {contract.contract_name}
                                        </ContractName>
                                        <MetaInfo>
                                            <MetaText>
                                                {formatDate(contract.contract_start)} ~ {formatDate(contract.contract_end)}
                                            </MetaText>
                                            <Dot />
                                            <span>{contract.creator_name}</span>
                                            <Dot />
                                            <span
                                                style={{
                                                    color: getContractStatus(contract.contract_start, contract.contract_end) === '진행중'
                                                        ? '#00C853'
                                                        : getContractStatus(contract.contract_start, contract.contract_end) === '예정'
                                                            ? '#2196F3'
                                                            : '#999'
                                                }}
                                            >
                                                {getContractStatus(contract.contract_start, contract.contract_end)}
                                            </span>
                                        </MetaInfo>
                                    </ContractInfo>
                                </CardLeft>

                                <ActionArea>
                                    <DownloadButton
                                        title="다운로드"
                                        onClick={(e) => handleDownload(e, contract.contract_file_url)}
                                        disabled={!contract.contract_file_url}
                                        style={{
                                            opacity: contract.contract_file_url ? 1 : 0.3,
                                            cursor: contract.contract_file_url ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        <Download size={18} />
                                    </DownloadButton>
                                </ActionArea>
                            </ContractCard>
                        ))}
                    </ContractList>
                )}
            </ContentArea>

            {/* Contract Upload Modal */}
            {isContractModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>새 계약서 등록</ModalTitle>
                            <CloseButton onClick={handleCloseModal}>
                                <X size={20} />
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <InputGroup>
                                <Label>계약서 제목 *</Label>
                                <Input
                                    placeholder="예: 겜돌이 표준 전속 계약서"
                                    value={contractForm.contract_name}
                                    onChange={e => setContractForm({
                                        ...contractForm,
                                        contract_name: e.target.value
                                    })}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>크리에이터 이름 *</Label>
                                <Input
                                    placeholder="크리에이터 이름 입력"
                                    value={contractForm.creator_name}
                                    onChange={e => setContractForm({
                                        ...contractForm,
                                        creator_name: e.target.value
                                    })}
                                />
                            </InputGroup>
                            <GridContainer>
                                <InputGroup>
                                    <Label>계약 시작일 *</Label>
                                    <Input
                                        type="date"
                                        value={contractForm.contract_start}
                                        max="9999-12-31"
                                        onChange={e => setContractForm({
                                            ...contractForm,
                                            contract_start: e.target.value
                                        })}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>계약 종료일 *</Label>
                                    <Input
                                        type="date"
                                        value={contractForm.contract_end}
                                        max="9999-12-31"
                                        onChange={e => setContractForm({
                                            ...contractForm,
                                            contract_end: e.target.value
                                        })}
                                    />
                                </InputGroup>
                            </GridContainer>
                            <InputGroup>
                                <Label>계약서 파일 업로드 (선택)</Label>
                                <Input
                                    type="file"
                                    onChange={e => setContractForm({
                                        ...contractForm,
                                        file: e.target.files[0]
                                    })}
                                />
                                <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                                    * 계약서 파일을 업로드해 주세요 (PDF, 이미지 등)
                                </div>
                            </InputGroup>
                        </ModalBody>
                        <ModalFooter>
                            <FooterButton onClick={handleCloseModal} disabled={loading}>
                                취소
                            </FooterButton>
                            <FooterButton
                                $primary
                                onClick={handleContractSubmit}
                                disabled={loading}
                            >
                                {loading ? '등록중...' : '등록하기'}
                            </FooterButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};