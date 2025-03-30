import { Radio } from "antd";

export default function CustomRadio({ options, ...props }) {
  return (
    <Radio.Group {...props}>
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
}