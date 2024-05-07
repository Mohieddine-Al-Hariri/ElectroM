"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

const FilterSelect = ({ options, extraOptions, refe, setResetSearchText, filterBy, searchedSelection }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [selected, setSelected] = useState(searchedSelection || 'All');

  const router = useRouter();

  const handleNavigation = () => {
    const currentParams = new URLSearchParams(window.location.search);
    const paramName = filterBy.toLowerCase();

    if(selected === 'All') currentParams.delete(paramName);
    else currentParams.set(paramName, selected);

    currentParams.delete("cursor");
    currentParams.delete("search");

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;
    setResetSearchText(prev => !prev);
    router.push(newPathname);
  };

  useEffect(() => {
    handleNavigation();
  },[selected]);

  return (
    <div ref={refe} className="max-sm:mb-4 ">
      <label htmlFor={filterBy} className="block text-lg font-semibold mb-2">
        Filter by {filterBy}
      </label>
      <select
        id={filterBy}
        name={filterBy}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full py-2 px-4 border rounded focus:focus-glow colorScheme ${
          isFocused ? 'focus-glow' : ''
        }`}
      >
        <option value="All">All</option>
        {options.map((option) => (
          <option className="fontColor" key={option.name} >{option.name}</option>
        ))}
        {extraOptions?.map((option) => (
          <option className="fontColor" key={option.name} >{option.name}</option>
        ))}
        {/* <option className="fontColor" >Collections & Sales</option> */}
      </select>
    </div>
  )
  // return (
  //   <div ref={refe} className="max-sm:mb-4 ">
  //     <label htmlFor={filterBy} className="block text-lg font-semibold mb-2">
  //       Filter by {filterBy}
  //     </label>
  //     <select
  //       id={filterBy}
  //       name={filterBy}
  //       value={selectedCategory}
  //       onChange={(e) => setSelected(e.target.value)}
  //       onFocus={() => setIsSearchBarFocused(true)}
  //       onBlur={() => setIsSearchBarFocused(false)}
  //       className={`w-full py-2 px-4 border rounded focus:focus-glow colorScheme ${
  //         isSearchBarFocused ? 'focus-glow' : ''
  //       }`}
  //     >
  //       <option value="All">All</option>
  //       {options.map((category) => (
  //         <option className="fontColor" key={category.name} >{category.name}</option>
  //       ))}
  //       {extraOptions?.map((option) => (
  //         <option className="fontColor" key={option.name} >{option.name}</option>
  //       ))}
  //       {/* <option className="fontColor" >Collections & Sales</option> */}
  //     </select>
  //   </div>
  // )
}
// href={`/${hrefTag}/${category.slug}`}
// href={`/${hrefTag}/${option.slug}`}

export default FilterSelect