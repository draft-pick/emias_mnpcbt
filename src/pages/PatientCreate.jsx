import { Steps, message } from 'antd';
import steps from './create/data';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CustomForm from '../components/UI/CustomForm';
import CustomButton from '../components/UI/CustomButton';
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";
import {apiClientLocal} from '../hooks/useApiClient';

const { Step } = Steps;

const PatientCreate = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        basicInfo: {},
        passportInfo: {},
        additionalInfo: {},
    });

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
                date_of_document: values.passportInfo.date_of_document?.format('YYYY-MM-DD'),
            };
    
            const data = await apiClientLocal.post('/patients/', formattedValues);
            message.success('Пациент успешно создан!');
            navigate(`/patients/${data.id}`);
        } catch (error) {
            console.error("Подробности ошибки:", error.data, "Статус ошибки:", error.status);
            message.error(
                error.data?.detail ||
                JSON.stringify(error.data) ||
                'Ошибка при создании пациента!'
            );
        }
    };
    return (
        <>
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
        </>
    );
}

export default PatientCreate;