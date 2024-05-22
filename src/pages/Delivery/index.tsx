import classes from "./style.module.css";
import { Container } from "@mantine/core";
import BreadCrumb from "containers/BreadCrumb";
import { Trans, useTranslation } from "react-i18next";

const Delivery = () => {
  const [t] = useTranslation();

  return (
    <Container fluid>
      <div className={classes.medialower}>
        <BreadCrumb />
        <h1>{t("delivery")}</h1>
        <hr />

        <h2>{t("description")}</h2>
        <p className={classes.paragraph}>
          <Trans i18nKey="delivery_text" components={{ 1: <br /> }} />
        </p>
      </div>
    </Container>
  );
};

export default Delivery;
