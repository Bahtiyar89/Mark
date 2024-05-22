import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import classes from "./style.module.css";
import TransactionContext from "../../context/transaction/TransactionContext";

const DeliveryPrice = () => {
  const [t, i18n] = useTranslation();
  const transactionContext = useContext(TransactionContext);
  const { delivery_price } = transactionContext;

  return (
    delivery_price != 0 && (
      <p className={classes.delivery_price}>
        {t("cost_of_delivery")}:{" "}
        <span style={{ fontWeight: 700 }}>
          {(Math.round(delivery_price * 100) / 100).toFixed(2)} USD
        </span>
      </p>
    )
  );
};

export default DeliveryPrice;
