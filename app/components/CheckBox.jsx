"use client";

function CheckBox({ isChecked, setIsChecked, label }) {

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      {label}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={toggleCheckbox}
        className="h-6 w-6 hidden border-2 border-gray-300 checked:bg-blue-400 checked:border-blue-400"
      />
      <span
        className={`w-6 h-6 rounded-lg p-1 border-2 border-gray-300 ${
          isChecked ? 'bg-blue-400 transition duration-100 shadow-inner shadow-white ' : 'bg-white transition duration-100'
        }`}
      ></span>
    </label>
  );
}

export default CheckBox;
