import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "assets/images/logo.svg";
import classes from "./style.module.css";
import DropdownLanguage from "containers/Header/dropdown-language/DropdownLanguage";

function Footer() {
  const [t, i18n] = useTranslation();
  return (
    <div className={classes.footer}>
      <link rel="preload" fetchPriority="high" href="assets/layouts/footer_desktop.svg" type="image/svg+xml" />
      <div style={{ position: "absolute", bottom: 100, left: 20 }}>
        <DropdownLanguage color={"white"} />
      </div>
      <button
        style={{
          backgroundColor: "transparent",
          borderRadius: 0,
          borderWidth: "0px",
          color: "#fff",
          position: "absolute",
          right: 20,
          bottom: 100,
          cursor: "pointer",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        {t("up")}
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            color: "#fff",
          }}
          to={"/"}
        >
          <img src={Logo} alt="logo" />
          <h4
            style={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "17px",
            }}
          >
            SWT market
          </h4>
        </Link>
        <p
          style={{ color: "#fff", cursor: "pointer" }}
          className={classes.p_loto_text}
        >
          {t("good_crypto_products")}
        </p>
        <Link className={classes.link_item} to={"/delivery"}>
          <p className={classes.p_item}>{t("delivery")}</p>
        </Link>
        <Link className={classes.link_item} to={"/delivery"}>
          <p className={classes.p_item}>{t("help")}</p>
        </Link>
        <Link className={classes.link_item} to={"/delivery"}>
          <p className={classes.p_item}>{t("contacts")}</p>
        </Link>
      </div>

      <hr className={classes.hr} />
      <p className={classes.p_loto_text}>SWT market (С) 2024</p>
    </div>
  );
}

export default Footer;
