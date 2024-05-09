"use client";
import { useState } from 'react';
import Image from 'next/image';
import 'react-multi-carousel/lib/styles.css';
import { Carousel } from 'react-responsive-carousel';
import { useEffect } from 'react';

const ImagesCarouselModal = ({ product, imageIndex, setImageIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgHeight, setBgHeight] = useState("h-0");

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setBgHeight("h-full");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    removeBg();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  useEffect(() => {
    // Add a document-level event listener for the Escape key
    const handleDocumentKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isModalOpen]);
  const handleModalMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const removeBg = () => {
    setTimeout(() => {
      setBgHeight("h-0");
    }, 200);
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 40000, min: 900 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 900, min: 0 },
      items: 2,
    },
  };

  return (
    <div className="relative max-sm:w-full px-3 w-[428px] inline-block ">
      <div className="sm:flex sm:items-start sm:mb-10 sm:justify-center w-full ">
        <Carousel
          showArrows={true}
          selectedItem={imageIndex}
          onChange={(index) => {setCurrentImageIndex(index); setImageIndex(index)}}
          showThumbs={false}
          infiniteLoop={true}
          className='border-none'
        >
          {product.imageUrls.map((image, index) => (
            <div
              key={`Carousel Image: ${index}`}
              className="relative flex justify-center w-full"
              onClick={() => openModal(currentImageIndex)}
            >
              <Image
                className="max-sm:max-h-[500px] object-cover lg:rounded-lg overflow-hidden  "
                width={800}
                height={800}
                src={image.url}
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </Carousel>
      </div>
      
      <div
        className={` ${bgHeight} fixed inset-0 w-full  flex justify-center items-center bg-black bg-opacity-75 z-30 `}
        onMouseDown={handleModalMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="button"
      >
        <button
          className={`${isModalOpen ? 'absolute' : 'hidden'}  z-50 top-4 right-4 text-white text-2xl `}
          onClick={closeModal}
        >
          &times;
        </button>
        <div className={`relative max-w-screen-xl transition duration-200 ${isModalOpen ? 'scale-100' : 'scale-0'} `}>
          <Carousel
            showArrows={true}
            selectedItem={currentImageIndex}
            onChange={(index) => setCurrentImageIndex(index)}
            showThumbs={false}
            infiniteLoop
            showStatus={false}
            responsive={responsive}
          >
            {product.imageUrls.map((image, index) => (
              <div
                key={`Full Carousel Image: ${index}`}
                className="relative flex justify-center w-full"
              >
                <Image
                  className="max-h-screen w-full object-contain"
                  width={428}
                  height={428}
                  src={image.url}
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ImagesCarouselModal;
