import React, { FC } from "react";
import { Rating } from "@mantine/core";

type CRatingProps = {
  value: number;
  size?: any;
  count?: number;
  highlightSelectedOnly?: boolean;
};

const CRating: FC<CRatingProps> = ({
  value = 1,
  size = "sm",
  count = 5,
  highlightSelectedOnly = false,
}) => {
  return (
    <Rating
      defaultValue={value}
      value={value}
      size={size}
      count={count}
      highlightSelectedOnly={highlightSelectedOnly}
    />
  );
};

export default CRating;
