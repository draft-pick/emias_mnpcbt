import { Switch } from "antd";

export default function CustomSwitch({ size = "small", ...props }) {
    return <Switch
        size={size}
        style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
        }}
        styles={{
            body: {
                color: "var(--text-color)",
            },
        }}
        {...props} />;
}