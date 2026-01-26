import React from 'react';
import { CalendarIcon, X, User } from 'lucide-react';
import { getCreatorColorStyles } from '../../creator/shared/utils';
import {
    ModalOverlay, CloseButton,
    SecondaryButton, DangerButton
} from './Modal.styled';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const DetailContainer = styled.div`
    width: 100%;
    max-width: 28rem; /* slightly wider */
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${fadeIn} 0.2s ease-out;
`;

const ColorBar = styled.div`
    height: 0.5rem;
    width: 100%;
`;

const ContentWrapper = styled.div`
    padding: 1.5rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
`;

const Title = styled.h3`
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
`;

const DateText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.25rem;
`;

const DetailSection = styled.div`
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const DetailRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
`;

const DetailLabel = styled.div`
    width: 5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
    flex-shrink: 0;
    padding-top: 0.25rem;
`;

const DetailValue = styled.div`
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const CreatorChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #374151;
`;

const CreatorAvatar = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    background-color: #e5e7eb;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
`;

const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const ContentBox = styled.div`
    padding: 1rem;
    background-color: rgba(249, 250, 251, 0.5);
    border-radius: 0.75rem;
    border: 1px solid #f3f4f6;
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.625;
    white-space: pre-wrap;
    margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const EventDetailModal = ({
    event,
    onClose,
    onDelete,
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
        return colors[className] || '#3b82f6'; // Default blue
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

    return (
        <ModalOverlay onClick={onClose}>
            <DetailContainer onClick={e => e.stopPropagation()}>
                <ColorBar style={{ backgroundColor: barColor }} />
                <ContentWrapper>
                    <Header>
                        <div style={{ overflow: 'hidden' }}>
                            <Title title={event.title}>{event.title}</Title>
                            <DateText>
                                <CalendarIcon size={14} /> {event.date}
                            </DateText>
                        </div>
                        <CloseButton onClick={onClose}>
                            <X size={20} />
                        </CloseButton>
                    </Header>

                    {isJoint && (
                        <DetailSection>
                            <DetailRow>
                                <DetailLabel>주최</DetailLabel>
                                <DetailValue>
                                    {hostCreator ? (
                                        <CreatorChip>
                                            <CreatorAvatar>
                                                {hostCreator.avatarUrl ? <AvatarImg src={hostCreator.avatarUrl} /> : <User size={12} />}
                                            </CreatorAvatar>
                                            {hostCreator.name}
                                        </CreatorChip>
                                    ) : (
                                        <span className="text-sm text-gray-500">알 수 없음</span>
                                    )}
                                </DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>참여</DetailLabel>
                                <DetailValue>
                                    {partnerCreators.length > 0 ? partnerCreators.map(p => (
                                        <CreatorChip key={p.id}>
                                            <CreatorAvatar>
                                                {p.avatarUrl ? <AvatarImg src={p.avatarUrl} /> : <User size={12} />}
                                            </CreatorAvatar>
                                            {p.name}
                                        </CreatorChip>
                                    )) : (
                                        <span className="text-sm text-gray-500">-</span>
                                    )}
                                </DetailValue>
                            </DetailRow>
                        </DetailSection>
                    )}

                    <ContentBox>
                        {(() => {
                            const content = event.content || '';
                            if (content.startsWith('주최:') && content.includes('\n내용: ')) {
                                return content.split('\n내용: ')[1] || content;
                            }
                            return content;
                        })()}
                    </ContentBox>
                    <ButtonGroup>
                        {onDelete && (
                            <DangerButton onClick={() => onDelete(event.id)} style={{ flex: 1 }}>
                                삭제
                            </DangerButton>
                        )}
                        <SecondaryButton onClick={onClose} style={{ flex: onDelete ? 2 : 1, backgroundColor: 'black', color: 'white', border: 'none' }}>
                            확인
                        </SecondaryButton>
                    </ButtonGroup>
                </ContentWrapper>
            </DetailContainer>
        </ModalOverlay>
    );
};
