import { Container } from "@mantine/core";
import { useTranslation } from "react-i18next";

const Page404 = () => {
  const [t, i18n] = useTranslation();
  return (
    <Container style={{ textAlign: "center" }} pb={30}>
      <h1 style={{ fontSize: "48px", color: "#000", paddingBottom: 20 }}>
        404
      </h1>
      <p style={{ fontSize: "28px", color: "#000" }}>{t("ups")}</p>
      <p style={{ fontSize: "28px", color: "#000" }}>{t("page_not_found")}</p>
    </Container>
  );
};

export default Page404;
