import React from 'react';
import { message } from 'antd';
import CustomButton from '../UI/CustomButton';
import { apiClientLocal } from '../../hooks/useApiClient';

const GenerateVichDoc = ({ patientId, lastName, firstName }) => {
    const generateDoc = async () => {
        try {
            const blob = await apiClientLocal.get(`/patients/${patientId}/vich/`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`,
                },
            });
    
            if (blob.size === 0) {
                throw new Error('Файл пустой или поврежден.');
            }
    
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${lastName}_${firstName}_ВИЧ.docx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            message.success('Документ успешно сгенерирован и скачан!');
    
            await apiClientLocal.post(`/patients/${patientId}/delete-vich/`, {}, 'DELETE');
            message.success('Сгенерированный файл удален с сервера!');
        } catch (error) {
            message.error(error.data?.detail || error.message || 'Ошибка при обработке документа.');
            console.error(error);
        }
    };

    return (
        <CustomButton onClick={generateDoc} size='small'>
            ВИЧ документ
        </CustomButton>
    );
};

export default GenerateVichDoc;