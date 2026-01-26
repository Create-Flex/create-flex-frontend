import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { UserRole } from '../enums';
import { INITIAL_AD_PROPOSALS } from './creator/shared/constants';

import { ViewContainer, ScrollArea, ContentWrapper, ToastContainer, ToastMessage } from './EmployeeCreatorView.styled';
import { SupportRequestModal } from './employee/modals/SupportRequestModal';
import { AdCampaignModal } from './employee/modals/AdCampaignModal';
import { EventModal } from './employee/modals/EventModal';
import { EventDetailModal } from './employee/modals/EventDetailModal';

import { CalendarTab } from './employee/creator/CalendarTab';
import { CreatorListTab } from './employee/creator/CreatorListTab';
import { AdsTab } from './employee/creator/AdsTab';
import { HealthTab } from './employee/creator/HealthTab';
import { SupportTab } from './employee/creator/SupportTab';

export const EmployeeCreatorView = ({
    user,
    creators,
    onUpdateCreators,
    healthRecords,
    onUpdateHealthRecords,
    issueLogs,
    onUpdateIssueLogs,
    events,
    onUpdateEvents,
    onAddSupportRequest,
    currentView,
    allTasks,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    supportRequests,
}) => {
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [adProposals, setAdProposals] = useState(INITIAL_AD_PROPOSALS);
    const [adFilter, setAdFilter] = useState('all');

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success',
    });

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [supportModal, setSupportModal] = useState({ open: false, type: 'legal' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [minimizedEventDate, setMinimizedEventDate] = useState(null);
    const [minimizedEventCreatorId, setMinimizedEventCreatorId] = useState(null);

    const myCreators = creators.filter(c => c.manager === user.name || user.role === UserRole.ADMIN);
    const creatorsMap = creators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    const myCreatorsMap = myCreators.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    const allMyEvents = events.filter(e => myCreatorsMap[e.creatorId]);

    const handleEventClick = (event) => setSelectedEvent(event);

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            onUpdateEvents(events.filter(e => e.id !== eventId));
            setSelectedEvent(null);
            showToastMessage('일정이 삭제되었습니다.');
        }
    };

    const handleOpenEventModal = (date) => {
        if (myCreators.length === 0) return;
        setMinimizedEventDate(date || new Date().toISOString().split('T')[0]);
        setMinimizedEventCreatorId(selectedCreatorId || (myCreators[0] ? myCreators[0].id : ''));
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = (data) => {
        const eventsToCreate = [];

        // 1. Main event for the host creator
        const mainEvent = {
            id: Date.now().toString(),
            creatorId: data.creatorId,
            hostCreatorId: data.creatorId, // Original Host
            title: data.title,
            date: data.date,
            type: data.type,
            content: data.content,
            partnerCreators: data.type === 'joint' ? data.partnerCreators : [],
        };
        eventsToCreate.push(mainEvent);

        // 2. Partner events (if joint)
        if (data.type === 'joint' && data.partnerCreators.length > 0) {
            const hostCreator = creators.find(c => c.id === data.creatorId);
            const hostName = hostCreator ? hostCreator.name : '알 수 없음';

            data.partnerCreators.forEach((partnerId, index) => {
                const partnerEvent = {
                    id: (Date.now() + index + 1).toString(), // Unique ID
                    creatorId: partnerId,
                    hostCreatorId: data.creatorId, // Explicitly set Host ID
                    title: `[합방] ${data.title}`,
                    date: data.date,
                    type: 'joint',
                    content: `주최: ${hostName}\n내용: ${data.content}`,
                    partnerCreators: [data.creatorId, ...data.partnerCreators.filter(id => id !== partnerId)],
                };
                eventsToCreate.push(partnerEvent);
            });
        }

        onUpdateEvents([...events, ...eventsToCreate]);
        showToastMessage('일정이 등록되었습니다.');
    };

    const showToastMessage = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleAdDecision = (id, decision) => {
        const ad = adProposals.find(a => a.id === id);
        setAdProposals(prev => prev.map(p => (p.id === id ? { ...p, status: decision } : p)));
        if (decision === 'accepted' && ad) {
            const newEvent = {
                id: Date.now().toString(),
                creatorId: ad.creatorId,
                title: `[광고] ${ad.campaignTitle}`,
                date: ad.targetDate || new Date().toISOString().split('T')[0],
                type: 'content',
                content: `광고주: ${ad.brandName}\n예산: ${ad.budget}\n내용: ${ad.description}`,
            };
            onUpdateEvents([...events, newEvent]);
            showToastMessage('제안이 수락되어 일정에 등록되었습니다.');
        } else {
            showToastMessage('제안이 거절되었습니다.', 'error');
        }
    };

    const handleAddAd = (data) => {
        const newAd = {
            id: Date.now().toString(),
            creatorId: data.creatorId,
            brandName: data.brandName,
            campaignTitle: data.campaignTitle,
            budget: data.budget,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
            description: data.description || '',
            targetDate: data.targetDate,
        };
        setAdProposals([newAd, ...adProposals]);
        showToastMessage('새로운 캠페인이 등록되었습니다.');
    };

    const handleSupportRequest = (data) => {
        const selectedCreator = creators.find(c => c.id === data.creatorId);
        if (onAddSupportRequest && selectedCreator) {
            onAddSupportRequest({
                id: Date.now().toString(),
                creatorId: selectedCreator.id,
                creatorName: selectedCreator.name,
                type: data.type,
                title: data.title,
                content: data.content,
                requestDate: new Date().toISOString().split('T')[0],
                status: '접수',
            });
        }
        showToastMessage(`${data.type === 'legal' ? '법률' : '세무'} 상담 신청이 완료되었습니다.`);
    };

    const myAdProposals = adProposals.filter(ad => myCreators.map(c => c.id).includes(ad.creatorId));
    const filteredAds = myAdProposals.filter(ad => {
        if (adFilter === 'all') return true;
        if (adFilter === 'pending') return ad.status === 'pending';
        if (adFilter === 'history') return ad.status !== 'pending';
        return true;
    });

    const activeTab =
        currentView === 'employee-creator-list' ? 'list' :
            currentView === 'employee-creator-ads' ? 'ads' :
                currentView === 'employee-creator-health' ? 'health' :
                    currentView === 'employee-creator-support' ? 'support' : 'calendar';

    return (
        <ViewContainer>
            <ScrollArea>
                <ContentWrapper>
                    {activeTab === 'calendar' && (
                        <CalendarTab
                            allMyEvents={allMyEvents}
                            creatorsMap={creatorsMap}
                            currentDate={currentDate}
                            onDateChange={setCurrentDate}
                            onAddEvent={handleOpenEventModal}
                            onEventClick={handleEventClick}
                            myCreators={myCreators}
                        />
                    )}

                    {activeTab === 'list' && (
                        <CreatorListTab
                            selectedCreatorId={selectedCreatorId}
                            setSelectedCreatorId={setSelectedCreatorId}
                            myCreators={myCreators}
                            allTasks={allTasks}
                            events={events}
                            onAddEvent={handleOpenEventModal}
                            onEventClick={handleEventClick}
                            onAddTask={onAddTask}
                            onToggleTask={onToggleTask}
                            onDeleteTask={onDeleteTask}
                        />
                    )}

                    {activeTab === 'ads' && (
                        <AdsTab
                            filteredAds={filteredAds}
                            adFilter={adFilter}
                            setAdFilter={setAdFilter}
                            myAdProposals={myAdProposals}
                            onAdDecision={handleAdDecision}
                            setIsAdModalOpen={setIsAdModalOpen}
                            creators={creators}
                        />
                    )}

                    {activeTab === 'health' && (
                        <HealthTab
                            myCreators={myCreators}
                            healthRecords={healthRecords}
                            onUpdateHealthRecords={onUpdateHealthRecords}
                            issueLogs={issueLogs}
                            onUpdateIssueLogs={onUpdateIssueLogs}
                        />
                    )}

                    {activeTab === 'support' && (
                        <SupportTab
                            onOpenSupportModal={(type) => setSupportModal({ open: true, type })}
                            supportRequests={supportRequests}
                        />
                    )}
                </ContentWrapper>
            </ScrollArea>


            {/* Support Request Modal */}
            <SupportRequestModal
                isOpen={supportModal.open}
                onClose={() => setSupportModal({ ...supportModal, open: false })}
                type={supportModal.type}
                creators={creators}
                onConfirm={(data) => {
                    handleSupportRequest(data);
                    setSupportModal({ ...supportModal, open: false });
                }}
            />

            {/* Event Modal */}
            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                creators={creators}
                initialCreatorId={minimizedEventCreatorId}
                date={minimizedEventDate}
                onConfirm={(data) => {
                    handleSaveEvent(data);
                    setIsEventModalOpen(false);
                }}
            />

            {/* Ad Modal */}
            <AdCampaignModal
                isOpen={isAdModalOpen}
                onClose={() => setIsAdModalOpen(false)}
                creators={creators}
                onConfirm={(data) => {
                    handleAddAd(data);
                    setIsAdModalOpen(false);
                }}
            />

            {/* Event Detail Modal */}
            <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={handleDeleteEvent}
                creators={creators}
            />

            {/* Toast */}
            {toast.show && (
                <ToastContainer>
                    {toast.type === 'success' ? <CheckCircle2 size={20} color="#00C471" /> : <AlertCircle size={20} color="#f87171" />}
                    <ToastMessage>{toast.message}</ToastMessage>
                </ToastContainer>
            )}
        </ViewContainer>
    );
};
