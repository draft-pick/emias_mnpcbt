import { Checkbox } from "antd";

export default function CustomCheckbox({ children, ...props }) {
    return <Checkbox
     {...props}
     className="custom-checkbox"
     >
        {children}
        </Checkbox>;
}