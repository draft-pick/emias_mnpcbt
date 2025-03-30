import { getPatients } from '../hooks/useApiClient';
import useFormatDate from '../hooks/useFormatDate';
import { List, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomPagination from '../components/UI/CustomPagination';
import Title from '../components/Title';


const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });
    const [loading, setLoading] = useState(false);

    const { formatDate } = useFormatDate();

    const fetchPatients = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getPatients(page);
            setPatients(response.results);
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
        fetchPatients(1);
    }, []);

    const handlePageChange = (page) => {
        fetchPatients(page);
    };
    return (
        <>
            <Title title="Список пациентов" />
            <List
                bordered
                dataSource={patients}
                style={{ fontSize: 'var(--primary-font-size)' }}
                renderItem={(patient) => (
                    <List.Item
                        actions={[
                            <Link to={`/patients/${patient.id}`}>Детали</Link>,
                        ]}
                    >
                        <span style={{ fontWeight: '500' }}>{patient.first_name} {patient.last_name}</span> - {formatDate(patient.date_of_birth)} № карты: {patient.card_number}
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

export default PatientList;