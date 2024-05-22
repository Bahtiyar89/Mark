import React, { FC, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  fontSize?: number | string;
  onClick?: any;
  className?: string;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  border?: string;
  borderRadius?: string | number;
  margin?: string | number;
  background?: string;
  cursor?: string;
  color?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  lineHeight?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  fontStyle?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  props?: any;
};

const Button: FC<ButtonProps> = ({
  children,
  fontSize,
  onClick,
  className,
  width,
  height,
  padding,
  border,
  borderRadius,
  margin,
  background,
  cursor,
  color,
  type,
  disabled,
  lineHeight,
  fontWeight,
  fontFamily,
  fontStyle,
  loading,
  props,
  style,
}) => {
  return (
    <>
      <button
        style={{
          ...style,
          fontStyle,
          fontFamily,
          fontSize,
          width,
          height,
          padding,
          border,
          borderRadius,
          margin,
          background,
          cursor,
          color,
          lineHeight,
          fontWeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={className}
        {...props}
      >
        {children}
        {/* {loading && <Loader width={25} height={25} style={{ marginLeft: 5 }} />} */}
      </button>
    </>
  );
};

export default Button;
