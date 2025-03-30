const CustomBadge = ({
    text,
    color = "red",
    backgroundColor = "lightgray",
    fontSize = "12px",
    padding = "5px 10px",
    borderRadius = "10px", 
}) => {
    return (
        <span style={{
            display: "inline-block",
            color,
            backgroundColor,
            fontSize,
            padding,
            borderRadius,
            fontWeight: 100,
            textAlign: "center",
            whiteSpace: "nowrap",
        }}>
            {text}
        </span>
    );
};

export default CustomBadge;