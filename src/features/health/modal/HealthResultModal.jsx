import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { X, FileText, Upload, Check, Loader2 } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, ModalBody,
    UploadGuideBox, GuideIcon, GuideContent, GuideTitle, GuideText,
    FormStackSpaced, Label, Select, ActionButton,
    UploadArea, UploadIconWrapper, UploadText, UploadSubText
} from '../style/Modal.styled';
import { Input } from '../style/ProfileInfo.styled';
import { analyzeHealthCheckupImage } from '../api/healthService';
export const HealthResultModal = ({
    isOpen,
    onClose,
    onUpload
}) => {

    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summanary, setSummanary] = useState('NORMAL_AB');
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('파일 크기는 10MB를 초과할 수 없습니다.');
                return;
            }
            setFile(selectedFile);

            //AI 분석 시작
            setIsAnalyzing(true);
            const loadingToast = toast.loading('AI가 검진 결과를 분석 중입니다...');

            try {
                const response = await analyzeHealthCheckupImage(selectedFile);
                const result = response.data;

                // 검진일 자동 입력
                if (result.examinationDate && result.examinationDate !== '알 수 없음') {
                    setDate(result.examinationDate);
                }

                // 검진명 자동 생성 (예: 2024년 건강검진 (서울대학교병원))
                if (result.hospitalName) {
                    const year = result.examinationDate ? result.examinationDate.split('-')[0] : new Date().getFullYear();
                    setName(`${year}년 건강검진 (${result.hospitalName})`);
                } else {
                    setName(`${new Date().getFullYear()}년 정기 건강검진`);
                }

                // 종합 소견 처리
                // AI 결과값에 따라 Select 박스 값을 매핑하거나, 토스트로 알려줌
                if (result.overallResult) {
                    toast.success(`분석 결과: ${result.overallResult}`, { duration: 5000 });
                    
                    // 간단한 매핑 로직 (AI 응답 텍스트에 포함된 단어로 추측)
                    const resLower = result.overallResult;
                    if (resLower.includes("정상")) {
                        if (resLower.includes("B") || resLower.includes("경미")) setSummanary("NORMAL_B");
                        else setSummanary("NORMAL_AB");
                    } else if (resLower.includes("주의") || resLower.includes("식생활")) {
                        setSummanary("CAUTION");
                    } else if (resLower.includes("위험") || resLower.includes("질환")) {
                        setSummanary("DANGER");
                    } else if (resLower.includes("재검")) {
                        setSummanary("RETEST_NEED");
                    }
                }

                toast.success('검진 정보를 자동으로 입력했습니다!', { id: loadingToast });

            } catch (error) {
                console.error("AI Analysis Error:", error);
                toast.error('이미지 분석에 실패했습니다. 직접 입력해주세요.', { id: loadingToast });
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    const triggerFileInput = () => {
        if (!isAnalyzing) {
            fileInputRef.current?.click();
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error('검진 명을 입력해주세요.');
            return;
        }
        if (!date) {
            toast.error('검진일을 선택해주세요.');
            return;
        }
        if (!file) {
            toast.error('검진 결과 파일(PDF)을 업로드해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("date", date);
        formData.append("summanary", summanary);
        formData.append("file", file);

        onUpload(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
                <ModalHeader>
                    <ModalTitle>검진 결과 등록</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <UploadGuideBox>
                        <GuideIcon>
                            <FileText size={24} />
                        </GuideIcon>
                        <GuideContent>
                            <GuideTitle>결과지 업로드 안내</GuideTitle>
                            <GuideText>
                                병원에서 발급받은 건강검진 결과표 이미지를 업로드하세요.<br />
                                <strong>AI가 내용을 분석하여 자동으로 입력해줍니다.</strong>
                            </GuideText>
                        </GuideContent>
                    </UploadGuideBox>

                    <FormStackSpaced>
                        <div>
                            <Label>검진 명</Label>
                            <Input
                                type="text"
                                placeholder={isAnalyzing ? "분석 중..." : "예: 2026년 정기 건강검진"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isAnalyzing}
                            />
                        </div>

                        <div>
                            <Label>최근 검진일</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={isAnalyzing}
                            />
                        </div>

                        <div>
                            <Label>종합 판정 상태 선택</Label>
                            <Select
                                value={summanary}
                                onChange={(e) => setSummanary(e.target.value)}
                                disabled={isAnalyzing}
                            >
                                <option value="NORMAL_AB">정상 (A/B) - 양호</option>
                                <option value="NORMAL_B">정상 (B) - 경미한 소견</option>
                                <option value="CAUTION">주의 (식생활 습관 개선 필요)</option>
                                <option value="DANGER">위험 (질환 의심/치료 필요)</option>
                                <option value="RETEST_NEED">재검 필요</option>
                            </Select>
                        </div>

                        <div>
                            <Label>결과 파일 업로드</Label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                style={{ display: 'none' }}
                                disabled={isAnalyzing}
                            />
                            <UploadArea 
                                onClick={triggerFileInput} 
                                $hasFile={!!file}
                                style={{ cursor: isAnalyzing ? 'wait' : 'pointer' }}
                            >
                                <UploadIconWrapper $hasFile={!!file}>
                                    {isAnalyzing ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : file ? (
                                        <Check size={24} />
                                    ) : (
                                        <Upload size={24} />
                                    )}
                                </UploadIconWrapper>
                                {isAnalyzing ? (
                                    <>
                                        <UploadText>AI 분석 중...</UploadText>
                                        <UploadSubText>잠시만 기다려주세요</UploadSubText>
                                    </>
                                ) : file ? (
                                    <>
                                        <UploadText>{file.name}</UploadText>
                                        <UploadSubText className="text-green-600">업로드 및 분석 완료</UploadSubText>
                                    </>
                                ) : (
                                    <>
                                        <UploadText>파일을 드래그하거나 클릭하여 업로드</UploadText>
                                        <UploadSubText>이미지 자동 분석 (최대 10MB)</UploadSubText>
                                    </>
                                )}
                            </UploadArea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <ActionButton 
                                onClick={handleSubmit} 
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={isAnalyzing}
                            >
                                <Check size={16} style={{ marginRight: '8px' }} />
                                저장하기
                            </ActionButton>
                        </div>
                    </FormStackSpaced>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};