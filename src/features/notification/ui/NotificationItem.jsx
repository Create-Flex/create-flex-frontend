import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../model/NotificationContext';
import { useAuthStore } from '../../auth/model/useAuthStore';
import { getNavigationPath } from '../utils/navigation';
import '../style/Notification.scss';

export const NotificationItem = ({ notification }) => {
    const [isHiding, setIsHiding] = useState(false);
    const navigate = useNavigate();
    const { markAsRead } = useNotification();
    const { user } = useAuthStore();

    useEffect(() => {
        // 2.5초 후에 사라지는 애니메이션 시작 (전체 3초 중 마지막 0.5초)
        const timer = setTimeout(() => {
            setIsHiding(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        // 읽음 처리
        if (!notification.isRead) {
            markAsRead(notification.notificationId);
        }

        // 역할 기반 이동 경로 결정
        const userRole = user?.role || user?.memberRole;
        const path = getNavigationPath(notification.type || '', userRole);
        navigate(path);

        // 토스트 즉시 숨기기
        setIsHiding(true);
    };

    return (
        <div
            className={`notification-item ${isHiding ? 'hide' : ''}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
            </div>
            <div className="notification-progress" />
        </div>
    );
};
