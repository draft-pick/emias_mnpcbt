import CustomInput from "../../components/UI/CustomInput";
import CustomForm from "../../components/UI/CustomForm";
import CountrySelect from "./CountrySelect";
import countries from "./countries-list";
import { DatePicker } from "antd";

const steps = [
    {
        title: 'Основные сведения',
        content: (
            <>
                <CustomForm.Item
                    name="first_name"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <CustomInput
                        type="text"
                        placeholder="Введите имя"
                        style={{ height: '30px', padding: '4px 11px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item
                    name="last_name"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                    <CustomInput
                        type="text"
                        placeholder="Введите фамилию"
                        style={{ height: '30px', padding: '4px 11px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item
                    name="patronymic"
                    rules={[{ message: 'Введите отчество' }]}
                >
                    <CustomInput
                        type="text"
                        placeholder="Введите отчество"
                        style={{ height: '30px', padding: '4px 11px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item
                    name="date_of_birth"
                    rules={[{ required: true, message: 'Введите в формате гггг-мм-дд или выберите дату' }]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        allowClear
                        placeholder="Введите в формате гггг-мм-дд или выберите дату"
                        style={{ width: '100%' }}
                        inputReadOnly={false}
                    />
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
                        style={{ height: '30px', width: '150px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item
                    name="region"
                    rules={[{ required: true, message: 'Выберите страну' }]}
                >
                    <CountrySelect countries={countries} />
                </CustomForm.Item>
            </>
        ),
    },
    {
        title: 'Паспортные данные',
        content: (
            <>
                <CustomForm.Item
                    name="number_of_document"
                    rules={[{ required: true, message: 'Введите номер паспорта' }]}
                >
                    <CustomInput
                        type="text"
                        placeholder="Введите номер паспорта"
                        style={{ height: '30px', padding: '4px 11px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item
                    name="date_of_document"
                    rules={[{ required: true, message: 'Введите дату выдачи паспорта' }]}
                >
                    <CustomInput
                        type="date"
                        placeholder="Введите дату выдачи"
                        style={{ height: '30px', width: 'auto' }}
                    />
                </CustomForm.Item>
            </>
        ),
    },
    {
        title: 'Прочее',
        content: (
            <>
                <CustomForm.Item name="contact_info">
                    <CustomInput
                        type="textarea"
                        placeholder="Введите контактную информацию"
                        rows={3}
                        style={{ padding: '4px 11px' }}
                    />
                </CustomForm.Item>
                <CustomForm.Item name="address">
                    <CustomInput
                        type="textarea"
                        placeholder="Введите адрес"
                        rows={3}
                        style={{ padding: '4px 11px' }}
                    />
                </CustomForm.Item>
            </>
        ),
    },
];

export default steps;