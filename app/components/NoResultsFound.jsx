"use client";

const NoResultsFound = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="text-center fontColor p-4 borderColor border rounded-lg mx-auto max-w-md">
        <p className="text-lg mb-2">Sorry, we couldn't find any results for your search.</p>
        <p className="text-base font-bold">Please check your spelling or try a different keyword.</p>
      </div>
    </div>
  )
}

export default NoResultsFound