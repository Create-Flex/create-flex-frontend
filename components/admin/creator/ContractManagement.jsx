import React, { useState, useRef } from 'react';
import { FileText, Download, Upload, X } from 'lucide-react';
import {
    Container, ContentArea, Header, Title, SubTitle, AddButton,
    ContractList, ContractCard, CardLeft, IconBox,
    ContractInfo, ContractName, MetaInfo, MetaText, Dot,
    ActionArea, DownloadButton,
    ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton,
    ModalBody, InputGroup, Label, Input, GridContainer, UploadBox, FileName,
    ModalFooter, FooterButton
} from './ContractManagement.styled';

export const ContractManagement = ({ creators }) => {
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractForm, setContractForm] = useState({
        title: '',
        creatorName: '',
        startDate: '',
        endDate: ''
    });
    const fileContractInputRef = useRef(null);
    const [contractFile, setContractFile] = useState(null);

    const handleContractSubmit = () => {
        if (!contractForm.title || !contractForm.creatorName) {
            alert('필수 정보를 입력해주세요.');
            return;
        }
        alert('계약서가 성공적으로 등록되었습니다.');
        setIsContractModalOpen(false);
        setContractForm({ title: '', creatorName: '', startDate: '', endDate: '' });
        setContractFile(null);
    };

    return (
        <Container>
            <ContentArea>
                <Header>
                    <div>
                        <Title>계약 문서 현황</Title>
                        <SubTitle>전속 계약 및 광고 계약 문서를 통합 관리합니다.</SubTitle>
                    </div>
                    <AddButton onClick={() => setIsContractModalOpen(true)}>
                        + 새 계약서 작성
                    </AddButton>
                </Header>

                <ContractList>
                    {creators.map(creator => (
                        <ContractCard key={creator.id}>
                            <CardLeft>
                                <IconBox>
                                    <FileText size={20} />
                                </IconBox>
                                <ContractInfo>
                                    <ContractName>
                                        {creator.name} 표준 전속 계약서
                                    </ContractName>
                                    <MetaInfo>
                                        <MetaText>
                                            {creator.managementStartDate && creator.managementEndDate
                                                ? `${creator.managementStartDate} ~ ${creator.managementEndDate}`
                                                : '기간 미설정'}
                                        </MetaText>
                                        <Dot />
                                        <span>{creator.channelName}</span>
                                    </MetaInfo>
                                </ContractInfo>
                            </CardLeft>

                            <ActionArea>
                                <DownloadButton title="다운로드">
                                    <Download size={18} />
                                </DownloadButton>
                            </ActionArea>
                        </ContractCard>
                    ))}
                </ContractList>
            </ContentArea>

            {/* Contract Upload Modal */}
            {isContractModalOpen && (
                <ModalOverlay onClick={() => setIsContractModalOpen(false)}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>새 계약서 등록</ModalTitle>
                            <CloseButton onClick={() => setIsContractModalOpen(false)}>
                                <X size={20} />
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <InputGroup>
                                <Label>계약서 제목</Label>
                                <Input
                                    placeholder="예: 겜돌이 표준 전속 계약서"
                                    value={contractForm.title}
                                    onChange={e => setContractForm({ ...contractForm, title: e.target.value })}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>크리에이터 이름</Label>
                                <Input
                                    placeholder="크리에이터 이름 입력"
                                    value={contractForm.creatorName}
                                    onChange={e => setContractForm({ ...contractForm, creatorName: e.target.value })}
                                />
                            </InputGroup>
                            <GridContainer>
                                <InputGroup>
                                    <Label>계약 시작일</Label>
                                    <Input
                                        type="date"
                                        value={contractForm.startDate}
                                        onChange={e => setContractForm({ ...contractForm, startDate: e.target.value })}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Label>계약 종료일</Label>
                                    <Input
                                        type="date"
                                        value={contractForm.endDate}
                                        onChange={e => setContractForm({ ...contractForm, endDate: e.target.value })}
                                    />
                                </InputGroup>
                            </GridContainer>
                            <InputGroup>
                                <Label>계약서 파일 첨부</Label>
                                <UploadBox onClick={() => fileContractInputRef.current?.click()}>
                                    <Upload size={20} style={{ marginBottom: '0.5rem' }} />
                                    <FileName>{contractFile ? contractFile.name : '파일을 선택하세요 (PDF)'}</FileName>
                                    <input
                                        type="file"
                                        ref={fileContractInputRef}
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                </UploadBox>
                            </InputGroup>
                        </ModalBody>
                        <ModalFooter>
                            <FooterButton onClick={() => setIsContractModalOpen(false)}>취소</FooterButton>
                            <FooterButton $primary onClick={handleContractSubmit}>등록하기</FooterButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
        </Container>
    );
};
