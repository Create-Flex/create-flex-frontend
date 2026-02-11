import { Bell } from 'lucide-react';
import { useNotification } from '../model/NotificationContext';
import { useUIStore } from '../../../shared/model/useUIStore';
import * as S from '../style/Notification.styled';

export const NotificationButton = () => {
    const { togglePanel, hasUnread } = useNotification();
    const { isChatOpen } = useUIStore();

    return (
        <S.Button onClick={togglePanel} aria-label="알림 열기" $isChatOpen={isChatOpen}>
            <Bell size={20} />
            {hasUnread && <S.Badge />}
        </S.Button>
    );
};
