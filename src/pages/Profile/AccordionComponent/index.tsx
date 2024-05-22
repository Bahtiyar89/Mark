import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import ProductContext from "../../../context/products/ProductContext";
import { ReactComponent as ChevronDown } from "assets/images/icons/shevron_down.svg";
import { ReactComponent as ChevronUp } from "assets/images/icons/shevron_up.svg";
import classes from "./style.module.css";
import {
  Button,
  Card,
  Grid,
  LoadingOverlay,
  SimpleGrid,
  UnstyledButton,
} from "@mantine/core";
import TextTranslate from "components/TextTranslate";
import AddReviewModal from "pages/DetailedProduct/AddReviewModal";
import { useForm } from "@mantine/form";
import Header from "./Header";

const { REACT_APP_BASE_URL } = process.env;

const AccordionComponent = ({
  orderDetails,
  handleShowDetails,
  handleShowOrder,
  RecID,
  status,
  total_price,
  cancelOrder,
  payment_status,
  loading_order,
  showControl,
}: any) => {
  const [t, i18n] = useTranslation();
  const { addToast } = useToasts();
  const [openedAdd, setOpenedAdd] = useState(false);
  const [idProduct, setIdProduct] = useState("");

  const productContext = useContext(ProductContext);
  const { postReview, postReviewImage } = productContext;

  const form = useForm({
    initialValues: {
      name: "",
      text: "",
      rating: 0,
      image: "",
    },

    validate: {
      // country: (value) => (value?.length < 1 ? "Выберите страну" : null),
      name: (value: string) => (value?.length < 3 ? t("name") : null),
      text: (value: string) => (value.length < 3 ? t("text") : null),
    },
  });

  const handleDetailes = (id: number) => {
    handleShowDetails(id);
  };

  const handleGood = (item: any) => {
    return (
      (Math.round(item.RecAmount * item.RecPrice * 100) / 100).toFixed(2) +
      " USD"
    );
  };

  const handlePayment = () => {
    if (payment_status === "processing") {
      return;
    }
    if (orderDetails?.status?.code === 1 || orderDetails?.status?.code === 0) {
      return (
        <>
          {status?.RecName != "Canceled" && (
            <Button
              mt={10}
              bg={"#FA0100"}
              onClick={() => {
                cancelOrder(RecID);
              }}
              variant="filled"
              fullWidth
            >
              {t("cancel")}
            </Button>
          )}
          {orderDetails.payment_status === "not paid" && (
            <Button
              mt={10}
              onClick={() => console.log("ccc")}
              variant="filled"
              fullWidth
            >
              {t("pay")}
            </Button>
          )}
        </>
      );
    }
  };

  const ratingSumbit = async (id: any) => {
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
      console.log("img ", img);

      // @ts-ignore
      formData.append("image", img.data);
      postReviewImage(idProduct, formData);
    } else {
      postReview(idProduct, formData);
    }
    setOpenedAdd(false);
    /*
    const response = await fetch(
      `${REACT_APP_BASE_URL}/reviews/products/${id}/`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response) alert(response.statusText);
   */
  };

  const handleLeaveReview = (id: any) => {
    setOpenedAdd(true);
    setIdProduct(id);
  };

  const handleCopy = (code: any) => {
    navigator.clipboard.writeText(code);
    addToast(t("successfully_copied"), {
      appearance: "success",
    });
  };

  return (
    <article className={classes.question}>
      <LoadingOverlay visible={loading_order} overlayBlur={0} />
      <div className={classes.order_wrapper}>
        <h4>№{RecID}</h4>
        <h4 style={status?.code == 0 ? { color: "#3900DB" } : { color: "red" }}>
          {t("order_status")}: <TextTranslate item={status} />
        </h4>
      </div>
      <Header
        handleDetailes={handleDetailes}
        handleShowOrder={handleShowOrder}
        RecID={RecID}
        total_price={total_price}
        payment_status={payment_status}
        showControl={showControl}
      />
      {RecID == showControl.RecID && showControl.show && (
        <>
          <h4>{t("deliveries")}:</h4>
          {orderDetails?.cspecorder_set?.map((item: any, idx: number) => {
            return (
              <>
                <Card shadow="sm" p="lg" mb={10} radius="md" withBorder>
                  {orderDetails?.shipments?.map(
                    (shipment: any, idx: number) => {
                      console.log("item: ", shipment);

                      if (
                        item.RecTradeSubjectId.warehouse ===
                        shipment.warehouse.id
                      ) {
                        return (
                          <>
                            {shipment.status && (
                              <>
                                <div style={{ display: "flex" }}>
                                  <p className={classes.detail_p}>
                                    {t("status")}
                                  </p>
                                  <p className={classes.detail_p2}>
                                    {shipment.status}
                                  </p>
                                </div>
                                <hr />
                              </>
                            )}

                            {shipment.tracking_code && (
                              <>
                                <div style={{ display: "flex" }}>
                                  <p className={classes.detail_p}>
                                    {t("tracking_code")}
                                  </p>
                                  <UnstyledButton
                                    style={{ color: "#4E8BFF" }}
                                    onClick={() => handleCopy(shipment)}
                                    className={classes.detail_p2}
                                  >
                                    {shipment.tracking_code}
                                  </UnstyledButton>
                                </div>
                                <hr />
                              </>
                            )}

                            {shipment.warehouse.RecName && (
                              <>
                                <div style={{ display: "flex" }}>
                                  <p className={classes.detail_p}>
                                    {t("warehouse")}
                                  </p>
                                  <p className={classes.detail_p2}>
                                    <TextTranslate item={shipment.warehouse} />
                                  </p>
                                </div>
                                <hr />
                              </>
                            )}
                          </>
                        );
                      }
                    }
                  )}

                  <Card.Section inheritPadding mt="sm" pb="md">
                    <Grid>
                      <Grid.Col span={4}>
                        <img
                          className={classes.img}
                          src={`${REACT_APP_BASE_URL}/${item.RecTradeSubjectId?.RecPict}`}
                          alt={t("photo")}
                        />
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <p className={classes.detail_header}>
                          <TextTranslate item={item.RecTradeSubjectId} />
                        </p>
                        <div
                          style={{
                            paddingTop: 10,
                            display: "flex",
                            justifyContent:
                              status?.code == 3 ? "space-between" : "start",
                          }}
                        >
                          <p className={classes.detail_p}>
                            {item.RecAmount} {t("good")}
                          </p>
                          <p className={classes.detail_p2}>
                            {handleGood(item)}
                          </p>
                          {status?.code == 3 && (
                            <Button
                              onClick={() =>
                                handleLeaveReview(item.RecTradeSubjectId.RecID)
                              }
                              bg={"#FA0100"}
                            >
                              {t("leave_feedback")}
                            </Button>
                          )}
                        </div>
                        <hr />
                      </Grid.Col>
                    </Grid>
                    <SimpleGrid cols={2}></SimpleGrid>
                  </Card.Section>
                </Card>
              </>
            );
          })}

          <div style={{ display: "flex" }}>
            <p className={classes.detail_p}>{t("delivery")}</p>
            <p className={classes.detail_p2}>
              {Number.parseFloat(orderDetails?.delivery_price).toFixed(2)} USD
            </p>
          </div>
          <hr />
          <div style={{ display: "flex" }}>
            <p className={classes.detail_p}>{t("total")}</p>
            <p className={classes.detail_p2}>
              {(Math.round(total_price * 100) / 100).toFixed(2)} USD
            </p>
          </div>
          <hr />
          <div style={{ display: "flex" }}>
            <p className={classes.detail_p}>{t("phone_number")}</p>
            <p className={classes.detail_p2}>{orderDetails.receiver_number}</p>
          </div>
          <hr />
          <div style={{ display: "flex" }}>
            <p className={classes.detail_p}>{t("receiver_fio")}</p>
            <p className={classes.detail_p2}>{orderDetails.receiver_fio}</p>
          </div>
          <hr />
          <div style={{ display: "flex" }}>
            <p className={classes.detail_p}>{t("adress")}</p>
            <p className={classes.detail_p2}>
              {orderDetails.RecLogisticInfo}
              {", "}
              <span>
                {i18n.language == "en"
                  ? orderDetails?.country?.name_en
                  : i18n.language == "ru"
                  ? orderDetails?.country?.name_ru
                  : orderDetails?.country?.name}
              </span>{" "}
            </p>
          </div>
          {orderDetails.tracking_code != null && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p>{t("tracking_code")}:</p>
              <p style={{ paddingLeft: 10 }}>{orderDetails.tracking_code}</p>
            </div>
          )}
          {handlePayment()}
        </>
      )}

      <AddReviewModal
        opened={openedAdd}
        form={form}
        t={t}
        handleOpened={() => setOpenedAdd(false)}
        onSubmit={ratingSumbit}
      />
    </article>
  );
};

export default AccordionComponent;
