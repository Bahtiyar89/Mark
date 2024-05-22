import React, { useContext } from "react";
import classes from "./style.module.css";
import { CRating, ChangeButton } from "components";
import ProductContext from "../../context/products/ProductContext";

const { REACT_APP_BASE_URL } = process.env;
interface Props {
  product: any;
}

const MainCard = ({ product }: Props) => {
  const productContext = useContext(ProductContext);

  const { addProductToBasket, basket, removeProductFromBasket } =
    productContext;

  const handleSubtractProduct = () => {
    if (product.count) {
      removeProductFromBasket(product);
    }
  };
  return (
    <div className={classes.main__card}>
      <div className={classes.image}>
        <img src={`${REACT_APP_BASE_URL}/${product?.RecPict}`} alt="" />
      </div>

      <div className={classes.detail}>
        <h6>{product.category_name}</h6>
        <h3>{product?.RecPrice} SWT</h3>
        <div className={classes.flex_1}>
          <h4>{product.RecName_ru}</h4>
          <h5>{product.RecWeight} г.</h5>
        </div>
        <div className={classes.flex_2}>
          <CRating value={3} size={"xs"} />
          <p>(1324 заказа)</p>
        </div>
        <ChangeButton
          count={product.count}
          onAddHandle={() => addProductToBasket(product)}
          onSubtractHandle={handleSubtractProduct}
        />
      </div>
    </div>
  );
};

export default MainCard;
