import { Switch } from "antd";
import useTheme from "../../hooks/useTheme";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Switch checked={theme === "dark"} onChange={toggleTheme} checkedChildren="🌙" unCheckedChildren="☀️" />
    );
}