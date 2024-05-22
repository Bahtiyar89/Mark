import React from "react";
import { Select } from "@mantine/core";

function Dropdown({
  label,
  data,
  searchable,
  placeholder,
  nothingFound,
  value,
  setValue,
  required,
  readOnly,
  rightSection,
  variant,
  className,
}) {
  return (
    <Select
      className={className}
      label={label}
      placeholder={placeholder}
      searchable={searchable}
      nothingFound={nothingFound}
      data={data}
      value={value}
      onChange={setValue}
      required={required}
      readOnly={readOnly}
      rightSection={rightSection}
      variant={variant}
    />
  );
}

export default Dropdown;
