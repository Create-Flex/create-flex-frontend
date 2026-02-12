import { useNotification } from '../model/NotificationContext';
import { useUIStore } from '../../../shared/model/useUIStore';
import { X, Trash2 } from 'lucide-react';
import * as S from '../style/Notification.styled';
import '../style/Notification.scss';

export const NotificationPanel = () => {
    const { notifications, isPanelOpen, togglePanel, markAsRead, clearNotifications } = useNotification();
    const { isChatOpen } = useUIStore();

    if (!isPanelOpen) return null;

    return (
        <div
            className="notification-panel"
            style={{
                right: isChatOpen ? '440px' : '28px',
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
                            key={n.id}
                            className={`notification-list-item ${!n.read ? 'unread' : ''}`}
                            onClick={() => markAsRead(n.id)}
                        >
                            {!n.read && <span className="dot" />}
                            <div className="message">{n.message}</div>
                            <div className="time">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
