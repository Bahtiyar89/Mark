import React, { useContext, useState } from "react";
import { Card, LoadingOverlay, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { ReactComponent as ChevronDown } from "assets/images/icons/shevron_down.svg";
import { ReactComponent as ChevronUp } from "assets/images/icons/shevron_up.svg";
import ProductContext from "../../../context/products/ProductContext";
import { Checkbox } from "components";
import CategoryFilterMobile from "./CatalogFilterMobile";
import CategoryRange from "./CategoryRange";
import CategoryBrend from "./CategoryBrend";
import st from "./st.module.css";
import CategoryComponent from "components/CategoryComponent";
import { IconAt } from "@tabler/icons";
import { useForm } from "@mantine/form";
import Utils from "utils/Utils";
import InputRange from "react-input-range";

const { REACT_APP_BASE_URL } = process.env;

interface Props {
  form: any;
  categories: any;
  selectedCategoriesCount: number;
  changeHandler: any;
  handleMaxMinPrice: (val: any) => void;
  handleSort: (val: any) => void;
  handleGetProducts: () => void;
}

const Category = ({
  form,
  categories,
  selectedCategoriesCount,
  changeHandler,
  handleSort,
  handleMaxMinPrice,
  handleGetProducts,
}: Props) => {
  const productContext = useContext(ProductContext);
  const [t, i18n] = useTranslation();
  const { minPrice, maxPrice, loading_product } = productContext;

  const [shewronCategory, setShewronCategory] = useState(true);
  const [shewronBrand, setShewronBrand] = useState(true);

  const getCategory = (item: any) => {
    if (i18n.language == "en") {
      return item?.RecName_en;
    } else if (i18n.language == "ru") {
      return item?.RecName;
    } else {
      return item?.RecName_zh_hans;
    }
  };

  const getSubCategory = (item: any) => {
    if (i18n.language == "en") {
      return item?.RecName_en;
    } else if (i18n.language == "ru") {
      return item?.RecName;
    } else {
      return item?.RecName_zh_hans;
    }
  };

  return (
    <>
      <Card className={st.category} shadow="sm" p="lg" radius="md" withBorder>
        <div
          onClick={() => setShewronCategory(!shewronCategory)}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Text className={st.category_title}>{t("category")}</Text>
          {shewronCategory ? (
            <div
              onClick={() => setShewronCategory(false)}
              style={{ paddingLeft: 5 }}
            >
              <ChevronUp stroke={"#ffffff"} />
            </div>
          ) : (
            <div
              onClick={() => setShewronCategory(true)}
              style={{ paddingLeft: 5 }}
            >
              <ChevronDown stroke={"#ffffff"} />
            </div>
          )}
        </div>
        <CategoryComponent
          categories={categories}
          shewronCategory={shewronCategory}
          changeHandler={changeHandler}
        />

        <hr style={{ borderWidth: 0.1, borderStyle: "solid", color: "grey" }} />
        <div
          onClick={() => setShewronBrand(!shewronBrand)}
          style={{ paddingTop: 10, display: "flex", flexDirection: "row" }}
        >
          <Text className={st.category_title}>{t("brand")}</Text>
          {shewronBrand ? (
            <div
              onClick={() => setShewronBrand(false)}
              style={{ marginLeft: 5 }}
            >
              <ChevronDown />
            </div>
          ) : (
            <div
              onClick={() => setShewronBrand(true)}
              style={{ marginLeft: 5 }}
            >
              <ChevronUp />
            </div>
          )}
        </div>
        <CategoryBrend shewronBrand={shewronBrand} />
        <div className={st.catalog__filter_slider}>
          <hr
            style={{ borderWidth: 0.1, borderStyle: "solid", color: "grey" }}
          />
          <Text style={{ paddingTop: 10 }} className={st.category_title}>
            {t("price")}
          </Text>

          <div style={{ marginTop: 10, marginBottom: 30 }}>
            <InputRange
              maxValue={maxPrice == null ? 100 : parseInt(maxPrice)}
              minValue={minPrice == null ? 0 : parseInt(minPrice)}
              value={{
                min: form.values.min,
                max: form.values.max,
              }}
              onChange={(value: any) => {
                form.setFieldValue("min", value?.min);
                form.setFieldValue("max", value?.max);
              }}
              onChangeComplete={(value: any) => handleMaxMinPrice(value)}
            />
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <form onSubmit={form.onSubmit(() => handleGetProducts())}>
              <TextInput
                styles={() => ({
                  input: {
                    width: "105px",
                    borderRadius: 10,
                    height: "40px",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 13,
                  },
                })}
                icon={t("from")}
                rightSection={"USD"}
                iconWidth={48}
                rightSectionWidth={45}
                value={form.values.min}
                {...form.getInputProps("min")}
              />
            </form>
            <form onSubmit={form.onSubmit(() => handleGetProducts())}>
              <TextInput
                styles={() => ({
                  input: {
                    width: "105px",
                    borderRadius: 10,
                    height: "40px",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 13,
                  },
                })}
                icon={t("to")}
                rightSection={"USD"}
                rightSectionWidth={40}
                value={form.values.max}
                {...form.getInputProps("max")}
              />
            </form>
          </div>
        </div>
      </Card>
      <div className={st.category_}>
        <CategoryFilterMobile
          t={t}
          form={form}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedCategoriesCount={selectedCategoriesCount}
          categories={categories}
          shewronBrand={shewronBrand}
          handleSort={handleSort}
          getCategory={getCategory}
          getSubCategory={getSubCategory}
          changeHandler={changeHandler}
          handleMaxMinPrice={handleMaxMinPrice}
          handleGetProducts={handleGetProducts}
          handleShewronBrand={(val) => setShewronBrand(val)}
        />
      </div>
    </>
  );
};

export default React.memo(Category);
