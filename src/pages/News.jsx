import { useState, useEffect } from 'react';
import { getNews, postNewsIsread } from '../hooks/useApiClient';
import useApiRequest from '../hooks/useApiRequest';
import CustomCard from '../components/UI/CustomCard';
import CustomButton from '../components/UI/CustomButton';
import CustomPagination from '../components/UI/CustomPagination';
import { message, Spin, Space, Modal } from 'antd';
import useFormatDate from '../hooks/useFormatDate';
import Title from '../components/Title';

const News = ({ triggerRefreshUnread }) => {
    const { data: initialNews, loading: dataLoading, error } = useApiRequest(() => getNews(), []);
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });
    const { formatDate } = useFormatDate();

    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        if (initialNews?.results) {
            setNews(initialNews.results);
            setPagination({ current: initialNews.current_page, total: initialNews.total_count });
        }
    }, [initialNews]);

    const handleMarkAsRead = async (newsId) => {
        try {
            await postNewsIsread(newsId);
            setNews((prevNews) =>
                prevNews.map((item) =>
                    item.id === newsId ? { ...item, read_status: true } : item
                )
            );
            triggerRefreshUnread();
        } catch (err) {
            message.error("Ошибка при обновлении статуса новости");
        }
    };

    const handlePageChange = (page) => {
        fetchArticles(page);
    };

    const handleOpenModal = (item) => {
        setSelectedNews(item);
        if (!item.read_status) {
            handleMarkAsRead(item.id);
        }
    };

    const handleCloseModal = () => {
        setSelectedNews(null);
    };

    return (
        <>
        <Title title="Новости" />
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {news.map((item, i) => {
                const isUnread = !item.read_status;
                return (
                    <CustomCard
                        key={i}
                        title={item.content}
                        style={{
                            backgroundColor: isUnread ? '#f0f9ff' : '#fff',
                            border: isUnread ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleOpenModal(item)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{formatDate(item.created_at)}</span>
                            <div>{item.user.first_name} {item.user.last_name} {item.user.role}</div>
                            <CustomButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(item.id);
                                }}
                                disabled={!isUnread}
                            >
                                {isUnread ? 'Прочитать' : 'Прочитано'}
                            </CustomButton>
                        </div>
                    </CustomCard>
                );
            })}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {dataLoading && <Spin size="small" />}
                {!dataLoading && (
                    <CustomPagination
                        current={pagination.current}
                        total={pagination.total}
                        pageSize={20}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                )}
            </div>

            <Modal
                title="Подробности новости"
                open={selectedNews !== null}
                onCancel={handleCloseModal}
                footer={null}
            >
                {selectedNews && (
                    <div>
                        <p><strong>Дата публикации:</strong> {formatDate(selectedNews.created_at)}</p>
                        <p><strong>Автор:</strong> {selectedNews.user.first_name} {selectedNews.user.last_name} ({selectedNews.user.role})</p>
                        <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                    </div>
                )}
            </Modal>
        </Space>
        </>
    );
};

export default News;