"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'

const SearchBar = ({ resetSearchText }) => {

  const [searchText, setSearchText] = useState('');
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const router = useRouter();
  
  // To sustain search state between reloads if needed
  const searchParams = useSearchParams()
  const [isFirstRedner, setIsFirstRender] = useState(true);
  useEffect(() => {
    const search = searchParams.get('searchText')
    if (search) {
      setSearchText(search);
    }
  }, []);

  useEffect(() => {
    if(!isFirstRedner) setSearchText(''); //Resets search text when triggered
    setIsFirstRender(false);
  }, [resetSearchText]);
  
  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
    if(e.target.value === ''){
      handleSearch(true);
    }
  };

  const handleSearch = (isEmpty) => {
    const currentParams = new URLSearchParams(window.location.search);
    // currentParams.delete("category");
    currentParams.delete("cursor");
    if(isEmpty) currentParams.set("searchText", "");
    else currentParams.set("searchText", searchText);

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;

    router.push(newPathname);
  }

  var arabic = /[\u0600-\u06FF]/;
  return (
    <form
      className={`relative fontColorGray border-2 border-black rounded-full ${
        isSearchBarFocused ? 'focus-glow' : ''
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <label htmlFor="searchbar">
        <svg
          className="absolute left-2 top-3 rotate-6 cursor-text"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <input
          dir={arabic.test(searchText) ? 'rtl' : 'ltr'}
          id="searchbar"
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchBarFocused(true)}
          onBlur={() => setIsSearchBarFocused(false)}
          required
          className="rounded-full pl-8 pr-5 py-2 colorScheme w-full"
        />
      </label>
    </form>
  )
}

export default SearchBar