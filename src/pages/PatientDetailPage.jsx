import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Spin, message, Flex } from 'antd';
import { apiClientLocal } from '../hooks/useApiClient';

import CustomButton from '../components/UI/CustomButton';
import { Link } from 'react-router-dom';
import useFormatDate from '../hooks/useFormatDate';
import Title from '../components/Title';
import GenerateVichDoc from '../components/generate-documents/GenerateVichDoc';
import GenerateMedicalCard from '../components/generate-documents/GenerateMedicalCard';


const PatientDetailsPage = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { formatDate } = useFormatDate();

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await apiClientLocal.get(`/patients/${id}/`);
                setPatient(data);
            } catch (error) {
                message.error('Ошибка загрузки данных пациента.');
                navigate('/patients');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, navigate]);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    }

    if (!patient) {
        return <p style={{ textAlign: 'center' }}>Пациент не найден.</p>;
    }

    return (
        <div>
            <Title title={`${patient.first_name} ${patient.last_name} ${patient.patronymic || ""}`} />
            <h4>Документы:</h4>
            <Flex>
                <GenerateVichDoc
                    patientId={patient.id}
                    lastName={patient.last_name}
                    firstName={patient.first_name}
                />
                <GenerateMedicalCard
                    patientId={patient.id}
                    lastName={patient.last_name}
                    firstName={patient.first_name}
                />
            </Flex>
            <hr />
            <div>
                <h4>Основные сведения</h4>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Номер амбулаторной карты">{patient.card_number || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Дата рождения">{formatDate(patient.date_of_birth)}</Descriptions.Item>
                    <Descriptions.Item label="Пол">{patient.gender === 'male' ? 'Мужской' : 'Женский'}</Descriptions.Item>
                    <Descriptions.Item label="Cтрана">{patient.region || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Контактная информация">{patient.contact_info || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Адрес">{patient.address || 'Нет данных'}</Descriptions.Item>
                </Descriptions>
            </div>
            <div>
                <h4>Паспортные данные</h4>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Вид документа">{patient.passport || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Серия / номер">{patient.number_of_document || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Кем и когда выдан">{formatDate(patient.date_of_document) || 'Нет данных'}</Descriptions.Item>
                </Descriptions>
            </div>
            <div>
                <h4>Другое</h4>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Дата создания записи">{formatDate(patient.created_at)}</Descriptions.Item>
                    <Descriptions.Item label="Последнее обновление записи">{formatDate(patient.updated_at)}</Descriptions.Item>
                    <Descriptions.Item label="Владелец">{patient.owner.first_name} {patient.owner.last_name}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Link to={`/patients/${id}/edit`}>
                        <CustomButton type="primary">
                            Изменить
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default PatientDetailsPage;