import React, { useRef } from 'react';
import { X, Upload } from 'lucide-react';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, ModalBody, PrimaryButton,
    ImageGrid, ImageOptimized, ImageEl, AvatarUploadWrapper, CurrentAvatar, HelperText
} from './Modal.styled';

const MOCK_COVER_IMAGES = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
];

export const ImageUploadModal = ({
    isOpen,
    onClose,
    type, // 'cover' or 'avatar'
    currentImage,
    onImageSelect,
    onImageUpload
}) => {
    const fileInputRef = useRef(null);

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>
                        {type === 'cover' ? '커버 이미지 변경' : '프로필 사진 변경'}
                    </ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    {type === 'cover' ? (
                        <ImageGrid>
                            {MOCK_COVER_IMAGES.map((url, i) => (
                                <ImageOptimized
                                    key={i}
                                    onClick={() => onImageSelect(url)}
                                >
                                    <ImageEl src={url} alt={`Cover ${i}`} />
                                </ImageOptimized>
                            ))}
                        </ImageGrid>
                    ) : (
                        <AvatarUploadWrapper>
                            <CurrentAvatar>
                                <ImageEl src={currentImage} alt="Current" />
                            </CurrentAvatar>
                            <PrimaryButton onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} /> 사진 업로드
                            </PrimaryButton>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                style={{ display: 'none' }}
                            />
                            <HelperText>JPG, PNG 파일 (최대 5MB)</HelperText>
                        </AvatarUploadWrapper>
                    )}
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};
