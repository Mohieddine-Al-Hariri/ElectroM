"use client";
const HeroScrollBtn = () => {
  const scroll = () => {
    document.getElementById("startPage").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={(e) => {
        scroll();
        // e.preventDefault();
      }}
      className="bg-primaryColor px-8 py-2 rounded-sm text-white hover:bg-secondaryColor"
    >
      Shop Now
    </button>
  );
};

export default HeroScrollBtn;
