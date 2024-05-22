import { useTranslation } from "react-i18next";
import { ReactComponent as ChevronDown } from "assets/images/icons/shevron_down.svg";
import { ReactComponent as ChevronUp } from "assets/images/icons/shevron_up.svg";
import classes from "./style.module.css";

const Header = ({
  handleDetailes,
  handleShowOrder,
  RecID,
  total_price,
  payment_status,
  showControl,
}: any) => {
  const [t, i18n] = useTranslation();

  return (
    <header className={classes.header}>
      <h4>{(Math.round(total_price * 100) / 100).toFixed(2)} USD</h4>

      <div className={classes.end_status}>
        <p>
          {t("payment_state")}:
          <span className={classes.payment_status}>{payment_status}</span>
        </p>
        <button
          className={classes.btn}
          onClick={() => {
            handleDetailes(RecID);
            handleShowOrder(RecID);
          }}
        >
          {RecID == showControl.RecID && showControl.show ? (
            <ChevronUp stroke="#000" />
          ) : (
            <ChevronDown stroke="#000" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
