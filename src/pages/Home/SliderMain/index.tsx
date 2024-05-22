import Slider from "react-slick";
import Alcohol from "../../../assets/images/slider/alcohol.png";
import Honey from "../../../assets/images/slider/honey.png";
import Water from "../../../assets/images/slider/water.png";
import "./style.css";

type dataType = {
  id: number;
  image: any;
  name: string;
}[];

function SliderMain({ changeHandler }: any) {
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

  const handleCategory = (id: number) => {
    const e = { event: { currentTarget: { checked: true } } };
    const en = { event: { currentTarget: { checked: false } } };
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.id === id) {
        changeHandler(e.event, element.name);
      } else {
        changeHandler(en.event, element.name);
      }
    }
  };
  return (
    <section className="slider__main">
      <Slider {...settings}>
        {data.map((d: any) => (
          <div className="slider" key={d.id}>
            <img
              className="slider_img"
              onClick={() => handleCategory(d.id)}
              src={d.image}
              alt=""
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default SliderMain;
