import React, { useState } from 'react';
import { Steps, message, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomForm from '../../components/ui/CustomForm';
import CustomButton from '../../components/ui/CustomButton';
import { apiClient } from '../../services/apiClient';
import TemplatePage from '../../components/TempalePage';
import { useThemeColors } from '../../hooks/useThemeColors';

import { LuMoveLeft, LuMoveRight } from "react-icons/lu";
import steps from './data';

const { Step } = Steps;

const NewPatientPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        basicInfo: {},
        passportInfo: {},
        additionalInfo: {},
    });

    const { themeSecondaryColor } = useThemeColors();

    const navigate = useNavigate();

    const handleNext = (values) => {
        const newData = { ...formData };

        if (currentStep === 0) newData.basicInfo = values;
        if (currentStep === 1) newData.passportInfo = values;
        if (currentStep === 2) newData.additionalInfo = values;

        setFormData(newData);

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit(newData);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values.basicInfo,
                ...values.passportInfo,
                ...values.additionalInfo,
                date_of_birth: values.basicInfo.date_of_birth?.format('YYYY-MM-DD'),
                passport_issue_date: values.passportInfo.passport_issue_date?.format('YYYY-MM-DD'),
            };

            const data = await apiClient.post('/api/v1/patients/', formattedValues);

            message.success('Пациент успешно создан!');
            navigate(`/patients/${data.id}`);
        } catch (error) {
            console.error("Ошибка при создании пациента:", error.response?.data || error.message);
            message.error(
                error.response?.data?.detail ||
                error.response?.data ||
                'Ошибка при создании пациента!'
            );
        }
    };

    return (
        <TemplatePage
            title="Создание нового пациента"
            urls={[
                { title: "Создание нового пациента", path: '' },
            ]}
        >
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: themeSecondaryColor,
                        fontSizeLG: 'var(--xs-font-size)'
                    },
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        padding: '20px',
                    }}
                >
                    <Steps current={currentStep}>
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} />
                        ))}
                    </Steps>

                    <CustomForm
                        onFinish={handleNext}
                        layout="vertical"
                        style={{ marginTop: '20px' }}
                    >
                        {steps[currentStep].content}
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            {currentStep > 0 && (
                                <CustomButton
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    style={{ marginRight: '10px', padding: '8px 20px' }}
                                >
                                    <LuMoveLeft />
                                </CustomButton>
                            )}
                            <CustomButton htmlType="submit">
                                {currentStep === steps.length - 1 ? 'Завершить' : <LuMoveRight />}
                            </CustomButton>
                        </div>
                    </CustomForm>
                </div>
            </ConfigProvider>
        </TemplatePage>
    );
};

export default NewPatientPage;