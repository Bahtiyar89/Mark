import React, { useEffect, useState, useContext, useCallback } from "react";
import { Container, Grid, Indicator } from "@mantine/core";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductContext from "../../context/products/ProductContext";
import { SearchInput } from "components";
import { ReactComponent as RUserIcon } from "assets/images/header/r-user.svg";
import { ReactComponent as BasketIcon } from "assets/images/header/basket.svg";
import { ReactComponent as IconLogo } from "assets/images/header/icon_logo.svg";
import DropdownLanguage from "./dropdown-language/DropdownLanguage";
import classes from "./style.module.css";

function Header() {
  const [t, i18n] = useTranslation();
  const productContext = useContext(ProductContext);
  const {
    basket,
    getProductsByCategories,
    searchTxt,
    globalSearchChanged,
    clearCategory,
  } = productContext;

  const [showSearch, setShowSearch] = useState(false);

  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    window.location.href.split("/").map((val, idx) => {
      if (val === "basket") {
        setShowSearch(false);
      } else {
        setShowSearch(true);
      }
    });
  }, [window.location.href, showSearch]);

  const onSearchChanged = useCallback((e) => {
    if (e.target.value.length) {
      setErrorName("");
    }
    globalSearchChanged(e.target.value);
  }, [globalSearchChanged]);

  const onSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchTxt.length > 2) {
      clearCategory(true);
      getProductsByCategories(`query=${searchTxt}&lang=ru`);
      setErrorName("");
    } else {
      setErrorName(t("empty_input_error"));
    }
  }, [clearCategory, getProductsByCategories, searchTxt, t]);

  return (
    <Container fluid>
      <div className={classes.medialower}>
        <Grid grow gutter={"xs"}>
          <Grid.Col xs={12} sm={12} md={4} lg={3} xl={3}>
            <div className={classes.logo_wrapper}>
              <Link to={"/"}>
                <IconLogo />
              </Link>
              <div className={classes.drop_lang}>
                <Link className={classes.profile_style} to={"/profile"}>
                  <RUserIcon width={35} height={35} />
                </Link>
                <Link className={classes.basket_style} to={"/basket"}>
                  <Indicator
                    inline
                    label={basket?.length}
                    color="red"
                    size={16}
                  >
                    <BasketIcon width={35} height={35} />
                  </Indicator>
                </Link>

                <DropdownLanguage color={"black"} />
              </div>
            </div>
          </Grid.Col>
          <Grid.Col xs={12} sm={12} md={4} lg={3} xl={6}>
            {showSearch && (
              <div className={classes.search}>
                <SearchInput
                  searchTxt={searchTxt}
                  errorName={errorName}
                  placeholder={t("search_by_product")}
                  onSearchChanged={onSearchChanged}
                  onSearchSubmit={onSearchSubmit}
                />
              </div>
            )}
          </Grid.Col>
          <Grid.Col xs={0} sm={3} md={2} lg={3} xl={3}>
            <div className={classes.hideGrid}>
              <Link className={classes.profile} to={"/profile"}>
                <RUserIcon />
              </Link>
              <Link className={classes.basket} to={"/basket"}>
                <Indicator inline label={basket?.length} color="red" size={16}>
                  <BasketIcon />
                </Indicator>
              </Link>
              <span className={classes.drop}>
                <DropdownLanguage color={"black"} />
              </span>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </Container>
  );
}

export default React.memo(Header);
