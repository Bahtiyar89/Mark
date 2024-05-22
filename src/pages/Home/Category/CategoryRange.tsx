import { RangeSlider } from "@mantine/core";

interface Props {
  minPrice: number;
  maxPrice: number;
  handleMaxMinPrice: (val: any) => void;
}

const CategoryRange = ({ minPrice, maxPrice, handleMaxMinPrice }: Props) => {
  return (
    <RangeSlider
      color="red"
      thumbSize={16}
      min={minPrice}
      max={maxPrice}
      defaultValue={[minPrice, 10]}
      onChangeEnd={(val) => handleMaxMinPrice(val)}
    />
  );
};

export default CategoryRange;
