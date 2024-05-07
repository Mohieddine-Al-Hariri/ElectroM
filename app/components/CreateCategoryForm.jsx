import { createCategory, publishCategory } from '@/lib';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 } from 'uuid';
import { SVGLoading, SelectionProductCard } from '.';


const CreateCategoryForm = ({ products, hasNextPage, hasPreviousPage, getOtherProducts, productsPageNumber, isFetching }) => {
  // State variables
  const [name, setName] = useState(''); // Name input field state
  const [description, setDescription] = useState(''); // Description input field state
  const [show, setShow] = useState(true); // Show checkbox state

  const [includedProducts, setIncludedProducts] = useState([]); // Array to store included products
  const [creatingCategory, setCreatingCategory] = useState(false); // State for category creation process
  const [isCreating, setIsCreating] = useState(false); // State for category creation status
  const [isCreated, setIsCreated] = useState(false); // State for category creation status
  const [isError, setIsError] = useState(false); // State for error status


  const router = useRouter(); // Access the router for navigation

  // Event handlers for input field changes
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleShowChange = (event) => {
    setShow(event.target.checked);
  };

  // Function to include/exclude products
  const include = (isIncluded, product) => {
    if (!isIncluded)
      setIncludedProducts((prevIncluded) => [
        ...prevIncluded,
        product,
      ]); // Include the product when toggled to true
    else
      setIncludedProducts((prevIncluded) =>
        prevIncluded.filter((item) => item.id !== product.id)
      ); // Exclude the product when toggled to false
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    //Remove error message if it exists from previous submission
    setIsError(false);
  
    // Create a unique slug for the category using UUID
    const slug = v4();
  
    // Prepare the category details object
    const categoryDetails = {
      name,
      slug,
      show,
      description,
      products: includedProducts.map((product) => ({ id: product.id })),
    };
  
    try {
      // Set category creation in progress
      setCreatingCategory(true);
  
      // Call functions to create and publish the category
      const createdCategory = await createCategory(categoryDetails);
      await publishCategory(createdCategory.createCategory.id);
  
      // Clear the form fields and set category creation as completed
      setName('');
      setDescription('');
      setCreatingCategory(false);

      setIsCreated(true); //To show success message
      setTimeout(() => {
        setIsCreated(false);
      }, 4000);
  
      // Refresh the router
      router.refresh();
    } catch (error) {
      // Handle any errors that occur during category creation
      console.error('Category creation failed:', error);
      setIsError(true); // Set an error flag if needed
      setCreatingCategory(false); // Set category creation as completed in case of an error
    }
  };
  
  
  // const handleSubmit = async (event) => { 
  //   event.preventDefault();
  //   setCreatingCategory(true); // Set category creation in progress
  //   const slug = v4();
  //   const categoryDetails = {
  //     name,
  //     slug,
  //     show,
  //     description,
  //     products: includedProducts.map((product) => ({ id: product.id })),
  //   };
  //   // Call functions to create and publish the category
  //   const createdCategory = await createCategory(categoryDetails);
  //   await publishCategory(createdCategory.createCategory.id);
  //   setCreatingCategory(false); // Set category creation as completed
  //   router.refresh(); // Refresh the router
  //   setName(''); // Clear the name input field
  //   setDescription(''); // Clear the description input field
  // };

  return (
    <div className="max-w-md mx-auto bgColor fontColor rounded-lg shadow-lg p-6 mb-5 border-2 borderColor">
      <h1 className="text-2xl font-semibold mb-4">Create Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium fontColorGray ">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            className="mt-1 p-2 border rounded w-full colorScheme"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium fontColorGray ">
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 p-2 border rounded w-full colorScheme"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="show" className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show"
              checked={show}
              onChange={handleShowChange}
              className="h-4 w-4 text-[#4bc0d9] colorScheme"
            />
            <span className="text-sm font-medium fontColorGray">Show</span>
          </label>
        </div>
        <div className="flex flex-col gap-1 mb-4 ">
          Products
          <div className="border-2 borderColor rounded-lg p-2 pt-4 ">
            <div className="flex flex-wrap gap-2 ">
              {includedProducts.map((product) => {
                  return(
                    <SelectionProductCard
                      key={`create Collection Form (included): ${product.id}`}
                      product={product}
                      include={include}
                      included={true}
                      inputId={`includeItem ${product.id}`}
                    />
                  )
                })}
            </div>
            {includedProducts.length > 0 && <div className="bgColorGray w-3/4 h-1 rounded-full mt-2 mb-4 "></div>}
            <div className="flex flex-wrap gap-2 ">
            {products.map((product) => {
              let isIncluded = false
              includedProducts.map(includedProduct => {if(includedProduct.id === product.node.id) isIncluded = true})
              if(includedProducts.length === 0 || !isIncluded){
                return(
                  <SelectionProductCard
                    key={`create Collection Form (not included): ${product.node.id}`}
                    product={product.node}
                    include={include}
                    included={false}
                    inputId={`includeItem ${product.node.id}`}
                  />
                )
              }
            })}
            </div>
            <div className="flex items-center justify-center space-x-4 w-full">
              <button
                disabled={!hasPreviousPage ? true : isFetching }
                onClick={(e) => getOtherProducts(e, "before")}
                className={`${
                  !hasPreviousPage
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isFetching ? "bg-gray-300 text-gray-500 cursor-waiting" : "bg-[#4bc0d9] hover:bg-[#3ca8d0]"
                } text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
              >
                &lt;
              </button>
              <span className="textColorGray font-semibold">Page {productsPageNumber}</span>
              <button
                disabled={!hasNextPage ? true : isFetching }
                onClick={(e) => getOtherProducts(e, "after")}
                className={`${
                  !hasNextPage
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isFetching ? "bg-gray-300 text-gray-500 cursor-waiting" : "bg-[#4bc0d9] hover:bg-[#3ca8d0]"
                } text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
              >
                &gt;
              </button>
            </div>


          </div>
        </div>
        <button disabled={creatingCategory} type="submit" className="max-sm:mb-6 bg-[#4bc0d9] hover:bg-[#3ca8d0] text-white px-4 py-2 rounded w-full">
          {creatingCategory ? 
            <div className='flex gap-4 justify-center items-center '>
              <SVGLoading/>
            </div>
        : "Create Category"}
        </button>
        {isError && <p className="text-red-500">An error occurred while creating the category, please try again.</p>}
        {isCreated && <div className="text-green-500 pt-2 "><h2 className='font-semibold '> Category Created Successfully!</h2>  If it doesn't appear, you can refresh the page to view it</div>}
      </form>
    </div>
  );
};

export default CreateCategoryForm;
