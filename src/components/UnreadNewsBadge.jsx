import React, { useEffect } from 'react';
import { Badge, Spin, message } from 'antd';
import { getNewsUnread } from '../hooks/useApiClient';
import useApiRequest from '../hooks/useApiRequest';

const UnreadNewsBadge = ({ refreshTrigger, resetRefreshTrigger }) => {
    const { data: newsUnread, loading, error, refetch } = useApiRequest(() => getNewsUnread(), []);
    const unreadCount = newsUnread?.length || 0;

    useEffect(() => {
        if (refreshTrigger) {
            refetch();
            resetRefreshTrigger();
        }
    }, [refreshTrigger, refetch, resetRefreshTrigger]);

    if (loading) return <Spin size="small" />;
    if (error) {
        message.error('Ошибка загрузки новостей');
        return <Badge count={0} />;
    }

    return (
        <Badge count={unreadCount} offset={[10, 0]} size="large" style={{backgroundColor: 'var(--secondary-color)', boxShadow: 'none'}} />
    );
};

export default UnreadNewsBadge;