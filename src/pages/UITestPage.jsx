import { Row, Col } from "antd";
import useTheme from "../hooks/useTheme";
import CustomCard from "../components/UI/CustomCard";
import CustomButton from "../components/UI/CustomButton";
import CustomPagination from "../components/UI/CustomPagination";
import CustomCheckbox from "../components/UI/CustomCheckbox";
import CustomRadio from "../components/UI/CustomRadio";
import CustomInput from "../components/UI/CustomInput";
import CustomForm from "../components/UI/CustomForm";
import CustomSwitch from "../components/UI/CustomSwitch";
import { FaRegUser } from "react-icons/fa";

export default function UITestPage() {
    const { theme, toggleTheme } = useTheme();
    const handleSubmit = (values) => {
        console.log("Form Values:", values);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <CustomCard title="Карточка" extra={<a href="#">More</a>} hoverable>
                        <p>Это тестовый контент внутри карточки.</p>
                    </CustomCard>
                </Col>
                <Col span={12}>
                    <div style={{ padding: "20px", display: "flex", gap: "10px" }}>
                        <CustomButton type="primary">Primary Button</CustomButton>
                        <CustomButton type="secondary">Secondary Button</CustomButton>
                    </div>
                </Col>
                <Col span={12}>
                    <CustomPagination />
                </Col>
                <Col span={12}>
                    <CustomCheckbox>Чекбокс</CustomCheckbox>
                </Col>

                <Col span={12}>
                    <CustomRadio options={[{ value: "1", label: "Опция 1" }, { value: "2", label: "Опция 2" }]} />
                </Col>

                <Col span={12}>
                    <CustomInput placeholder="...Введите логин..." prefix={<FaRegUser />}></CustomInput>
                </Col>
                <Col span={12}>
                    <CustomSwitch checked={theme === "dark"} onChange={toggleTheme} />
                    <span style={{ marginLeft: "10px" }}>Текущая тема: {theme}</span>
                </Col>

                <Col span={24}>
                    <CustomCard title="Форма">
                        <CustomForm onFinish={handleSubmit}>
                            <CustomForm.Item label="Логин" name="username" rules={[{ required: true, message: "Введите логин" }]}>
                                <CustomInput />
                            </CustomForm.Item>

                            <CustomForm.Item>
                                <CustomButton type="primary" htmlType="submit">
                                    Отправить
                                </CustomButton>
                            </CustomForm.Item>
                        </CustomForm>
                    </CustomCard>
                </Col>
            </Row>
        </div>
    );
}