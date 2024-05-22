import React, { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { Container, Grid, Button, Card, LoadingOverlay } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ProductContext from "../../context/products/ProductContext";
import Sorting from "./Sorting";
import Category from "./Category";
import ShowMore from "containers/ShowMore";
import SliderMain from "./SliderMain";
import { IconBasket } from "@tabler/icons";
import TextTranslate from "components/TextTranslate";
import st from "./st.module.css";
import { CategoryAction } from "components/CategoryComponent/CategoryModels";
import { useForm } from "@mantine/form";
import { Helmet } from "react-helmet";

const { REACT_APP_BASE_URL } = process.env;

function Home() {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [t, i18n] = useTranslation();
  const productContext = useContext(ProductContext);
  const {
    allProductsCount,
    allProducts,
    getProductsByCategories,
    loading_product,
    addProductToBasket,
    minPrice,
    maxPrice,
    searchTxt,
    clear_category,
    clearCategory,
  } = productContext;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [sorteBy, setSorteBy] = useState<string>("newest");
  const [selectedCategories, setSelectedCategories] = useState<any>(undefined);

  const [devidePage, setDevidePage] = useState(24);
  const [categories, setCategories] = useState<CategoryAction[]>([]);
  const [selectedCategoriesCount, setSelectedCategoriesCount] = useState(0);

  const form = useForm({
    initialValues: {
      min: "",
      max: "",
    },
  });

  const getPagination = (page: any) => {
    console.log("page:: :", page);

    const params = new URLSearchParams();

    if (sorteBy != undefined) {
      params.append("sort_by", sorteBy);
    }
    if (minPrice != undefined) {
      params.append("min_price", minPrice);
    }
    if (maxPrice != undefined) {
      params.append("max_price", maxPrice);
    }

    // @ts-ignore
    params.append("page", page);
    params.append("page_size", devidePage.toString());

    if (selectedCategories != "" && selectedCategories != undefined) {
      getProductsByCategories(`${params.toString()}&${selectedCategories}`);
    } else {
      getProductsByCategories(`${params.toString()}`);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showMore = (val: number) => {
    setDevidePage((currentPage + 1) * devidePage);
    const params = new URLSearchParams();

    if (sorteBy != undefined) {
      params.append("sort_by", sorteBy);
    }
    if (minPrice != undefined) {
      params.append("min_price", form.values.min);
    }
    if (maxPrice != undefined) {
      params.append("max_price", form.values.max);
    }

    // @ts-ignore
    params.append("page", 1);
    params.append("page_size", ((val + 1) * devidePage).toString());
    console.log("params.toString() ", params.toString());

    if (selectedCategories != "" && selectedCategories != undefined) {
      getProductsByCategories(`${params.toString()}&${selectedCategories}`);
    } else {
      getProductsByCategories(`${params.toString()}`);
    }
  };

  const navigatDetailed = (id: any) => {
    navigate(`/detailed/${id}`);
  };

  const handleSubtractProduct = (product: any) => {
    if (product.in_stock === 0) {
      addToast(t("out_stock_form_again_later"), {
        appearance: "error",
      });
    } else {
      addToast(t("successfully_added_to_cart"), { appearance: "success" });
      console.log("addProductToBasket ", product);

      addProductToBasket(product);
    }
  };

  const handleGetProducts = () => {
    const params = new URLSearchParams();

    if (sorteBy != undefined) {
      params.append("sort_by", sorteBy);
    }
    console.log("form.values.min: ", form.values.min == "");

    if (form.values.min != "") {
      params.append("min_price", form.values.min);
    }
    if (form.values.max != "") {
      params.append("max_price", form.values.max);
    }
    if (searchTxt != "") {
      params.append("query", searchTxt);
      params.append("lang", "ru");
    }

    // @ts-ignore
    params.append("page", 1);
    params.append("page_size", devidePage.toString());

    if (selectedCategories != "" && selectedCategories != undefined) {
      getProductsByCategories(`${params.toString()}&${selectedCategories}`);
    } else {
      getProductsByCategories(`${params.toString()}`);
    }
    setDevidePage(24);
  };

  const handleSort = (sortingby: any) => {
    setSorteBy(sortingby);
  };

  const handleSelecedCategories = (categories: any) => {
    setSelectedCategories(categories);
    setDevidePage(24);
  };

  const handleMaxMinPrice = (maxmin: any) => {
    const params = new URLSearchParams();

    if (sorteBy != undefined) {
      params.append("sort_by", sorteBy);
    }
    if (minPrice != undefined) {
      params.append("min_price", maxmin.min);
    }
    if (maxPrice != undefined) {
      params.append("max_price", maxmin.max);
    }

    // @ts-ignore
    params.append("page", 1);
    params.append("page_size", (devidePage * 24).toString());

    if (selectedCategories != "" && selectedCategories != undefined) {
      getProductsByCategories(`${params.toString()}&${selectedCategories}`);
    } else {
      getProductsByCategories(`${params.toString()}`);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    handleGetProducts();
  }, [selectedCategories, sorteBy]);

  useEffect(() => {
    const en = { event: { currentTarget: { checked: false } } };
    for (let index = 0; index < categories.length; index++) {
      const element = categories[index];
      console.log("element: ", element);
      changeHandler(en.event, element.slug);
    }
    clearCategory(false);
  }, [clear_category]);

  const changeHandler = (event: any, slug: any) => {
    console.log("event: ", event);
    console.log("slug: ", slug);

    const newCategory: any[] = [];

    let countTrue = 0;

    for (const k in categories) {
      if (categories[k]?.slug === slug) {
        categories[k].checked = event.currentTarget.checked;
      }
      newCategory.push(categories[k]);
    }

    for (let p of categories) {
      for (let i of p.subcategories) {
        if (i.checked) {
          countTrue = countTrue + 1;
        }
      }
    }

    setSelectedCategoriesCount(countTrue);

    const searchArr = [];

    for (const c in categories) {
      if (categories[c].checked) {
        searchArr.push({ name: "categories", value: categories[c].RecID });
      }
      for (let index = 0; index < categories[c].subcategories.length; index++) {
        const element = categories[c].subcategories[index];

        if (element.checked) {
          searchArr.push({ name: "categories", value: element.RecID });
        }
      }
    }

    const filtered = searchArr
      .map(({ name, value }) => `${name}=${value}`)
      .join("&");
    console.log("filtered: 5", filtered);

    handleSelecedCategories(filtered);
    setCategories(newCategory);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${REACT_APP_BASE_URL}/ru/catalog/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.log("error22", error));
  }, []);

  useEffect(() => {
    if (minPrice != null && maxPrice != null) {
      form.setFieldValue("min", minPrice);
      form.setFieldValue("max", maxPrice);
    }
  }, [minPrice, maxPrice]);

  return (
    <>
      <Helmet>
        <title>SWT marketplace</title>
        <meta
          name="description"
          content={"SWT marketplace with Russian goods for Chinese market"}
        />
      </Helmet>
      <div className={st.loader_mobile}>
        <LoadingOverlay visible={loading_product} overlayBlur={0} />
      </div>
      <Container style={{ position: "relative", minHeight: '100vh' }} fluid>
        <div className={st.loader_web}>
          <LoadingOverlay visible={loading_product} overlayBlur={0} />
        </div>
        <div className={st.medialower}>
          <div className={st.home}>
            <SliderMain changeHandler={changeHandler} />
            <Sorting
              sorteBy={sorteBy}
              handleSort={handleSort}
            />
            <Grid grow gutter={"xs"}>
              <Grid.Col xs={12} sm={12} md={4} lg={3} xl={2.5}>
                <Category
                  form={form}
                  selectedCategoriesCount={selectedCategoriesCount}
                  categories={categories}
                  handleSort={handleSort}
                  handleMaxMinPrice={handleMaxMinPrice}
                  changeHandler={changeHandler}
                  handleGetProducts={handleGetProducts}
                />
              </Grid.Col>
              {allProducts.length !== 0 && (<Grid.Col xs={12} sm={12} md={8} lg={9} xl={9.5}>
                <Grid gutter={"xs"}>
                  {allProducts.map((product: any, idx: any) => {
                    return (
                      <Grid.Col key={idx} xs={6} sm={6} md={6} lg={4} xl={3}>
                        <Card
                          className={st.card1}
                          shadow="sm"
                          p={"xs"}
                          radius="md"
                          withBorder
                        >
                          <div onClick={() => navigatDetailed(product.RecID)}>
                            {product?.RecPict != null && (
                              <img
                                style={{
                                  maxHeight: "230px",
                                  objectFit: "cover",
                                  margin: "auto",
                                  borderRadius: 3,
                                }}
                                src={`https://marketapi.swttoken.com/${product?.RecPict}`}
                                alt=""
                              />
                            )}
                          </div>

                          <div className={st.text_wrapper}>
                            <div
                              onClick={() => navigatDetailed(product.RecID)}
                              className={st.textwr}
                            >
                              <p className={st.prname}>
                                <TextTranslate item={product} />
                              </p>
                              <p className={st.prprice}>
                                {product?.RecPrice} USD
                              </p>
                            </div>

                            <p className={st.stocktxt}>
                              {product.in_stock === 0 ? (
                                <span style={{ color: "red" }}>
                                  {t("sold_out")}
                                </span>
                              ) : (
                                <span style={{ color: "green" }}>
                                  {t("in_stock")} {product.in_stock}{" "}
                                  {t("items")}
                                </span>
                              )}
                            </p>
                            <Button
                              className={st.stockbtn}
                              bg={"#FA0100"}
                              color="red"
                              leftIcon={<IconBasket size={20} />}
                              loaderPosition="right"
                              onClick={() => handleSubtractProduct(product)}
                            >
                              {t("add_to_cart")}
                            </Button>
                          </div>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>

                {allProducts.length > 0 ? (
                  <ShowMore
                    devidePage={devidePage}
                    allProductsCount={allProductsCount}
                    currentPage={currentPage}
                    getPagination={getPagination}
                    showMore={showMore}
                  />
                ) : (
                  <p className={t("center_no_products")}>
                    {t("by_selected_category_no_products")}
                  </p>
                )}
              </Grid.Col>)}
            </Grid>
          </div>
        </div>
      </Container>
    </>
  );
}

export default React.memo(Home);
