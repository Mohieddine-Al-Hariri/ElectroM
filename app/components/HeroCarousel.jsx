"use client";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const HeroCarousel = () => {
  const images = ["2_7_1-removebg-preview (1).png", "airpods_max.png", "aurora-lights-star-galaxy-projector-for-kids-adults-bluetooth.png"];
  return (
      <Carousel
        showArrows={false}
        showThumbs={false}
        infiniteLoop={true}
        showIndicators={false}
        autoPlay={true}
        interval={6000}
        dynamicHeight={false}
        showStatus={false}
        className=" max-w-[500px] max-h-[500px] object-cover overflow-hidden"
      >
        {
          images.map((image, index) => (
            <div key={`Hero Carousel -${index}`}>
              <Image className="object-cover " alt={`product: ${image.slice(0,-4)}`} src={`/${image}`} width={500} height={500} alt={`Carousel Image ${index + 1}`} />
            </div>
          ))
        }
      </Carousel>
  );
};

export default HeroCarousel;
