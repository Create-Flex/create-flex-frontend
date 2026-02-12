import React from 'react';
import { useNotification } from '../model/NotificationContext';
import { NotificationItem } from './NotificationItem';
import '../style/Notification.scss';

export const NotificationContainer = () => {
    const { toasts } = useNotification();

    return (
        <div className="notification-container">
            {toasts.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};
