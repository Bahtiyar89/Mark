import "./style.css";
import { FC } from "react";
import { CButton } from "..";
import FeatherIcon from "assets/images/feather-icon.svg";
import { Link } from "react-router-dom";

type CardProps = {
  id: number;
  image: any;
  title: string;
  price: string | number;
};

const CCard: FC<CardProps> = ({ id, image, title, price }) => {
  return (
    <div className="card">
      <div className="card-wrapper">
        <img className="img" src={image} alt="" />
        <p>{title}</p>
        <h5>{price} USD</h5>
      </div>
      <CButton type="button">
        <Link to={`product/${id}`}>
          <img className="icon" src={FeatherIcon} alt="" /> В корзину
        </Link>
      </CButton>
    </div>
  );
};

export default CCard;
