import Slider from "react-slick";
import Alcohol from "assets/images/slider/alcohol.webp"
import Honey from "assets/images/slider/honey.webp";
import Water from "assets/images/slider/water.webp";
import "./style.css";
import React from "react";

import MobileAlcohol from "assets/images/slider/mobile/alcoholMobile.webp";


type dataType = {
  id: number;
  image: any;
  name: string;
}[];
let data: dataType = [
  {
    id: 1,
    image: Alcohol,
    name: "Alcohol",
  },
  {
    id: 2,
    image: Honey,
    name: "sweets",
  },
  {
    id: 3,
    image: Water,
    name: "Beverages",
  },
];

let settings = {
  pauseOnHover: false,
  pauseOnFocus: false,
  dots: true,
  infinite: true,
  speed: 1000,
  autoplay: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  dotsClass: "slider-dots",
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
function SliderMain({ changeHandler }: any) {
  const handleCategory = (id: number) => {
    const e = { currentTarget: { checked: true } };
    const en = { currentTarget: { checked: false } };
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      changeHandler(element.id === id ? e : en, element.name);
    }
  };
  return (
    <section className="slider__main">

      <Slider {...settings}>
        {data.map(({ id, image }) => {

          return (
            <div className="slider" key={id}>
              <img
                rel="preload"
                className="slider_img"
                src={image}
                onClick={() => handleCategory(id)}
                alt="slider image"
                height={170}
                width="400"
              />
            </div>
          )
        }
        )}
      </Slider>
    </section>
  );
}

export default React.memo(SliderMain);
