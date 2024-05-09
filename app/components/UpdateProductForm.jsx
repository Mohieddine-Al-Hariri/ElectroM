"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import {
  publishImagesUrls,
  publishManyTags,
  publishProduct,
  publishProductVariants,
  updateProduct,
} from "@/lib";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { CheckBox, SVGCheck, SVGX } from ".";
import Image from "next/image";

const PillVariant = ({ size, color, index, deleteItem, quantity, decreaseQuantity, increaseQuantity, infiniteQuantity }) => {
  return (
    <div className="flex relative flex-col items-center px-3 pb-1 pt-4 productCardBg rounded-lg">
      {/*  */}
      <div>
        {size && size} {size && color && "/"} {color && color}
        <button className="hover:text-red-600 transition absolute right-1 top-0" onClick={(e) => {deleteItem(index); e.preventDefault()}}>
          <SVGX/>
        </button>
      </div>
      {/*  */}
      <div className="flex gap-2">
        <button className="rounded-full bgColorGray aspect-square px-2 hover:text-[#4bc0d9] " onClick={(e) => decreaseQuantity(e, index)}>-</button>
        <button className="hover:scale-125" onClick={(e) => infiniteQuantity(e, index)}>♾️</button>
        <button className="rounded-full bgColorGray aspect-square px-2 hover:text-[#4bc0d9] " onClick={(e) => increaseQuantity(e, index)}>+</button>
      </div>
      <div className="underline">{quantity !== null ? quantity : "♾️"}</div>
        
    </div>
  );
};

export const VariantsForm = ({ selectedPills, setSelectedPills, productData }) => {

  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sizeValues, setSizeValues] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(productData ? true : false);

  const deleteItem = (index) => {
    const updatedPills = selectedPills.filter((_, i) => i !== index);
    setSelectedPills(updatedPills);
  };
  const cancel = () => {
    setShowSizeInput(false);
    setShowColorInput(false);
  }
  const clearAll = () => {
    setSizeValues([]);
    setColorValues([]);
    setSelectedPills([]);
    setHasSubmitted(false);
  }
  const handleSubmitVariants = (e) => {
    e.preventDefault();
    if (showSizeInput && showColorInput) {
      let pills = sizeValues.map((size) =>
        colorValues.map((color) => ({ name: `${size}/${color}`, size, color, quantity: 1 }))
      );
      setSelectedPills(pills.flat());
      setShowSizeInput(false);
      setShowColorInput(false);
    } else if (showSizeInput) {
      setSelectedPills(sizeValues.map((size) => ({ size, quantity: 1 })));
      setShowSizeInput(false);
    } else if (showColorInput) {
      setSelectedPills(colorValues.map((color) => ({ color, quantity: 1 })));
      setShowColorInput(false);
    } else {
      setShowSizeInput(false);
      setShowColorInput(false);
    }
    setHasSubmitted(true);
  };

  const infiniteQuantity = (e, index) => {
    e.preventDefault();
    setSelectedPills(prev => prev.map((pill, i) => {
      if(i === index) {
        return {
          ...pill,
          quantity: null
        }
      }
      return pill
    }))
  }
  const decreaseQuantity = (e, index) => {
    e.preventDefault();
    if(!selectedPills[index].quantity || selectedPills[index].quantity === 0 ) return
    setSelectedPills(prev => prev.map((pill, i) => {
      if(i === index) {
        return {
          ...pill,
          quantity: pill.quantity - 1
        }
      }
      return pill
    }))
  }
  const increaseQuantity = (e, index) => {
    e.preventDefault();
    setSelectedPills(prev => prev.map((pill, i) => {
      if(i === index) {
        return {
          ...pill,
          quantity: pill.quantity ? pill.quantity + 1 : 1
        }
      }
      return pill
    }));
  }

  return(
    <div className="relative mb-4 border-2 border-gray-300 rounded p-2 ">
      <label className="block text-lg font-semibold mb-2">
        Filter by Variants
      </label>
      {(showSizeInput || showColorInput) &&
        <button className="absolute top-2 right-2 hover:text-red-500 transition" onClick={cancel}><SVGX /></button>
      }
      <div className="flex space-x-4 mb-2 ">
        <div
          className={`cursor-pointer p-2 border rounded hover:text-white hover:bg-[#4bc0d9] ${
            showSizeInput ? "border-[#4bc0d9]" : "border-gray-300"
          }`}
          onClick={() => {
            setShowSizeInput(!showSizeInput);
            setShowColorInput(false);
          }}
        >
          Size
        </div>
        <div
          className={`cursor-pointer p-2 border rounded hover:text-white hover:bg-[#4bc0d9] ${
            showColorInput ? "border-[#4bc0d9]" : "border-gray-300"
          }`}
          onClick={() => {
            setShowColorInput(!showColorInput);
            setShowSizeInput(false);
          }}
        >
          Color
        </div>
        <div
          className={`cursor-pointer p-2 border rounded hover:text-white hover:bg-[#4bc0d9] ${
            showSizeInput && showColorInput
              ? "border-[#4bc0d9]"
              : "border-gray-300"
          }`}
          onClick={() => {
            setShowSizeInput(true);
            setShowColorInput(true);
          }}
        >
          Size & Color
        </div>
      </div>
      {showSizeInput && (
        <div className="mb-2">
          <label htmlFor="Size" className="block font-semibold mb-1">Size</label>
          <div className="flex gap-1">
            <input
              id="Size"
              type="text"
              placeholder="Size"
              className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  e.preventDefault();
                  if(sizeValues.includes(e.target.value)) return
                  setSizeValues([...sizeValues, e.target.value]);
                  setSize("");
                }
              }}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <button className="border rounded-lg p-1" onClick={(e) => {
              e.preventDefault();
              if(sizeValues.includes(size)) return
              setSizeValues([...sizeValues, size]);
              setSize("");
            }}>
              <SVGCheck/>
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {sizeValues.map((value, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded px-2 py-1 productCardBg"
              >
                {value}
                <button
                  className="border rounded-lg borderColor hover:text-red-500 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    const updatedValues = sizeValues.filter(
                      (_, i) => i !== index
                    );
                    setSizeValues(updatedValues);
                  }}
                >
                  <SVGX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showColorInput && (
        <div className="mb-2">
          <label htmlFor="Color" className="block font-semibold mb-1">Color</label>
          <div className="flex gap-1">
            <input
              id="Color"
              type="text"
              placeholder="Color"
              className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  e.preventDefault();
                  if(colorValues.includes(e.target.value)) return
                  setColorValues([...colorValues, e.target.value]);
                  setColor("");
                }
              }}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <button className="border rounded-lg p-1" onClick={(e) => {
              e.preventDefault();
              if(colorValues.includes(color)) return
              setColorValues([...colorValues, color]);
              setColor("");
            }}>
              <SVGCheck/>
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {colorValues.map((value, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded px-2 py-1 productCardBg"
              >
                {value}
                <button
                  className="border rounded-lg borderColor hover:text-red-500 transition"
                  onClick={() => {
                    const updatedValues = colorValues.filter(
                      (_, i) => i !== index
                    );
                    setColorValues(updatedValues);
                  }}
                >
                  <SVGX/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {showSizeInput || showColorInput ? (
        <button
          className="hover:bg-[#3ca8d0] bg-[#4bc0d9] text-white py-2 px-4 rounded cursor-pointer"
          onClick={(e) => handleSubmitVariants(e)}
        >
          Check
        </button>
      ) : null}
      {hasSubmitted && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedPills.map((pill, index) => (
            <PillVariant
              key={
                (pill.size && pill.color && `${pill.size}/${pill.color}`) ||
                (pill.size && `${pill.size}`) ||
                (pill.color && `${pill.color}`)
              }
              size={pill.size || null}
              color={pill.color || null}
              index={index}
              deleteItem={deleteItem}
              decreaseQuantity={decreaseQuantity}
              increaseQuantity={increaseQuantity}
              infiniteQuantity={infiniteQuantity}
              quantity={pill.quantity}
            />
          ))}
          {selectedPills.length > 0 && (
            <button onClick={clearAll} >Clear All</button>
          )}
        </div>
      )}
    </div>
  );
}

const UpdateProductForm = ({ categoriesData, productData, collectionsData }) => {
  const productCategoriesIds = productData?.categories?.map(
    (category) => category.id
  );
  const productCollectionsIds = productData?.collections?.map(
    (collection) => collection.id
  );
  const productTags = productData?.tags.map(
    (tag) => tag.name
  );
  const productDataVariants = productData?.productVariants?.map((variant) => ({
    size: variant.name,
    quantity: variant.quantity,
  }));
  const productImages = productData?.imageUrls
  
  const [prevImages, setPrevImages] = useState(productImages || []);
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  
  const [tagList, setTagList] = useState(productTags || []);
  const [removedTags, setRemovedTags] = useState([]);

  const [form, setForm] = useState({
    name: productData?.name || "",
    excerpt: productData?.excerpt || "",
    description: productData?.description || "",
    state: productData?.state || "Available",
    collections: productCollectionsIds || [],
    categories: productCategoriesIds || [],
    tag: "",
  });

  const [price, setPrice] = useState(productData?.price || 0);
  const [isOnSale, setIsOnSale] = useState(false);
  const [prevPrice, setPrevPrice] = useState(productData?.previousPrice || 0); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const [selectedPills, setSelectedPills] = useState(productDataVariants || []); // Variants State 

  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if(isDarkModeLocal) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, []);

  const handleImageUpload = (event) => {
    const newImages = Array.from(event.target.files);

    const invalidFiles = newImages.filter(
      (file) => file.type.indexOf("image/") !== 0
    );

    if (invalidFiles.length > 0) {
      setImageError("Invalid file format. Please upload images only.");
      return;
    }

    setImageError("");
    setImages([...images, ...newImages]);
  };


  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };
  const handleRemovePrevImage = (index) => {
    setRemovedImages((prev) => {
      return ([...prev, prevImages[index]]);
    });
    const updatedImages = prevImages.filter((_, i) => i !== index);
    setPrevImages(updatedImages);
  };
  const handleAddPrevImage = (index) => {
    setPrevImages(prev => [...prev, removedImages[index]]);
    setRemovedImages(prev => prev.filter((_, i) => i !== index));
  };

  const deletaImagesFromFireBase = async () => {
    removedImages.map((image) => {
      try{
        const imageRef = ref(storage, image.url);
        deleteObject(imageRef); //add await? (also async next to (image) )
      }
      catch(error){
        console.log(error.message);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const categoryOptions = categoriesData.map((category) => {
    return { value: category.id, label: category.name };
  });
  const collectionOptions = collectionsData.map(({node}) => {
    return { value: node.id, label: node.name, className: "fontColor bgColor" };
  });

  const handleCategoryChange = (selectedOptions) => {
    const selectedCategories = selectedOptions.map((option) => option.value);
    setForm((prevForm) => ({ ...prevForm, categories: selectedCategories }));
  };
  const handleCollectionChange = (selectedOptions) => {
    const selectedCollection = selectedOptions.map((option) => option.value);
    setForm((prevForm) => ({ ...prevForm, collections: selectedCollection }));
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    const newTag = form.tag.trim();

    if(newTag === '') return; //Prevent empty strings
    if (tagList.includes(newTag)) return; //Prevent Similar Tags

    //Remove added tag from removed tagsList
    removedTags.includes(newTag) && setRemovedTags((prev) => prev.filter((tag) => tag !== newTag));
    //Add the new tag to the tagsList
    setTagList([...tagList, newTag]);
    setForm({ ...form, tag: '' }); //Reset tag string in form
  };
  const handleTagRemove = (tagToRemove, e) => {
    e.preventDefault();
  
    // Use the filter function to create an updated tag list
    const updatedTagList = tagList.filter((tag) => tag !== tagToRemove);
  
    // Check if tagToRemove is in the productTags array
    const isInPrev = productTags.includes(tagToRemove);

    if(isInPrev){
      //Get the id of the tagToRemove
      const tagToRemoveId = productData.tags.find((tag) => tag.name === tagToRemove).id
      setRemovedTags((prev) => [...prev, tagToRemoveId]);
    }
  
    // Use functional updates for state setters
    setTagList(updatedTagList);
  };
  
  async function uploadImage(image) {
    const storageRef = ref(
      storage,
      `/products/${form.name}/${Date.now()}-${image.name}`
    );

    const response = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(response.ref);
    return url;
  }
  async function uploadImages() {
    const imagePromises = Array.from(images, (image) => uploadImage(image));

    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const imgUrls = await uploadImages();
    const imageUrls = imgUrls.map((url) => ({ url }))
    await deletaImagesFromFireBase();
    const previousVariants = productData?.productVariants.map((variant) => (
      {id: variant.id}
    ));
    const removedImagesIds = removedImages.map((image) => image.id).flat();
    const previousCategories = productCategoriesIds
      .filter((id) => !form.categories.some((categoryId) => categoryId === id))
      .map((id) => ({ id }));
    const previousCollections = productCollectionsIds
      .filter((id) => !form.collections.some((collectionId) => collectionId === id))
      .map((id) => ({ id }));

      const updatedProduct = await updateProduct({
      productId: productData.id,
      ...form,
      price,
      isOnSale,
      prevPrice: prevPrice > 0 ? prevPrice : price + 1,
      variants: selectedPills,
      imageUrls,
      removedImagesIds,
      previousCategories,
      previousCollections,
      previousVariants,
      tags: tagList.filter((tag) => !productTags.includes(tag)).map((name) => ({ name })),
      previousTags: removedTags.map((id) => ({ id })),
    });

    const publishProductPromise = publishProduct(updatedProduct.id);
    const publishProductVariantsPromise = publishProductVariants(updatedProduct.id);
    const publishedTagsPromise = publishManyTags(updatedProduct.id);
    const publishImagesUrlsPromise = publishImagesUrls(updatedProduct.imageUrls);
    await Promise.all([publishProductPromise, publishImagesUrlsPromise, publishProductVariantsPromise, publishedTagsPromise]);
    
    setIsSubmitting(false);
    router.refresh();
    router.push(`/itemsDetails/${updatedProduct.id}`);
  };
  
  const reactSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "bgColor", // Adjust the background color
      borderColor: "borderColor", // Adjust the border color
      color: "fontColor", // Adjust the text color
      '&:hover': {
        borderColor: "#00FFFF", // Adjust the hover border color
      },
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isFocused || isSelected ? "#4bc0d9" : "white", // Adjust the background color for selected options
      color: isFocused || isSelected ? "white" : "black", // Adjust the text color
      '&:hover': {
        backgroundColor: "#4bc0d9", // Adjust the hover background color
      },
    }),
    // Other style overrides as needed...
  };

  return (
    <div className="flex flex-col items-center w-full h-screen mx-auto p-6 bgColor colorScheme rounded-lg fontColor overflow-y-scroll pb-16">
      <h2 className="text-3xl font-semibold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:max-w-2xl">
        <div className="mb-4">
          <label htmlFor="images" className="block text-lg font-semibold mb-2">
            Images
          </label>
          <input
            type="file"
            id="images"
            required={images.length === 0 && prevImages.length === 0}
            multiple
            onChange={handleImageUpload}
            className="py-2 px-4 w-full border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
          />

          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
          <div className="overflow-x-auto w-full ">
            <div className="inline-flex gap-2 mt-2 rounded w-full ">
              {images.map((image, index) => (
                <div key={index} className="relative w-32 h-32 shrink-0">
                  <Image
                    src={ URL.createObjectURL(image) }
                    alt={`Product ${index}`}
                    className="w-32 h-32 object-cover rounded"
                    width={32}
                    height={32}
                  />
                  <span
                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1 cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </span>
                </div>
              ))}
              {prevImages.map((image, index) => (
                <div key={image.url} className="relative w-32 h-32 shrink-0 ">
                  <Image
                    src={ image.url }
                    alt={`Product ${index}`}
                    className="w-32 h-32 object-cover rounded "
                    width={32}
                    height={32}
                  />
                  <span
                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1 cursor-pointer"
                    onClick={() => handleRemovePrevImage(index)}
                  >
                    X
                  </span>
                </div>
              ))}
              {removedImages.map((image, index) => (
                <div key={image.url} className="relative w-32 h-32 shrink-0">
                  <Image
                    src={ image.url }
                    alt={`Product ${index}`}
                    className="w-32 h-32 object-cover rounded brightness-50"
                    width={32}
                    height={32}
                  />
                  <span
                    className="absolute top-0 right-0 text-white bg-[#4bc0d9] rounded-full p-1 cursor-pointer"
                    onClick={() => handleAddPrevImage(index)}
                  >
                    +
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="excerpt" className="block text-lg font-semibold mb-2">
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-semibold mb-2"
          >
            Description (Markdown)
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
            rows="6"
          />
          <ReactMarkdown className="prose mt-2">
            {form.description}
          </ReactMarkdown>
        </div>

        <CheckBox label="Is Product On Sale?" isChecked={isOnSale} setIsChecked={setIsOnSale}/>
        
        <div className="mb-4 flex gap-2 " >
          <label htmlFor="price" className="block text-lg font-semibold mb-2 w-full">
            Price
            <div className="flex items-center border rounded focus-within:border-[#4bc0d9]">
              <span className="fontColorGray px-3">$</span>
              <input
                type="number"
                id="price"
                required
                name="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full py-2 px-2 rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
              />
            </div>
          </label>
          {/* {isNaN(parseFloat(form.price)) && form.price.trim() !== '' && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid price.</p>
          )} */}
          {isOnSale && (
            <>
              <label htmlFor="previousPrice" className="block text-lg font-semibold mb-2 w-full">
                Previous Price
                <div className="flex items-center border rounded focus-within:border-[#4bc0d9]">
                  <span className="fontColorGray px-3">$</span>
                  <input
                    type="number"
                    id="previousPrice"
                    required
                    name="previousPrice"
                    value={prevPrice}
                    onChange={(e) => setPrevPrice(parseFloat(e.target.value))}
                    className="w-full py-2 px-2 rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
                  />
                </div>
              </label>
            </>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-lg font-semibold mb-2">
            Tags
          </label>
          <input
            id="tag"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-2 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
          />
          <div className="flex flex-wrap gap-2">
            <button className="hover:underline" onClick={(e) => handleTagSubmit(e)}>Add Tag</button>
            <div className=" flex flex-wrap gap-2 ">
              {tagList.map((tag, index) => (
                <div key={`tag-${tag}-${index}`} className="rounded-full bgColorGray px-2 py-1 w-fit ">
                  {tag}
                  <button className="hover:text-red-600 ml-2 " onClick={(e) => handleTagRemove(tag, e)}>X</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="categories"
            className="block text-lg font-semibold mb-2"
          >
            Categories
          </label>
          <Select
            id="categories"
            name="categories"
            isMulti
            options={categoryOptions}
            value={categoryOptions.filter((option) =>
              form.categories.includes(option.value)
            )}
            styles={reactSelectStyles}
            onChange={handleCategoryChange}
            className="py-2 px-4 border rounded focus:outline-none text-black  focus:ring focus:border-[#4bc0d9]"
          />
        </div>
        
        <VariantsForm selectedPills={selectedPills} setSelectedPills={setSelectedPills} productData={productData} />

        <div className="mb-4">
          <label
            htmlFor="collections"
            className="block text-lg font-semibold mb-2"
          >
            Collection
          </label>
          <Select
            id="collections"
            name="collections"
            isMulti
            options={collectionOptions}
            value={collectionOptions.filter((option) =>
              form.collections.includes(option.value)
            )}
            styles={reactSelectStyles}
            onChange={handleCollectionChange}
            className="py-2 px-4 border rounded text-black focus:outline-none focus:ring focus:border-[#4bc0d9] "
          />
        </div>

        <div className="mb-4">
          <label htmlFor="state" className="block text-lg font-semibold mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
          >
            <option value="Available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
            <option value="Removed">Removed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#4bc0d9] text-white py-3 px-6 rounded hover:bg-[#3ca8d0] focus:outline-none focus:ring focus:border-[#4bc0d9]"
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
        <div className="sm:hidden h-[40px] w-full"></div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
