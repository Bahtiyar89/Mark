import { BottomSheet } from "react-spring-bottom-sheet";
import classes from "./style.module.css";
import { Checkbox } from "components";
import { LoadingOverlay, RangeSlider, TextInput } from "@mantine/core";
import { ReactComponent as ChevronDown } from "assets/images/icons/shevron_down.svg";
import { ReactComponent as ChevronUp } from "assets/images/icons/shevron_up.svg";
import { ReactComponent as CloseIcon } from "assets/images/icons/CloseWhite.svg";
import "react-spring-bottom-sheet/dist/style.css";
import CategoryBrend from "pages/Home/Category/CategoryBrend";
import CategoryComponent from "components/CategoryComponent";
import CategoryRange from "../../CategoryRange";
import InputRange from "react-input-range";

interface Props {
  t?: any;
  form?: any;
  categories?: any;
  minPrice: any;
  maxPrice: any;
  shewronBrand?: boolean;
  openModal: boolean;
  shewronCategory: boolean;
  getCategory?: any;
  getSubCategory?: any;
  changeHandler?: any;
  handleMaxMinPrice?: any;
  handleShewronBrand?: (bool: any) => void;
  handleShewron: (bool: any) => void;
  handleGetProducts: any;
  onDismiss: () => void;
}

const CategoryBottomSheet = ({
  t,
  form,
  minPrice,
  maxPrice,
  openModal,
  categories,
  shewronBrand,
  shewronCategory,
  getCategory,
  getSubCategory,
  changeHandler,
  handleMaxMinPrice,
  handleShewronBrand,
  handleGetProducts,
  handleShewron,
  onDismiss,
}: Props) => {
  return (
    <BottomSheet
      style={{ zIndex: 1 }}
      open={openModal}
      onDismiss={() => onDismiss()}
    >
      <div className={classes.catalog__filter_}>
        <div
          onClick={() => handleShewron(!shewronCategory)}
          className={classes.categories}
        >
          <div className={classes.category}>
            <h5>{t("category")}</h5>

            {shewronCategory ? (
              <div
                onClick={() => handleShewron(false)}
                className={classes.shevDownUp}
              >
                <ChevronDown stroke={"#ffffff"} />
              </div>
            ) : (
              <div
                onClick={() => handleShewron(true)}
                className={classes.shevDownUp}
              >
                <ChevronUp stroke={"#ffffff"} />
              </div>
            )}
          </div>
          <CloseIcon onClick={() => onDismiss()} />
        </div>
        <CategoryComponent
          categories={categories}
          shewronCategory={shewronCategory}
          changeHandler={changeHandler}
        />

        {/*categories.map((category: any, idx: any) => {
          return (
            <>
              {shewronCategory && (
                <div style={{ marginTop: "3px" }}>
                  <Checkbox
                    inp={true}
                    key={idx}
                    checked={category.checked}
                    onChange={(event) => changeHandler(event, category?.slug)}
                    label={getCategory(category)}
                  />
                </div>
              )}

              {shewronCategory &&
                category.subcategories.map((sub: any, id: any) => {
                  return (
                    <div className={classes.items_checkbox}>
                      <Checkbox
                        inp={true}
                        key={id}
                        checked={sub.checked}
                        onChange={(event) => changeHandler(event, sub?.slug)}
                        label={getSubCategory(sub)}
                      />
                    </div>
                  );
                })}
            </>
          );
        })*/}
        <hr />
        <div className={classes.catalog__filter_slider_}>
          <h5>{t("price")}</h5>
          <div style={{ marginTop: 10, marginBottom: 30 }}>
            <InputRange
              maxValue={maxPrice == null ? 100 : parseInt(maxPrice)}
              minValue={minPrice == null ? 0 : parseInt(minPrice)}
              value={{
                min: form?.values?.min,
                max: form?.values?.max,
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
                    width: "115px",
                    borderRadius: 10,
                    height: "45px",
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                })}
                icon={t("from")}
                rightSection={"USD"}
                iconWidth={50}
                rightSectionWidth={45}
                value={form.values.min}
                {...form.getInputProps("min")}
              />
            </form>
            <form onSubmit={form.onSubmit(() => handleGetProducts())}>
              <TextInput
                styles={() => ({
                  input: {
                    width: "115px",
                    borderRadius: 10,
                    height: "45px",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 12,
                  },
                })}
                icon={t("to")}
                rightSection={"USD"}
                iconWidth={45}
                rightSectionWidth={45}
                value={form.values.max}
                {...form.getInputProps("max")}
              />
            </form>
          </div>
        </div>
        <hr style={{ marginTop: "20px" }} />
        <div
          onClick={() => handleShewronBrand?.(!shewronBrand)}
          className={classes.category}
        >
          <h5>{t("brand")}</h5>
          {shewronBrand ? (
            <div
              onClick={() => handleShewronBrand?.(false)}
              style={{ marginLeft: 5 }}
            >
              <ChevronDown />
            </div>
          ) : (
            <div
              onClick={() => handleShewronBrand?.(true)}
              style={{ marginLeft: 5 }}
            >
              <ChevronUp />
            </div>
          )}
        </div>
        <CategoryBrend shewronBrand={shewronBrand} />
      </div>
    </BottomSheet>
  );
};

export default CategoryBottomSheet;
