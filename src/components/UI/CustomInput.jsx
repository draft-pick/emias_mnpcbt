import React from "react";
import { Input, DatePicker, Select } from "antd";
import InputMask from "react-input-mask";

const { TextArea } = Input;
const { Option } = Select;

const CustomInput = ({
    type = "text",
    name,
    placeholder = "Введите текст...",
    icon = null,
    options = [],
    required = false,
    style = {},
    mask,
    ...rest
}) => {
    const renderInput = () => {
        if (mask && (type === "text" || type === "date")) {
            return (
                <InputMask mask={mask} {...rest}>
                    {(inputProps) => (
                        <Input
                            {...inputProps}
                            placeholder={placeholder}
                            prefix={icon}
                            style={style}
                        />
                    )}
                </InputMask>
            );
        }

        switch (type) {
            case "text":
                return <Input placeholder={placeholder} prefix={icon} style={style} {...rest} />;
            case "textarea":
                return <TextArea placeholder={placeholder} style={style} {...rest} />;
            case "date":
                return <DatePicker placeholder={placeholder} style={style} {...rest} />;
            case "select":
                return (
                    <Select placeholder={placeholder} style={style} {...rest}>
                        {options.map((opt) => (
                            <Option key={opt.value} value={opt.value}>
                                {opt.label}
                            </Option>
                        ))}
                    </Select>
                );
            case "number":
                return (
                    <Input
                        type="number"
                        placeholder={placeholder}
                        style={style}
                        {...rest}
                        onKeyDown={(e) => {
                            const allowedKeys = [
                                "Backspace", "ArrowLeft", "ArrowRight", "Delete", "-", "Tab",
                            ];
                            if (
                                !/[0-9]/.test(e.key) &&
                                !allowedKeys.includes(e.key)
                            ) {
                                e.preventDefault();
                            }
                        }}
                    />
                );
            case "password":
                return <Input.Password placeholder={placeholder} prefix={icon} style={style} {...rest} />;
            default:
                return null;
        }
    };

    return <div>{renderInput()}</div>;
};

export default CustomInput;