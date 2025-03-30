import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import { editPatient, getPatient } from '../hooks/useApiClient';
import CustomForm from '../components/UI/CustomForm';
import CustomInput from '../components/UI/CustomInput';
import CustomButton from '../components/UI/CustomButton';
import useFormatDate from '../hooks/useFormatDate';
import CountrySelect from "./create/CountrySelect";
import Title from '../components/Title';

import countries from "./create/countries-list";

const PatientEdit = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { parseToDayjs } = useFormatDate();

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await getPatient(id);
                setPatient(data);
            } catch (error) {
                message.error('Ошибка загрузки данных пациента.');
                navigate(`/patients/${id}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, navigate]);

    const handleSubmit = async (values) => {
        try {
            await editPatient(id, {
                ...values,
                date_of_birth: values.date_of_birth.format('YYYY-MM-DD'),
            });
            message.success('Пациент успешно обновлён!');
            navigate(`/patients/${id}`);
        } catch (error) {
            message.error('Ошибка при обновлении данных пациента.');
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    }

    return (
        <>
            <Title title={`Редактирование пациента ${patient?.first_name} ${patient?.last_name}`} />
            <CustomForm
                onFinish={handleSubmit}
                initialValues={{
                    ...patient,
                    date_of_birth: parseToDayjs(patient?.date_of_birth),
                }}
                layout="vertical"
            >
                <CustomForm.Item
                    name="first_name"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <CustomInput type="text" placeholder="Введите имя" />
                </CustomForm.Item>

                <CustomForm.Item
                    name="patronymic"
                    rules={[{ required: true, message: 'Введите отчество' }]}
                >
                    <CustomInput type="text" placeholder="Введите отчество" />
                </CustomForm.Item>

                <CustomForm.Item
                    name="last_name"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                    <CustomInput type="text" placeholder="Введите фамилию" />
                </CustomForm.Item>

                <CustomForm.Item
                    name="date_of_birth"
                    rules={[{ required: true, message: 'Выберите дату рождения' }]}
                >
                    <CustomInput type="date" placeholder="Выберите дату рождения" />
                </CustomForm.Item>

                <CustomForm.Item
                    name="gender"
                    rules={[{ required: true, message: 'Выберите пол' }]}
                >
                    <CustomInput
                        type="select"
                        placeholder="Выберите пол"
                        options={[
                            { value: 'male', label: 'Мужской' },
                            { value: 'female', label: 'Женский' },
                        ]}
                    />
                </CustomForm.Item>

                <CustomForm.Item name="contact_info">
                    <CustomInput type="textarea" placeholder="Введите контактную информацию" />
                </CustomForm.Item>

                <CustomForm.Item name="address">
                    <CustomInput type="textarea" placeholder="Введите адрес" />
                </CustomForm.Item>

                <CustomForm.Item
                    name="region"
                    rules={[{ required: true, message: 'Выберите страну' }]}
                >
                    <CountrySelect countries={countries} />
                </CustomForm.Item>
                <div style={{ textAlign: 'right' }}>
                    <CustomButton htmlType="submit">Сохранить</CustomButton>
                </div>
            </CustomForm>
        </>
    );
};

export default PatientEdit;