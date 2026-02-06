import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { X, FileText, Upload, Check } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, ModalBody,
    UploadGuideBox, GuideIcon, GuideContent, GuideTitle, GuideText,
    FormStackSpaced, Label, Select, ActionButton,
    UploadArea, UploadIconWrapper, UploadText, UploadSubText
} from './Modal.styled';
import { Input } from '../ProfileInfo.styled';

export const HealthResultModal = ({
    isOpen,
    onClose,
    onUpload
}) => {

    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summanary, setSummanary] = useState('NORMAL_AB');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('파일 크기는 10MB를 초과할 수 없습니다.');
                return;
            }
            setFile(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
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
                                병원에서 발급받은 건강검진 결과표(PDF)를 업로드하여 DB에 저장합니다.<br />
                                인사/운영팀 건강 관리 리스트에 자동 업데이트 됩니다.
                            </GuideText>
                        </GuideContent>
                    </UploadGuideBox>

                    <FormStackSpaced>
                        <div>
                            <Label>검진 명</Label>
                            <Input
                                type="text"
                                placeholder="예: 2026년 정기 건강검진"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>최근 검진일</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>종합 판정 상태 선택</Label>
                            <Select
                                value={summanary}
                                onChange={(e) => setSummanary(e.target.value)}
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
                            />
                            <UploadArea onClick={triggerFileInput} $hasFile={!!file}>
                                <UploadIconWrapper $hasFile={!!file}>
                                    {file ? <Check size={24} /> : <Upload size={24} />}
                                </UploadIconWrapper>
                                {file ? (
                                    <>
                                        <UploadText>{file.name}</UploadText>
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
                            <ActionButton onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>
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
