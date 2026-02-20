import { useNavigate } from 'react-router-dom';
import { useNotification } from '../model/NotificationContext';
import { useAuthStore } from '../../auth/model/useAuthStore';
import { getNavigationPath } from '../utils/navigation';
import { X, Trash2 } from 'lucide-react';
import * as S from '../style/Notification.styled';
import '../style/Notification.scss';

export const NotificationPanel = () => {
    const { notifications, isPanelOpen, togglePanel, markAsRead, clearNotifications } = useNotification();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    if (!isPanelOpen) return null;

    const handleNotificationClick = (n) => {
        // 읽음 처리
        if (!n.isRead) {
            markAsRead(n.notificationId);
        }

        // 알림 패널 닫기
        togglePanel();

        // 역할 기반 이동 경로 결정
        const userRole = user?.role || user?.memberRole;
        const path = getNavigationPath(n.type || '', userRole);
        navigate(path);
    };

    return (
        <div
            className="notification-panel"
            style={{
                right: '28px',
                transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div className="panel-header">

                <span>알림</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {notifications.length > 0 && (
                        <S.ClearButton onClick={clearNotifications}>
                            <Trash2 size={12} />
                            모두 지우기
                        </S.ClearButton>
                    )}
                    <X size={18} onClick={togglePanel} style={{ cursor: 'pointer', color: '#9ca3af' }} />
                </div>
            </div>
            <div className="panel-content">
                {notifications.length === 0 ? (
                    <div className="empty-message">새로운 알림이 없습니다.</div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.notificationId}
                            className={`notification-list-item ${!n.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(n)}
                        >
                            {!n.isRead && <span className="dot" />}
                            <div className="message">{n.message}</div>
                            <div className="time">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
