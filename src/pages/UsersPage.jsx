import { getUsers } from '../hooks/useApiClient';
import { List, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomPagination from '../components/UI/CustomPagination';
import Title from '../components/Title';


const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getUsers(page);
            setUsers(response.results);
            setPagination({
                current: page,
                total: response.count,
            });
        } catch (error) {
            message.error("Ошибка при загрузке списка пациентов.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handlePageChange = (page) => {
        fetchUsers(page);
    };
    return (
        <>
            <Title title="Список пользователей" />
            <List
                bordered
                dataSource={users}
                style={{ fontSize: 'var(--primary-font-size)' }}
                renderItem={(user) => (
                    <List.Item
                        actions={[
                            <Link to={`/users/${user.id}`}>Детали</Link>,
                        ]}
                    >
                        <span style={{ fontWeight: '500' }}>{user.first_name} {user.last_name}</span> статус: {user.role}
                    </List.Item>
                )}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {loading && <Spin size="small" />}
                {!loading && (
                    <CustomPagination
                        current={pagination.current}
                        total={pagination.total}
                        pageSize={10}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                )}
            </div>
        </>
    );
}

export default UsersPage;