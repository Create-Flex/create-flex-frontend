import React from 'react';
import { CalendarIcon, X, User, Tag, FileText, DollarSign, Briefcase } from 'lucide-react';
import { getCreatorColorStyles } from '../../components/shared/utils';
import {
    ModalOverlay, CloseButton,
    SecondaryButton, DangerButton
} from '../../../../../shared/ui/Modal.styled';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const DetailContainer = styled.div`
    width: 100%;
    max-width: 32rem; /* Wider for better layout */
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${fadeIn} 0.2s ease-out;
`;

const ColorBar = styled.div`
    height: 0.75rem;
    width: 100%;
`;

const ContentWrapper = styled.div`
    padding: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
`;

const TitleSection = styled.div`
    flex: 1;
    margin-right: 1rem;
`;

const Title = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.3;
`;

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
    flex-wrap: wrap;
`;

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: ${props => props.$bgColor || '#eff6ff'};
    color: ${props => props.$color || '#3b82f6'};
`;

const DetailSection = styled.div`
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const SectionTitle = styled.h4`
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const DetailRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
`;

const Label = styled.div`
    width: 4rem;
    font-size: 0.875rem;
    color: #6b7280;
    flex-shrink: 0;
    padding-top: 0.125rem;
`;

const Value = styled.div`
    flex: 1;
    font-size: 0.875rem;
    color: #111827;
    line-height: 1.5;
`;

const CreatorChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.375rem 0.75rem 0.375rem 0.375rem;
    border-radius: 9999px;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
`;

const CreatorAvatar = styled.div`
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background-color: #e5e7eb;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ContentBox = styled.div`
    background-color: #f9fafb;
    border-radius: 0.75rem;
    padding: 1rem;
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.6;
    white-space: pre-wrap;
    border: 1px solid #f3f4f6;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
    justify-content: flex-end;
`;

export const EventDetailModal = ({
    event,
    onClose,
    onDelete,
    onEdit,
    creators = []
}) => {
    if (!event) return null;

    const getColor = (className) => {
        const colors = {
            'bg-blue-500': '#3b82f6',
            'bg-green-500': '#22c55e',
            'bg-purple-500': '#a855f7',
            'bg-orange-500': '#f97316',
            'bg-pink-500': '#ec4899',
            'bg-red-500': '#ef4444',
            'bg-yellow-500': '#eab308',
            'bg-teal-500': '#14b8a6',
            'bg-indigo-500': '#6366f1',
            'bg-cyan-500': '#06b6d4',
            'bg-gray-500': '#6b7280'
        };
        return colors[className] || '#3b82f6';
    };

    const colorStyles = getCreatorColorStyles(event.creatorId);
    const colorClass = colorStyles && colorStyles.dot ? colorStyles.dot : 'bg-blue-500';
    const barColor = getColor(colorClass);

    // Host & Partners Logic
    const hostId = event.hostCreatorId || event.creatorId;
    const hostCreator = creators.find(c => c.id === hostId);

    // Combine all potential participants: those in partnerCreators list + the event owner themselves
    const allInvolvedIds = new Set([...(event.partnerCreators || []), event.creatorId]);
    allInvolvedIds.delete(hostId); // Remove host from participants list

    const partnerIds = Array.from(allInvolvedIds);
    const partnerCreators = partnerIds.map(id => creators.find(c => c.id === id)).filter(Boolean);

    const isJoint = event.type === 'joint' || partnerCreators.length > 0;

    // Event Type Badge Logic
    const getEventTypeInfo = (type, title) => {
        if (title.startsWith('[광고]')) return { label: '광고 캠페인', color: '#059669', bg: '#ecfdf5', icon: <DollarSign size={12} /> };
        switch (type) {
            case 'content': return { label: '콘텐츠', color: '#2563eb', bg: '#eff6ff', icon: <FileText size={12} /> };
            case 'promotion': return { label: '광고 캠페인', color: '#059669', bg: '#ecfdf5', icon: <DollarSign size={12} /> };
            case 'live': return { label: '라이브', color: '#db2777', bg: '#fdf2f8', icon: <Tag size={12} /> };
            case 'meeting': return { label: '미팅', color: '#d97706', bg: '#fffbeb', icon: <Briefcase size={12} /> };
            case 'joint':
            case 'merge': return { label: '합방', color: '#7c3aed', bg: '#f5f3ff', icon: <User size={12} /> };
            default: return { label: '기타', color: '#4b5563', bg: '#f3f4f6', icon: <Tag size={12} /> };
        }
    };

    const typeInfo = getEventTypeInfo(event.type, event.title);

    // Content Parsing for Ads
    const parseContent = (content) => {
        if (!content) return { description: '' };

        const lines = content.split('\n');
        const parsed = { description: [] };

        lines.forEach(line => {
            if (line.startsWith('광고주:')) parsed.advertiser = line.replace('광고주:', '').trim();
            else if (line.startsWith('예산:')) parsed.budget = line.replace('예산:', '').trim();
            else if (line.startsWith('내용:')) parsed.description.push(line.replace('내용:', '').trim());
            else if (line.startsWith('주최:')) return; // handled by logic
            else parsed.description.push(line);
        });

        parsed.description = parsed.description.join('\n');
        return parsed;
    };

    const parsedContent = parseContent(event.content);

    return (
        <ModalOverlay onClick={onClose}>
            <DetailContainer onClick={e => e.stopPropagation()}>
                <ColorBar style={{ backgroundColor: barColor }} />
                <ContentWrapper>
                    <Header>
                        <TitleSection>
                            <MetaRow style={{ marginBottom: '0.5rem' }}>
                                <Badge $bgColor={typeInfo.bg} $color={typeInfo.color}>
                                    {typeInfo.icon}
                                    <span style={{ marginLeft: '4px' }}>{typeInfo.label}</span>
                                </Badge>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CalendarIcon size={14} />
                                    {event.date}
                                </span>
                            </MetaRow>
                            <Title>{event.title}</Title>
                        </TitleSection>
                        <CloseButton onClick={onClose}>
                            <X size={20} />
                        </CloseButton>
                    </Header>

                    {/* Creator Info Section */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* 작성자 표시 */}
                        {event.writerName && (
                            <CreatorChip>
                                <CreatorAvatar>
                                    <User size={14} />
                                </CreatorAvatar>
                                <span>{event.writerName}</span>
                                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 'normal' }}>작성자</span>
                            </CreatorChip>
                        )}

                        {/* 합방 참여자 표시 (visitorNames가 있을 때만) */}
                        {event.visitorNames && event.visitorNames.length > 0 && event.visitorNames.map((name, index) => (
                            <CreatorChip key={index}>
                                <CreatorAvatar>
                                    <User size={14} color="#6b7280" />
                                </CreatorAvatar>
                                <span>{name}</span>
                                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 'normal' }}>참여</span>
                            </CreatorChip>
                        ))}
                    </div>

                    {/* Detailed Info Section */}
                    <DetailSection>
                        {(parsedContent.advertiser || parsedContent.budget) && (
                            <div>
                                <SectionTitle><DollarSign size={16} /> 캠페인 정보</SectionTitle>
                                {parsedContent.advertiser && (
                                    <DetailRow>
                                        <Label>광고주</Label>
                                        <Value>{parsedContent.advertiser}</Value>
                                    </DetailRow>
                                )}
                                {parsedContent.budget && (
                                    <DetailRow>
                                        <Label>예산</Label>
                                        <Value style={{ color: '#059669', fontWeight: '600' }}>{parsedContent.budget}</Value>
                                    </DetailRow>
                                )}
                            </div>
                        )}

                        <div>
                            <SectionTitle><FileText size={16} /> 상세 내용</SectionTitle>
                            <ContentBox>
                                {parsedContent.description || '상세 내용이 없습니다.'}
                            </ContentBox>
                        </div>
                    </DetailSection>

                    <ButtonGroup>
                        {/* 매니저가 생성한 일정만 삭제 가능 */}
                        {onDelete && event.isManagerCreated && (
                            <DangerButton onClick={() => onDelete(event.id)}>
                                삭제하기
                            </DangerButton>
                        )}
                        {/* 매니저가 생성한 일정만 수정 가능 */}
                        {onEdit && event.isManagerCreated && (
                            <SecondaryButton onClick={() => onEdit(event)} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                                수정하기
                            </SecondaryButton>
                        )}
                        {/* 수정 권한이 없거나, 단순히 닫기용 */}
                        {(!onEdit || !event.isManagerCreated) && (
                            <SecondaryButton onClick={onClose} style={{ backgroundColor: '#111827', color: 'white', border: 'none' }}>
                                확인
                            </SecondaryButton>
                        )}
                    </ButtonGroup>
                </ContentWrapper>
            </DetailContainer>
        </ModalOverlay>
    );
};
