import React, { FC } from "react";
import { Checkbox } from "@mantine/core";
import "./style.css";

type CheckBoxProps = {
  inp?: boolean;
  className?: string;
  label?: string;
  props?: any;
  checked?: boolean;
  onChange?: (e: any) => void;
};

const CheckBox: FC<CheckBoxProps> = ({
  inp,
  className,
  onChange,
  label,
  checked,
  ...props
}) => {
  return (
    <Checkbox
      styles={{
        input: inp
          ? {
              backgroundColor: "#232429",
              borderColor: "#ffffff",
            }
          : {},
      }}
      checked={checked}
      onChange={onChange}
      className={`checkbox ${className}`}
      label={label}
      {...props}
    />
  );
};

export default CheckBox;
