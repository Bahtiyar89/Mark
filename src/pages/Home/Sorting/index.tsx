import React, { useState } from "react";
import classes from "./style.module.css";
import { ReactComponent as DropIcon } from "assets/images/icons/chevron.svg";
import { useTranslation } from "react-i18next";

const Sorting = ({ handleSort, sorteBy }: any) => {
  const [t, i18n] = useTranslation();
  const [showRange, setShowRange] = useState<boolean>(false);

  const sortByHandler = () => {
    if (sorteBy === "newest") {
      return t("by_novelty");
    } else if (sorteBy === "alphabetical") {
      return t("alphabetically");
    } else if (sorteBy === "price_asc") {
      return t("lowest_price");
    } else if (sorteBy === "price_desc") {
      return t("higest_price");
    } else {
      return t("by_novelty");
    }
  };
  return (
    <div className={classes.flex_wrapper}>
      <span style={{ color: "#8A8B94", paddingBottom: 5 }}>{t("sorting")}</span>
      <span
        onClick={() => setShowRange(!showRange)}
        className={classes.by_novelty}
      >
        {sortByHandler()}
      </span>
      <DropIcon width={14} height={24} stroke={"#232429"} />
      {showRange ? (
        <div className={classes.dropdown__lang_items}>
          <div
            onClick={() => {
              handleSort("newest");
              setShowRange(!showRange);
            }}
            className={classes.dropdown__lang_item}
          >
            <p>{t("by_novelty")}</p>
          </div>
          <div
            onClick={() => {
              handleSort("alphabetical");
              setShowRange(!showRange);
            }}
            className={classes.dropdown__lang_item}
          >
            <p>{t("alphabetically")}</p>
          </div>
          <div
            onClick={() => {
              handleSort("price_asc");
              setShowRange(!showRange);
            }}
            className={classes.dropdown__lang_item}
          >
            <p>{t("lowest_price")}</p>
          </div>
          <div
            onClick={() => {
              handleSort("price_desc");
              setShowRange(!showRange);
            }}
            className={classes.dropdown__lang_item}
          >
            <p>{t("higest_price")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Sorting;
