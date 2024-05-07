import Image from "next/image"

const SelectionProductCard = ({ product, included, include, inputId }) => (
  <div className="flex flex-col items-center gap-2 w-[70px] group">
    <label
      className={`relative cursor-pointer ${
        included
          ? "border-[#4bc0d9]"
          : "border-gray-300 group-hover:border-[#3ca8d0]"
      } border-2 rounded-[10px] transition duration-300`}
      htmlFor={inputId}
    >
      <input
        className="hidden"
        type="checkbox"
        id={inputId}
        name="includeItem"
        onChange={() =>
          include(included, {
            id: product.id,
            imageUrls: product.imageUrls,
            name: product.name,
          })
        }
        checked={included}
      />
      <Image
        width={60}
        height={87}
        className="w-[60px] h-[87px] rounded-[10px] transition duration-300"
        src={product.imageUrls[0].url}
        alt={product.name}
      />
      <div
        className={`absolute -top-4 left-4 ${
          included
            ? "bg-[#4bc0d9] group-hover:bg-[#3ca8d0] text-gray-100 "
            : "bg-white text-gray-600 "
        }  p-1 rounded-full shadow`}
      >
        {included ? "Included" : "Include"}
      </div>
    </label>
    <p className="text-center text-xs">{product.name}</p>
  </div>
)
export default SelectionProductCard