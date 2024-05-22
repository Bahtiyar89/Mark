import React, { useState } from "react";
import classes from "./style.module.css";
import { ReactComponent as PlusIcon } from "assets/images/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/images/icons/minus.svg";

interface Props {
  count: any;
  onAddHandle: () => void;
  onSubtractHandle: () => void;
}

const ChangeButton = ({ count, onAddHandle, onSubtractHandle }: Props) => {
  return (
    <div className={classes.change__btn}>
      <p className={classes.minus} onClick={onSubtractHandle}>
        <MinusIcon />
      </p>
      <p>{count}</p>
      <p className={classes.plus} onClick={onAddHandle}>
        <PlusIcon />
      </p>
    </div>
  );
};

export default ChangeButton;
