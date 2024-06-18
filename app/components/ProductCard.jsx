"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-star-with-type";

export const SVGComponent = (props) => (
  <svg
    width="100px"
    height="100px"
    viewBox="0 11.25 76.5 76.5"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#C0392B"
      d="M72.763 87.75v-7.463l3.737 -3.737v7.463L72.763 87.75zM0 14.988 3.737 11.25h7.463l-3.737 3.737H0z"
    />
    <path
      fill="#E74C3C"
      d="M3.737 11.25h28.925L76.5 55.1v28.925L3.737 11.25z"
    />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="18"
      transform="rotate(45)"
      dy="-2.3em"
      dx="1.2em"
    >
      Sale!
    </text>
  </svg>
);

export const CardShineEffect = () => {
  return (
    <div className="bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-zinc-950 relative max-w-md overflow-hidden rounded-xl border border-slate-900 bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]">
      <span className="mb-4 inline-flex items-center justify-center rounded-md bg-blue-600 p-2 shadow-lg">
        <svg
          className="h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        />
      </span>
      <h3 className="mb-2 font-medium tracking-tight text-white">Hello!</h3>
      <p className="text-sm text-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex
        obcaecati natus eligendi delectus, cum deleniti sunt in labore nihil
        quod quibusdam expedita nemo.
      </p>
    </div>
  );
};

const ProductCard = ({
  id,
  name,
  excerpt,
  isCollection,
  imageUrl,
  imageUrls,
  reviews,
  isOnSale,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const rates = reviews?.map((review) => review.rating);
  const rate = rates?.reduce((a, b) => a + b, 0) / rates?.length;
  return (
    <Link
      href={isCollection ? `/collectionDetails/${id}` : `/itemsDetails/${id}`}
      className="relative shadow-lg grow"
    >
      {(isCollection || isOnSale) && (
        <SVGComponent className="absolute -top-2 -right-2 z-10" />
      )}
      {imageUrl ? (
        <Image
          width={400}
          height={400}
          className="h-full w-full object-cover "
          alt={name}
          src={imageUrl}
        />
      ) : (
        <div className="w-full h-full flex flex-wrap">
          {imageUrls?.map((image) => (
            <Image
              width={400}
              height={400}
              className={`${
                isCollection ? "w-1/3 grow" : "w-full object-cover h-full"
              }  `}
              alt={name}
              src={image?.url}
            />
          ))}
        </div>
      )}
      {/* Shine effect⬇️ */}
      <div className="top-0 w-full h-full absolute z-30 bg-[linear-gradient(45deg,transparent_25%,rgba(200,200,200,.3)_50%,transparent_75%,transparent_100%)]  bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
      <div className="absolute bottom-0 left-0 px-4 py-2 ">
        <h1 className="text-white ">
          {isHovered
            ? name.length > 25
              ? name.slice(0, 23) + "..."
              : name
            : name.length > 17
            ? name.slice(0, 15) + "..."
            : name}
        </h1>
        {excerpt && (
          <h2 className=" text-gray-300 text-xs  ">
            {isHovered
              ? excerpt.length > 35
                ? excerpt.slice(0, 33) + "..."
                : excerpt
              : excerpt.length > 20
              ? excerpt.slice(0, 18) + "..."
              : excerpt}

            {/* {excerpt.length > 20 ? excerpt.slice(0, 18) + "..." : excerpt} */}
          </h2>
        )}
        {reviews && reviews.length > 0 && (
          <ReactStars
            count={5}
            value={rate}
            size={16}
            isHalf={true}
            activeColors={["red", "orange", "#FFCE00", "#FFCE00", "#4bc0d9"]}
            className="absolute bottom-0 right-0"
          />
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
