import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

    const addNotification = useCallback((message) => {
        const id = Date.now();
        const newNotification = { id, message, timestamp: new Date(), read: false };

        // 알림 리스트에 추가
        setNotifications(prev => [newNotification, ...prev]);

        // 토스트(팝업) 알림에 추가
        setToasts(prev => [...prev, newNotification]);

        // 3초 후 토스트 제거
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const togglePanel = () => setIsPanelOpen(prev => !prev);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const clearNotifications = () => setNotifications([]);

    useEffect(() => {
        if (!userId) return;

        // VITE_API_URL 등을 포함한 절대 경로 사용 (프록시가 없을 경우를 대비)
        const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
            ? API_CONFIG.BASE_URL.slice(0, -1)
            : API_CONFIG.BASE_URL;

        const url = token
            ? `${baseUrl}/notifications/subscribe?userId=${userId}&token=${token}`
            : `${baseUrl}/notifications/subscribe?userId=${userId}`;

        const eventSource = new EventSource(url);


        // 기본 메시지 핸들러
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data.message || '새로운 알림이 도착했습니다.');
            } catch (e) {
                addNotification(event.data);
            }
        };

        // 백엔드에서 'notification' 이름으로 보내는 이벤트 리스너 추가
        eventSource.addEventListener('notification', (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data.message || '새로운 알림이 도착했습니다.');
            } catch (e) {
                console.error('Notification Parse Error:', e);
            }
        });

        eventSource.addEventListener('connected', (e) => {
            console.log('SSE Connected:', e.data);
        });

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [userId, token, addNotification]);


    const hasUnread = notifications.some(n => !n.read);

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
