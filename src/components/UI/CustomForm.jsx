import { Form } from "antd";

const CustomForm = ({ children, onFinish, ...props }) => {
    return (
        <Form 
        layout="vertical" 
        onFinish={onFinish} 
        {...props}>
            {children}
        </Form>
    );
};

CustomForm.Item = Form.Item;

export default CustomForm;