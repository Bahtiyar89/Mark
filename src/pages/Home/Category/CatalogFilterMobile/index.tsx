import { useState } from "react";
import { LoadingOverlay, Popover, UnstyledButton } from "@mantine/core";
import { ReactComponent as ArrowUpDown } from "assets/images/icons/ArrowUpDown.svg";
import "react-spring-bottom-sheet/dist/style.css";
import CategoryBottomSheet from "./CategoryBottomSheet";
import classes from "./style.module.css";

interface Props {
  t?: any;
  form?: any;
  categories?: any;
  minPrice?: any;
  maxPrice?: any;
  selectedCategoriesCount?: any;
  shewronBrand?: boolean;
  handleSort?: any;
  getCategory?: (item: any) => void;
  getSubCategory?: (item: any) => void;
  changeHandler?: (item: any, slag: any | undefined) => void;
  handleMaxMinPrice?: (item: any) => void;
  handleShewronBrand?: (bool: any) => void;
  handleGetProducts?: () => void;
}

const CategoryFilterMobile = ({
  t,
  form,
  categories,
  minPrice,
  maxPrice,
  shewronBrand,
  selectedCategoriesCount,
  handleSort,
  getCategory,
  getSubCategory,
  changeHandler,
  handleMaxMinPrice,
  handleGetProducts,
  handleShewronBrand,
}: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("by_novelty");
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const [shewronCategory, setShewronCategory] = useState<boolean>(true);

  const onDismiss = () => {
    setOpenModal(false);
  };

  const handleShewron = (shew: boolean) => {
    setShewronCategory(shew);
  };

  return (
    <>
      <div className={classes.catalog__filter_mobile}>
        <UnstyledButton
          onClick={() => setOpenModal(true)}
          className={classes.header}
        >
          <h5>{t("filters")}</h5>
          <p className={classes.selected_categories}>
            {selectedCategoriesCount}
          </p>
        </UnstyledButton>

        <Popover
          opened={openTooltip}
          width={200}
          position="bottom"
          withArrow
          shadow="md"
          closeOnClickOutside={true}
          onClose={() => setOpenTooltip(false)}
        >
          <Popover.Target>
            <UnstyledButton
              onClick={() => setOpenTooltip(!openTooltip)}
              className={classes.header}
            >
              <ArrowUpDown />

              <span style={{ paddingLeft: "5px", color: "#ffffff" }}>
                {t(`${title}`)}
              </span>
            </UnstyledButton>
          </Popover.Target>
          <Popover.Dropdown>
            <div style={{ color: "#000" }}>
              <UnstyledButton
                onClick={() => {
                  handleSort("newest");
                  setTitle("by_novelty");
                  setOpenTooltip(false);
                }}
                className={classes.dropdown__lang_item}
              >
                <p>{t("by_novelty")}</p>
              </UnstyledButton>
              <UnstyledButton
                onClick={() => {
                  handleSort("alphabetical");
                  setTitle("alphabetically");
                  setOpenTooltip(false);
                }}
                className={classes.dropdown__lang_item}
              >
                <p>{t("alphabetically")}</p>
              </UnstyledButton>
              <UnstyledButton
                onClick={() => {
                  handleSort("price_asc");
                  setTitle("lowest_price");
                  setOpenTooltip(false);
                }}
                className={classes.dropdown__lang_item}
              >
                <p>{t("lowest_price")}</p>
              </UnstyledButton>
              <UnstyledButton
                onClick={() => {
                  handleSort("price_desc");
                  setTitle("higest_price");
                  setOpenTooltip(false);
                }}
                className={classes.dropdown__lang_item}
              >
                <p>{t("higest_price")}</p>
              </UnstyledButton>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>

      <CategoryBottomSheet
        t={t}
        form={form}
        minPrice={minPrice}
        maxPrice={maxPrice}
        openModal={openModal}
        shewronCategory={shewronCategory}
        categories={categories}
        shewronBrand={shewronBrand}
        getCategory={getCategory}
        handleGetProducts={handleGetProducts}
        getSubCategory={getSubCategory}
        handleShewron={handleShewron}
        changeHandler={changeHandler}
        onDismiss={onDismiss}
        handleMaxMinPrice={handleMaxMinPrice}
        handleShewronBrand={handleShewronBrand}
      />
    </>
  );
};

export default CategoryFilterMobile;
