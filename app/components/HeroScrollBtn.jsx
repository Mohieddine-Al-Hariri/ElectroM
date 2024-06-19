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
      className="bg-primaryColor border-2 border-primaryColor px-8 max-sm:px-6 py-2 rounded-sm text-white hover:bg-transparent transition-colors duration-100 hover:text-primaryColor "
    >
      Shop Now
    </button>
  );
};

export default HeroScrollBtn;
