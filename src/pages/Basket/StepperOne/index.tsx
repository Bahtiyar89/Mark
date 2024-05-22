import { Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Trash } from "assets/images/icons/Trash.svg";
import { ChangeButton } from "components";
import TextTranslate from "components/TextTranslate";
import classes from "./style.module.css";

const { REACT_APP_BASE_URL } = process.env;

const StepperOne = ({
  payment,
  basket,
  addProductToBasket,
  handleSubtractProduct,
  handleTrash,
  nextStep,
}: any) => {
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  const navigatDetailed = (id: any) => {
    navigate(`/${id}`);
  };
  console.log("payment: ", payment);

  return (
    <>
      <h3>{t("basket")}</h3>

      {basket.map((item: any) => {
        return (
          <div className={classes.content_wrapper}>
            <div className={classes.image_wrapper}>
              {item?.RecPict != null && (
                <img
                  src={`${REACT_APP_BASE_URL}${item?.RecPict}`}
                  className={classes.img}
                />
              )}
            </div>

            <div className={classes.web_wrapper}>
              <div
                onClick={() => navigatDetailed(item.RecID)}
                style={{ width: "70%" }}
              >
                <TextTranslate item={item} />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "30%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ChangeButton
                  count={item.count}
                  onAddHandle={() => addProductToBasket(item)}
                  onSubtractHandle={() => handleSubtractProduct(item)}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                >
                  <p>
                    {(
                      Math.round(item.RecPrice * item.count * 100) / 100
                    ).toFixed(2)}{" "}
                    USD
                  </p>
                  <span
                    onClick={() => handleTrash(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <Trash />
                  </span>
                </div>
              </div>
            </div>
            <div className={classes.mobile_wrapper}>
              <div>
                <TextTranslate item={item} />
              </div>
              <p>
                {(Math.round(item.RecPrice * item.count * 100) / 100).toFixed(
                  2
                )}{" "}
                USD
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <ChangeButton
                    count={item.count}
                    onAddHandle={() => addProductToBasket(item)}
                    onSubtractHandle={() => handleSubtractProduct(item)}
                  />
                </div>

                <span
                  onClick={() => handleTrash(item)}
                  style={{ cursor: "pointer" }}
                >
                  <Trash />
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {basket.length > 0 ? (
        <>
          <p style={{ textAlign: "right" }}>
            {t("cost_of_goods")}:{" "}
            <span style={{ fontWeight: 700 }}>
              {(Math.round(payment * 100) / 100).toFixed(2)} USD
            </span>
          </p>
          <div style={{ textAlign: "center" }}>
            <Button loaderPosition="right" bg={"red"} onClick={nextStep}>
              {t("next_step")}
            </Button>
          </div>
        </>
      ) : (
        <p style={{ color: "grey", fontSize: 18, textAlign: "center" }}>
          {t("empty_basket")}
        </p>
      )}
    </>
  );
};

export default StepperOne;
