import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, BrainCircuit, Stethoscope, Plus, Activity, User, Calendar, FileText, Download, Upload, ClipboardList } from 'lucide-react';
import {
    Container, StatGrid, StatCardWrapper, StatHeader, StatLabel, IconBox, StatValueGroup, StatValue, StatUnit, StatSubLabel,
    MainGrid, LeftSection, RightSection, SectionHeader, SectionTitleGroup, SectionTitle, SectionDesc, AddButton,
    TableContainer, Table, Thead, Th, Tbody, Tr, Td, EmptyRow, EmptyCell,
    LogList, LogItem, LogStatusBadge, LogHeader, LogCreator, LogDate, LogCategoryWrapper, LogContent, EmptyLogs,
    SurveyModalContent, StickyHeader, ScrollBody, WelcomeBox, QuestionGroup, QuestionItem, QuestionText, OptionsGrid, OptionButton, SubmitWrapper, ResultBox, ScoreDisplay, ScoreTotal, ScoreMax, ResultDescriptionBox, DescriptionHeader,
    DetailHeader, DetailBody, DetailGrid, DetailItem, DetailLabel, DetailValue, ResultBadge, FileAttachmentBox, FileInfo, FileIconWrapper, FileMeta, FileName, FileSize, DownloadButton, FootNote, CloseButtonFooter, CloseButton,
    BlueGuideBox, BlueGuideContent, BlueGuideTitle, BlueGuideText, InputGroup, InputLabel, StyledSelect, StyledInput,
    UploadArea, UploadIconWrapper, UploadText, UploadSubText
} from './Health.styled';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton as ModalCloseBtn, ModalBody,
    UploadGuideBox, GuideIcon, GuideContent, GuideTitle, GuideText,
    FormStackSpaced, Label, Select, ActionButton
} from '../../profile/modals/Modal.styled';

// PHQ-9 Survey Modal Component (Shows Completed only)
export const PhqSurveyModal = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState(0);
    const questions = [
        "기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.",
        "평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했다.",
        "잠들기가 어렵거나 자주 깼다/혹은 너무 많이 잤다.",
        "평소보다 식욕이 줄었다/혹은 평소보다 많이 먹었다.",
        "다른 사람들이 눈치 챌 정도로 평소보다 말과 행동이 느려졌다.",
        "피곤하고 기운이 없었다.",
        "내가 잘못 했거나, 실패했다는 생각이 들었다.",
        "신문을 읽거나 TV를 보는 것과 같은 일상적인 일에도 집중 할 수가 없었다.",
        "차라리 죽는 것이 더 낮겠다고 생각했다."
    ];
    const options = ["없음", "2-6일", "7-12일", "거의 매일"];
    const [answers, setAnswers] = useState(new Array(9).fill(0));

    const calculateResult = (score) => {
        if (score <= 4) {
            return {
                status: '우울아님',
                badgeText: '정상',
                badgeColor: 'bg-green-50 text-green-700 border-green-200', // Legacy classes, handled by styled prop logic or specialized component
                description: '유의한 수준의 우울감이 시사되지 않습니다.',
                icon: CheckCircle2
            };
        } else if (score <= 9) {
            return {
                status: '가벼운 우울',
                badgeText: '주의 (경미)',
                description: '다소 경미한 수준의 우울감이 있으나 일상생활에 지장을 줄 정도는 아닙니다.',
                icon: AlertTriangle
            };
        } else if (score <= 19) {
            return {
                status: '중간정도의 우울',
                badgeText: '주의',
                description: '중간정도 수준의 우울감이 시사됩니다. 전문가의 도움이 필요할 수 있습니다.',
                icon: AlertTriangle
            };
        } else {
            return {
                status: '심한 우울',
                badgeText: '위험',
                description: '심한 수준의 우울감이 시사됩니다. 전문기관의 치료적 개입과 평가가 요구됩니다.',
                icon: AlertCircle
            };
        }
    };

    const totalScore = answers.reduce((a, b) => a + b, 0);
    const resultData = calculateResult(totalScore);

    const handleSubmit = () => {
        setStep(2);
    };

    const handleFinalize = () => {
        onSubmit && onSubmit({
            date: new Date().toISOString().split('T')[0],
            score: totalScore,
            category: resultData.status,
            description: resultData.description,
            status: '확인완료'
        });
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <SurveyModalContent onClick={e => e.stopPropagation()}>
                <StickyHeader>
                    <ModalTitle>우울증 건강설문 (PHQ-9)</ModalTitle>
                    <ModalCloseBtn onClick={onClose}><X size={20} /></ModalCloseBtn>
                </StickyHeader>
                <ScrollBody>
                    {step === 0 && (
                        <WelcomeBox>
                            <h2 className="text-xl font-bold mb-2">설문을 시작할까요?</h2>
                            <p className="text-sm text-gray-500 mb-6">지난 2주간의 상태를 체크해주세요.</p>
                            <button onClick={() => setStep(1)} className="bg-black text-white px-6 py-2 rounded-lg text-sm">시작하기</button>
                        </WelcomeBox>
                    )}
                    {step === 1 && (
                        <div className="space-y-6">
                            <QuestionGroup>
                                {questions.map((q, idx) => (
                                    <QuestionItem key={idx}>
                                        <QuestionText>{idx + 1}. {q}</QuestionText>
                                        <OptionsGrid>
                                            {options.map((opt, val) => (
                                                <OptionButton
                                                    key={val}
                                                    onClick={() => {
                                                        const newAns = [...answers];
                                                        newAns[idx] = val;
                                                        setAnswers(newAns);
                                                    }}
                                                    $selected={answers[idx] === val}
                                                >
                                                    {opt}
                                                </OptionButton>
                                            ))}
                                        </OptionsGrid>
                                    </QuestionItem>
                                ))}
                            </QuestionGroup>
                            <SubmitWrapper>
                                <button onClick={handleSubmit} className="bg-black text-white px-8 py-2 rounded-lg text-sm">제출하기</button>
                            </SubmitWrapper>
                        </div>
                    )}
                    {step === 2 && (
                        <ResultBox>
                            <h2 className="text-xl font-bold mb-1">검사 결과</h2>
                            <p className="text-sm text-gray-500 mb-8">자가진단 결과는 다음과 같습니다.</p>

                            <ScoreDisplay>
                                <p className="text-xs text-gray-500 mb-2">총점</p>
                                <ScoreTotal>
                                    {totalScore} <ScoreMax>/ 27</ScoreMax>
                                </ScoreTotal>
                                <span className={`inline-block px-4 py-1.5 rounded-full border bg-white text-sm font-bold border-gray-200 text-gray-700`}>
                                    {resultData.badgeText}
                                </span>
                            </ScoreDisplay>

                            <ResultDescriptionBox>
                                <DescriptionHeader>
                                    <ClipboardList size={16} /> 결과 설명
                                </DescriptionHeader>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-bold">[{resultData.status}]</span> {resultData.description}
                                </p>
                            </ResultDescriptionBox>

                            <button onClick={handleFinalize} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                확인 완료
                            </button>
                        </ResultBox>
                    )}
                </ScrollBody>
            </SurveyModalContent>
        </ModalOverlay>
    );
};

export const CreatorHealthView = ({
    creators,
    records,
    onUpdateRecords,
    logs,
    onUpdateLogs,
    readOnly = false,
    isCreator = false
}) => {
    // Filter records
    const creatorNames = creators.map(c => c.name);
    const filteredRecords = records.filter(r => creatorNames.includes(r.name));
    const filteredLogs = logs.filter(l => creatorNames.includes(l.creator));

    // Stats
    const stats = {
        physicalNormal: filteredRecords.filter(r => r.result.includes('양호') || r.result.includes('정상')).length,
        physicalCaution: filteredRecords.filter(r => r.result.includes('주의')).length,
        physicalRisk: filteredRecords.filter(r => r.result.includes('위험')).length,
        mentalSevere: filteredLogs.filter(l =>
            l.category.includes('중등') || l.category.includes('심각') || l.status === '치료필요' || l.status === '휴식권고'
        ).length
    };

    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const [newCheckup, setNewCheckup] = useState({
        creatorName: '',
        date: new Date().toISOString().split('T')[0],
        result: '정상 (양호)'
    });

    const handleAddCheckup = () => {
        const effectiveName = isCreator ? creators[0].name : newCheckup.creatorName;
        if (!effectiveName) return alert('크리에이터를 선택해주세요.');
        if (!uploadedFile) return alert('검진 결과 PDF 파일을 업로드해주세요.');

        let score = 90;
        if (newCheckup.result.includes('주의')) score = 70;
        if (newCheckup.result.includes('위험')) score = 40;

        const newRecord = {
            id: Date.now().toString(),
            name: effectiveName,
            lastCheck: newCheckup.date,
            score: score,
            result: newCheckup.result,
            status: '업데이트됨'
        };

        const otherRecords = records.filter(r => r.name !== effectiveName);
        onUpdateRecords([newRecord, ...otherRecords]);
        setIsCheckModalOpen(false);
        setUploadedFile(null);
        alert('검진 결과가 성공적으로 등록되었습니다.');
    };

    // Helper Component for Stat Cards
    const StatCard = ({ label, value, icon: Icon, subLabel }) => (
        <StatCardWrapper>
            <StatHeader>
                <StatLabel>{label}</StatLabel>
                <IconBox>
                    <Icon size={16} className="text-black" />
                </IconBox>
            </StatHeader>
            <div>
                <StatValueGroup>
                    <StatValue>{value}</StatValue>
                    <StatUnit>명</StatUnit>
                </StatValueGroup>
                <StatSubLabel>{subLabel}</StatSubLabel>
            </div>
        </StatCardWrapper>
    );

    return (
        <Container>
            {!isCreator && (
                <StatGrid>
                    <StatCard label="정상 (양호/경미)" value={stats.physicalNormal} icon={CheckCircle2} subLabel="건강 상태가 양호한 크리에이터" />
                    <StatCard label="주의 (유소견)" value={stats.physicalCaution} icon={AlertTriangle} subLabel="추적 관찰이 필요한 크리에이터" />
                    <StatCard label="위험 (질환의심)" value={stats.physicalRisk} icon={AlertCircle} subLabel="정밀 검사가 필요한 크리에이터" />
                    <StatCard label="우울증 심각 현황" value={stats.mentalSevere} icon={BrainCircuit} subLabel="심리 상담 및 휴식이 권고된 인원" />
                </StatGrid>
            )}

            <MainGrid>
                {/* Left: General Health Checkup */}
                <LeftSection>
                    <SectionHeader>
                        <SectionTitleGroup>
                            <SectionTitle>
                                <Stethoscope size={20} color="#00C471" />
                                크리에이터 건강 현황
                            </SectionTitle>
                            <SectionDesc>정기 건강 검진 및 의료 지원 기록입니다.</SectionDesc>
                        </SectionTitleGroup>
                        {!readOnly && (
                            <AddButton onClick={() => setIsCheckModalOpen(true)}>
                                <Plus size={14} /> 검진 기록 추가
                            </AddButton>
                        )}
                    </SectionHeader>

                    <TableContainer>
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>이름</Th>
                                    <Th>최근 검진일</Th>
                                    <Th>결과 판정</Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {filteredRecords.length > 0 ? filteredRecords.map(rec => (
                                    <Tr key={rec.id} onClick={() => setSelectedRecord(rec)}>
                                        <Td>{rec.name}</Td>
                                        <Td>{rec.lastCheck}</Td>
                                        <Td>
                                            <ResultBadge $result={rec.result}>{rec.result}</ResultBadge>
                                        </Td>
                                    </Tr>
                                )) : (
                                    <EmptyRow>
                                        <EmptyCell colSpan={3}>등록된 건강 기록이 없습니다.</EmptyCell>
                                    </EmptyRow>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </LeftSection>

                {/* Right: Depression Test Status */}
                <RightSection>
                    <SectionHeader>
                        <SectionTitleGroup>
                            <SectionTitle>
                                <BrainCircuit size={20} color="#374151" />
                                우울증 검사 현황
                            </SectionTitle>
                            <SectionDesc>정기 정신 건강 검진 및 상담 기록</SectionDesc>
                        </SectionTitleGroup>
                    </SectionHeader>

                    <LogList>
                        {filteredLogs.map(log => (
                            <LogItem key={log.id}>

                                <LogHeader>
                                    <LogCreator>{log.creator}</LogCreator>
                                    <LogDate>{log.date}</LogDate>
                                </LogHeader>
                                <LogCategoryWrapper>
                                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded border bg-gray-50 border-gray-200 text-gray-700`}>
                                        {log.category}
                                    </span>
                                </LogCategoryWrapper>
                                <LogContent>
                                    <span className="text-gray-500 mr-1">[PHQ-9 자가진단]</span>
                                    {log.score !== undefined ? `총점 ${log.score}점 ` : ''}
                                    {log.description}
                                </LogContent>
                            </LogItem>
                        ))}
                        {filteredLogs.length === 0 && (
                            <EmptyLogs>기록된 검사 내역이 없습니다.</EmptyLogs>
                        )}
                    </LogList>
                </RightSection>
            </MainGrid>

            {/* Detail Modal */}
            {selectedRecord && (
                <ModalOverlay onClick={() => setSelectedRecord(null)}>
                    <SurveyModalContent onClick={e => e.stopPropagation()} $maxWidth="28rem">
                        <DetailHeader>
                            <ModalTitle>건강검진 상세 내역</ModalTitle>
                            <ModalCloseBtn onClick={() => setSelectedRecord(null)}><X size={20} /></ModalCloseBtn>
                        </DetailHeader>

                        <DetailBody>
                            <DetailGrid>
                                <DetailItem>
                                    <DetailLabel>이름</DetailLabel>
                                    <DetailValue>
                                        <User size={14} className="text-gray-500" /> {selectedRecord.name}
                                    </DetailValue>
                                </DetailItem>
                                <DetailItem>
                                    <DetailLabel>최근 검진일</DetailLabel>
                                    <DetailValue>
                                        <Calendar size={14} className="text-gray-500" /> {selectedRecord.lastCheck}
                                    </DetailValue>
                                </DetailItem>
                            </DetailGrid>

                            <DetailItem>
                                <DetailLabel>종합 판정 결과</DetailLabel>
                                <ResultBadge $result={selectedRecord.result}>{selectedRecord.result}</ResultBadge>
                            </DetailItem>

                            <FileAttachmentBox>
                                <FileInfo>
                                    <FileIconWrapper>
                                        <FileText size={20} />
                                    </FileIconWrapper>
                                    <FileMeta>
                                        <FileName>{selectedRecord.name}_건강검진결과표.pdf</FileName>
                                        <FileSize>2.4 MB</FileSize>
                                    </FileMeta>
                                </FileInfo>
                                <DownloadButton>
                                    <Download size={18} />
                                </DownloadButton>
                            </FileAttachmentBox>

                            <FootNote>
                                * 상세 수치 및 의학적 소견은 첨부된 PDF 파일에서 확인하실 수 있습니다.
                            </FootNote>
                        </DetailBody>

                        <CloseButtonFooter>
                            <CloseButton onClick={() => setSelectedRecord(null)}>닫기</CloseButton>
                        </CloseButtonFooter>
                    </SurveyModalContent>
                </ModalOverlay>
            )}

            {/* Checkup Add Modal */}
            {isCheckModalOpen && (
                <ModalOverlay onClick={() => setIsCheckModalOpen(false)}>
                    <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
                        <ModalHeader>
                            <ModalTitle>검진 결과 등록</ModalTitle>
                            <ModalCloseBtn onClick={() => setIsCheckModalOpen(false)}><X size={20} /></ModalCloseBtn>
                        </ModalHeader>
                        <ModalBody>
                            <UploadGuideBox>
                                <GuideIcon>
                                    <FileText size={24} />
                                </GuideIcon>
                                <GuideContent>
                                    <GuideTitle>결과지 업로드 안내</GuideTitle>
                                    <GuideText>
                                        병원에서 발급받은 건강검진 결과표(PDF)를 업로드하여 DB에 저장합니다.<br />
                                        인사/운영팀 건강 관리 리스트에 자동 업데이트 됩니다.
                                    </GuideText>
                                </GuideContent>
                            </UploadGuideBox>

                            <FormStackSpaced>
                                {!isCreator && (
                                    <div>
                                        <Label>대상 크리에이터 선택</Label>
                                        <Select
                                            value={newCheckup.creatorName}
                                            onChange={e => setNewCheckup({ ...newCheckup, creatorName: e.target.value })}
                                        >
                                            <option value="">선택하세요</option>
                                            {creators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </Select>
                                    </div>
                                )}

                                <div>
                                    <Label>최근 검진일</Label>
                                    <StyledInput
                                        type="date"
                                        value={newCheckup.date}
                                        onChange={e => setNewCheckup({ ...newCheckup, date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label>종합 판정 상태 선택</Label>
                                    <Select
                                        value={newCheckup.result}
                                        onChange={e => setNewCheckup({ ...newCheckup, result: e.target.value })}
                                    >
                                        <option value="정상 (양호)">정상 (A/B) - 양호</option>
                                        <option value="정상 (경미)">정상 (B) - 경미한 소견</option>
                                        <option value="유소견 (주의)">주의 (식생활 습관 개선 필요)</option>
                                        <option value="유소견 (위험)">위험 (질환 의심/치료 필요)</option>
                                        <option value="재검">재검 필요</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label>결과 파일 업로드</Label>
                                    <input
                                        id="file-upload-creator"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        style={{ display: 'none' }}
                                        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                    />
                                    <UploadArea
                                        onClick={() => document.getElementById('file-upload-creator')?.click()}
                                        $hasFile={!!uploadedFile}
                                    >
                                        <UploadIconWrapper $hasFile={!!uploadedFile}>
                                            {uploadedFile ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                        </UploadIconWrapper>
                                        {uploadedFile ? (
                                            <>
                                                <UploadText>{uploadedFile.name}</UploadText>
                                                <UploadSubText className="text-green-600">업로드 완료</UploadSubText>
                                            </>
                                        ) : (
                                            <>
                                                <UploadText>PDF 파일을 드래그하거나 클릭하여 업로드</UploadText>
                                                <UploadSubText>최대 10MB</UploadSubText>
                                            </>
                                        )}
                                    </UploadArea>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <ActionButton onClick={handleAddCheckup} style={{ width: '100%', justifyContent: 'center' }}>
                                        <CheckCircle2 size={16} /> 저장하기
                                    </ActionButton>
                                </div>
                            </FormStackSpaced>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};
