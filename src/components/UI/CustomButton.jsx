import { Button } from "antd";
import { useState } from "react";

export default function CustomButton({ type = "primary", size = "middle", iconSize = '14px', children, ...props }) {
    const [isHovered, setIsHovered] = useState(false);

    const getButtonStyles = () => {
        const styles = {
            backgroundColor: type === "outline" ? "transparent" : `var(--${type}-color)`,
            borderColor: `var(--${type}-color)`,
            color: type === "outline" ? `var(--${type}-color)` : "#ffffff",
            fontSize: `${iconSize}`,
            transition: "all 0.3s ease",
        };

        if (isHovered) {
            styles.backgroundColor = type === "outline" ? `var(--${type}-hover-bg)` : `var(--${type}-hover)`;
            styles.borderColor = `var(--${type}-hover)`;
            styles.color = type === "outline" ? `var(--${type}-hover)` : "#ffffff";
        }

        return styles;
    };

    return (
        <Button
            style={getButtonStyles()}
            className={type === "outline" ? "outline-button" : ""}
            size={size}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </Button>
    );
}