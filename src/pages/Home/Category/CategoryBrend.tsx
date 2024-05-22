import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "components";

interface Props {
  shewronBrand?: boolean;
}

const CategoryBrend = ({ shewronBrand }: Props) => {
  const [t, i18n] = useTranslation();

  if (shewronBrand) {
    return (
      <>
        <Checkbox inp={true} label={t("zemfir")} />
        <div style={{ marginTop: 6 }}></div>
        <Checkbox inp={true} label={t("smokva")} />
        <div style={{ marginTop: 6 }}></div>
        <Checkbox inp={true} label={t("candies")} />
        <div style={{ marginTop: 6 }}></div>
        <Checkbox inp={true} label={t("alcohol")} />
      </>
    );
  } else {
    return null;
  }
};

export default CategoryBrend;
