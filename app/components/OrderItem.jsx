import Image from "next/image";

const OrderItem = ({ item }) => {
  const { quantity, total, product, id, createdAt, orderItemVariants, variant, collection } = item;
  return (
    <div className="flex justify-between items-center w-full lg:w-1/3 grow gap-5 border-b-2 rounded-md border-2 borderColor mb-2 p-2">
      {/* <Image width={86} height={108} className="relative w-[86px] h-[108px] rounded-[20px]" src={product.imageUrls[0].url} alt={product.name}  /> */}
      {!collection ?
        <Image
          width={86}
          height={108}
          className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-[#4bc0d9] transition duration-300"
          src={product.imageUrls[0].url}
          alt={product.name}
        /> :
        collection.imageUrl ?
          <Image
            width={86}
            height={108}
            className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-[#4bc0d9] transition duration-300"
            src={collection.imageUrl}
            alt={collection.name}
          />
          :
          <div className="flex flex-wrap">
            {collection.products.map((product, index) => {
              return (
                <Image
                  width={86}
                  height={108}
                  className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-[#4bc0d9] transition duration-300"
                  src={product.imageUrls[0].url}
                  alt={product.name}
                  key={`collection.product Image ${index}`}
                />
              )
            })}
          </div>
      }
      <div className="w-fit relative rounded-md p-2 flex-col justify-center items-center inline-flex gap-1">
        <div className="fontColorGray text-sm font-bold leading-[18px]">{collection?.name || product.name}</div>
        <div className="w-[99px] h-[33px] pl-3 pr-[11px] pt-[5px] pb-1 bg-neutral-100 rounded-[22px] justify-center items-start gap-[11px] inline-flex">
          <div className="text-black text-sm font-bold leading-normal">{quantity}</div>
        </div>
        <div className="flex flex-wrap">
          {variant ? 
            variant : 
            orderItemVariants.map((variant, index) => (
              `${variant.name}${index !== orderItemVariants.length - 1 ? ", " : ""} `
            ))
          }
        </div>
      </div>
      <div className="text-xl fontColor">
        <h1>Total</h1>
        <h1 className="font-bold">${total}</h1>
      </div>
      
    </div>
  )
}

export default OrderItem