import { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Container, Pagination } from "@mantine/core";
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import TextTranslate from "components/TextTranslate";
import BreadCrumb from "containers/BreadCrumb";
import style from "./style.module.css";
import AuthContext from "context/auth/AuthContext";
import { ReactComponent as LeftArrow } from "assets/LeftArrow.svg";
import { ReactComponent as RightArrow } from "assets/RightArrow.svg";
import ProductContext from "../../context/products/ProductContext";
import { IconBasket } from "@tabler/icons";
import ProductReview from "./ProductReview";
import AddReviewModal from "./AddReviewModal";
import Utils from "utils/Utils";

const DetailedProduct = () => {
  const { addToast } = useToasts();
  const productContext = useContext(ProductContext);
  const authContext = useContext(AuthContext);
  const { isSigned, signin } = authContext;
  const {
    can_review,
    getDetailedProduct,
    getReviewProduct,
    checkGetReviewProduct,
    addProductToBasket,
    product_detail,
    product_review,
    postReview,
    postReviewImage,
    postReviewCommit,
  } = productContext;

  const [t, i18n] = useTranslation();
  const slider = useRef<any>(null);
  const { id } = useParams();
  const [openedAdd, setOpenedAdd] = useState(false);
  const [detailedProduct, setDetailedProduct] = useState({
    RecID: 0,
    category_name: "",
    pics: [],
    RecDTCreate: "",
    RecDtUpdate: "",
    RecName: "",
    RecName_zh_hans: "",
    RecName_ru: "",
    RecName_en: "",
    description: "",
    description_zh_hans: "",
    description_ru: "",
    description_en: "",
    RecMinAmount: 0,
    in_stock: 0,
    RecAddrRecipient: "",
    RecPict: "",
    RecPrice: "",
    RecWeight: 0,
    views: 0,
    length: null,
    width: null,
    height: null,
    rating: "",
    RecGroupId: 0,
    Seller: null,
    RecIngredients: [],
    RecMarkups: [],
  });
  const [commit, setCommit] = useState({
    name: "",
    text: "",
  });

  const form = useForm({
    initialValues: {
      name: "",
      text: "",
      rating: 0,
      image: "",
    },

    validate: {
      // country: (value) => (value?.length < 1 ? "Выберите страну" : null),
      name: (value: string) => (value?.length < 3 ? t("enter_name") : null),
      text: (value: string) => (value.length < 3 ? t("enter_text") : null),
    },
  });

  const settings = {
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const renderArrows = () => {
    const handleLeft = () => {
      const sliderElement = slider.current;
      if (sliderElement) {
        sliderElement.slickPrev();
      }
    };
    const handleRight = () => {
      const sliderElement = slider.current;
      if (sliderElement) {
        sliderElement.slickNext();
      }
    };
    return (
      <div className={style.slider__arrow}>
        <button className={style.slider__left_btn} onClick={handleLeft}>
          <LeftArrow />
        </button>
        <button className={style.slider__right_btn} onClick={handleRight}>
          <RightArrow />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      getDetailedProduct(id);
      getReviewProduct(id, 1);
      checkGetReviewProduct(id, 1);
      setDetailedProduct(product_detail);
    }
  }, [id]);
  useEffect(() => {
    setDetailedProduct(product_detail);
  }, [product_detail]);

  const handleAddToCard = (product: any) => {
    addToast(t("successfully_added_to_cart"), { appearance: "success" });
    addProductToBasket(product);
  };

  const ratingSumbit = async () => {
    const formData = new FormData();
    formData.append("name", form.values.name);
    formData.append("text", form.values.text);
    formData.append("rating", form.values.rating.toString());

    if (form.values.image != "") {
      const img = {
        // @ts-ignore
        preview: URL.createObjectURL(form.values.image),
        data: form.values.image,
      };
      // @ts-ignore
      formData.append("image", img.data);
      postReviewImage(id, formData);
      form.reset();
      setOpenedAdd(false);
    } else {
      postReview(id, formData);
      form.reset();
      setOpenedAdd(false);
    }
  };

  const handleSign = async (address: string) => {
    const { message, signature } = await Utils.getSignature();
    await setOpenedAdd(true);
    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };

  const handleReview = () => {
    if (isSigned) {
      setOpenedAdd(true);
    } else {
      if (window.ethereum) {
        window.ethereum
          .request?.({ method: "eth_requestAccounts" })
          .then(async (res) => {
            handleSign(res[0]);
          })
          .catch((error) => {
            addToast(t("please_login_to_metamask"), {
              appearance: "error",
            });
          });
      }
    }
  };

  const handleChangePage = (count: any) => {
    getReviewProduct(id, count);
  };

  const handleCommitChange = (e: any) => {
    const { name, value } = e.target;
    setCommit({ ...commit, [name]: value });
  };

  const commitSubmit = (review_id: any) => {
    const obj = {
      name: commit.name,
      text: commit.text,
      product: id,
      parent: review_id,
    };

    postReviewCommit(obj);
    setCommit({ ...commit, name: "", text: "" });
  };

  return (
    <>
      <Helmet>
        <title>{product_detail?.RecName}</title>
        <meta name="description" content={product_detail.description_en} />
      </Helmet>
      <Container fluid>
        <div className={style.medialower}>
          <div className={style.first_column_breadcrump}>
            <BreadCrumb />
          </div>
          <p style={{ fontSize: 20, paddingLeft: 5, paddingBottom: 10 }}>
            <TextTranslate item={product_detail} />
          </p>
          <div className={style.wrapper_content}>
            <div className={style.first_column}>
              <Card
                className={style.slider_card}
                shadow="sm"
                p={"xs"}
                radius="md"
                withBorder
              >
                {renderArrows()}
                <Slider ref={slider} {...settings}>
                  <div>
                    <div
                      style={{
                        display: "grid",
                        placeContent: "center",
                        height: "350px",
                      }}
                    >
                      <img
                        style={{
                          objectFit: "cover",
                          margin: "auto",
                          maxHeight: "350px",
                        }}
                        src={`https://marketapi.swttoken.com/${product_detail?.RecPict}`}
                      />
                    </div>
                  </div>
                </Slider>
              </Card>

              <div className={style.mobile_second_column_wrapper}>
                <p
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                    lineHeight: "32px",
                    fontSize: 28,
                  }}
                >
                  {product_detail.RecPrice} USD
                </p>

                <Button
                  bg={"#FA0100"}
                  color="red"
                  leftIcon={<IconBasket size={20} />}
                  loaderPosition="right"
                  size={"md"}
                  onClick={() => handleAddToCard(detailedProduct)}
                >
                  {t("add_to_cart")}
                </Button>
              </div>

              <div style={{ paddingTop: 20 }}>
                <h2>{t("description")}</h2>
                <p>
                  <TextTranslate
                    item={{
                      RecName_en: product_detail.description_en,
                      RecName_ru: product_detail.description_ru,
                      RecName_zh_hans: product_detail.description_zh_hans,
                    }}
                  />
                </p>
                <h2 style={{ paddingTop: 10, paddingBottom: 10 }}>
                  {t("characteristic")}
                </h2>
                <div style={{ display: "flex" }}>
                  <p style={{ width: "40%" }}>{t("weight")}</p>
                  <p>
                    {product_detail.RecWeight} {t("gr")}
                  </p>
                </div>
                <hr />
                <div style={{ display: "flex" }}>
                  <p style={{ width: "40%" }}>{t("views")}</p>
                  <p>{product_detail.views}</p>
                </div>
                <hr />
                <div style={{ display: "flex" }}>
                  <p style={{ width: "40%" }}>{t("quantity")}</p>
                  <p>
                    {product_detail.in_stock} {t("items")}
                  </p>
                </div>
                <hr />
              </div>

              <ProductReview
                t={t}
                commitSubmit={commitSubmit}
                commit={commit}
                handleCommitChange={handleCommitChange}
                can_review={can_review}
                product_review={product_review}
                handleReview={handleReview}
                handleChangePage={handleChangePage}
              />
            </div>

            <div className={style.second_column}>
              <div
                style={{
                  paddingTop: 40,
                  display: "flex",
                  flexDirection: "column",
                  height: "90%",
                }}
              >
                <p style={{ lineHeight: "42px", fontSize: 38 }}>
                  {product_detail.RecPrice} USD
                </p>
                <Button
                  fullWidth={false}
                  style={{ marginTop: 10, width: 200 }}
                  bg={"#FA0100"}
                  color="red"
                  leftIcon={<IconBasket size={20} />}
                  loaderPosition="right"
                  size={"md"}
                  onClick={() => handleAddToCard(detailedProduct)}
                >
                  {t("add_to_cart")}
                </Button>
                <p
                  style={{
                    paddingTop: 10,
                    fontSize: 14,
                    color: product_detail.in_stock === 0 ? "red" : "#1B76CF",
                  }}
                >
                  {product_detail.in_stock === 0
                    ? t("sold_out")
                    : product_detail.in_stock + " " + t("items")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AddReviewModal
          opened={openedAdd}
          form={form}
          t={t}
          handleOpened={() => setOpenedAdd(false)}
          onSubmit={ratingSumbit}
        />
      </Container>
    </>
  );
};

export default DetailedProduct;
