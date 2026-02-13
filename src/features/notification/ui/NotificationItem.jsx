import React, { useEffect, useState } from 'react';
import '../style/Notification.scss';

export const NotificationItem = ({ notification }) => {
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        // 2.5초 후에 사라지는 애니메이션 시작 (전체 3초 중 마지막 0.5초)
        const timer = setTimeout(() => {
            setIsHiding(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`notification-item ${isHiding ? 'hide' : ''}`}>
            <div className="notification-content">
                {notification.message}
            </div>
            <div className="notification-progress" />
        </div>
    );
};
