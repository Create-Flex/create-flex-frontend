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
    // localStorage에서 알림 불러오기
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('notifications');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load notifications from localStorage:', e);
            return [];
        }
    });
    const [toasts, setToasts] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // notifications가 변경될 때마다 localStorage에 저장 (userId가 있을 때만)
    useEffect(() => {
        try {
            localStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (e) {
            console.error('Failed to save notifications to localStorage:', e);
        }
    }, [notifications]);

    const addNotification = useCallback((notificationData) => {
        const id = Date.now();
        // notificationData는 백엔드에서 보낸 전체 객체 (title, message, type 등 포함)
        const newNotification = {
            id,
            ...notificationData,  // title, message, type 등 모두 포함
            timestamp: new Date(),
            read: false
        };

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
    const clearNotifications = () => {
        setNotifications([]);
        try {
            localStorage.removeItem('notifications');
        } catch (e) {
            console.error('Failed to clear notifications from localStorage:', e);
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


        // 기본 메시지 핸들러
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data);  // 전체 데이터 객체 전달
            } catch (e) {
                addNotification({ message: event.data });  // 문자열인 경우 객체로 감싸기
            }
        };

        // 백엔드에서 'notification' 이름으로 보내는 이벤트 리스너 추가
        eventSource.addEventListener('notification', (event) => {
            try {
                const data = JSON.parse(event.data);
                addNotification(data);  // 전체 데이터 객체 전달 (title, message 등 포함)
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
