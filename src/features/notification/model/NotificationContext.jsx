import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../api/config';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children, userId, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // 백엔드에서 알림 목록 불러오기
    const fetchNotifications = useCallback(async () => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (e) {
            console.error('Failed to fetch notifications from backend:', e);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const addNotification = useCallback((notificationData) => {
        const id = notificationData.notificationId || Date.now();
        const newNotification = {
            ...notificationData,
            timestamp: notificationData.timestamp ? new Date(notificationData.timestamp) : new Date(),
            read: notificationData.read || false
        };

        // 중복 체크 (SSE로 받은 게 이미 리스트에 있을 수 있음)
        setNotifications(prev => {
            const exists = prev.some(n => n.notificationId === newNotification.notificationId);
            if (exists) return prev;
            return [newNotification, ...prev];
        });

        // 토스트 알림 추가
        const toastId = id;
        setToasts(prev => [...prev, { ...newNotification, id: toastId }]);

        // 3초 후 토스트 제거
        setTimeout(() => {
            setToasts(prev => prev.filter(t => (t.notificationId || t.id) !== id));
        }, 3000);
    }, []);

    const togglePanel = () => setIsPanelOpen(prev => !prev);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API_CONFIG.BASE_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n =>
                (n.notificationId === id) ? { ...n, isRead: true } : n
            ));
        } catch (e) {
            console.error('Failed to mark notification as read:', e);
            // 편의상 프론트에서도 미리 반영 가능
            setNotifications(prev => prev.map(n =>
                (n.notificationId === id) ? { ...n, isRead: true } : n
            ));
        }
    };

    const clearNotifications = async () => {
        try {
            await axios.patch(`${API_CONFIG.BASE_URL}/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (e) {
            console.error('Failed to clear notifications:', e);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    useEffect(() => {
        if (!userId) return;
        const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
            ? API_CONFIG.BASE_URL.slice(0, -1)
            : API_CONFIG.BASE_URL;

        const url = token
            ? `${baseUrl}/notifications/subscribe?userId=${userId}&token=${token}`
            : `${baseUrl}/notifications/subscribe?userId=${userId}`;

        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data);
            } catch (e) {
                console.error('SSE Message Error:', e);
            }
        };

        eventSource.addEventListener('notification', (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data);
            } catch (e) {
                console.error('Notification Event Error:', e);
            }
        });

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [userId, token, addNotification]);

    const hasUnread = notifications.some(n => !n.isRead);

    return (
        <NotificationContext.Provider value={{
            notifications,
            toasts,
            isPanelOpen,
            togglePanel,
            markAsRead,
            clearNotifications,
            hasUnread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
