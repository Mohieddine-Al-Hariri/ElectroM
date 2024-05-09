"use client";
import Image from "next/image";
import LocationInput from "./LocationInput";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { publishUser, updateTheUser } from "@/lib";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "@/lib/firebaseConfig";
import { DarkMBtn, Order, SVGCheck, SVGLoading, SVGPencil } from ".";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage = ({ user, orders }) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    birthDate,
    orderItems,
    profileImageUrl,
    location,
  } = user;
  const [selectedLocation, setSelectedLocation] = useState(location || "");
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    firstName,
    lastName,
    email,
    phoneNumber,
    profileImageUrl,
    birthDate,
  });
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDarkMode]);

  const uploadImage = async (imagePath) => {
    //To add the new profile image to the database
    if (imagePath == null || !imagePath) {
      return profileImageUrl;
    }
    const imageRef = ref(storage, `profileImages/${imagePath.name + v4()}`);
    const imageUrl = await uploadBytes(imageRef, imagePath).then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(snapshot.ref).then((url) => {
          return url;
        });
        return downloadUrl;
      }
    );
    return imageUrl;
  };
  const deletePrevImage = async (prevImgUrl) => {
    //To remove the old profile Image from the database
    try {
      const imageRef = ref(storage, prevImgUrl);
      await deleteObject(imageRef).catch((error) => {
        console.log(error.message);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  function convertDateToISO8601(dateString) {
    // Create a Date object from the provided date string
    const date = new Date(dateString);
  
    // Format the date components in ISO8601 format
    const isoDate = date.toISOString();

    //Removing the time
    // const slicedIsoDate = isoDate.slice(0, isoDate.indexOf("T"));

    return isoDate
  }  

  const handleSubmitProfileEdits = async () => {
    setIsSaving(true);
    const birthDate = convertDateToISO8601(updatedUserDetails.birthDate);
    if (profileImageUrl) {
      await deletePrevImage(profileImageUrl);
    }
    const imgUrl = await uploadImage(imageUpload);
    await updateTheUser({
      ...updatedUserDetails,
      location: selectedLocation,
      userId: user.id,
      imgUrl,
      birthDate
    });
    await publishUser(user.slug);
    setIsSaving(false);
    setIsEdit(false);
    router.refresh();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleChangeImage = (e) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");

      return;
    }
    setImageUpload(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result;

      // handleStateChange("image", result)
      setUpdatedUserDetails({ ...updatedUserDetails, profileImageUrl: result });
    };
  };

  if (isEdit)
    return (
      <div className="bgColor h-full flex flex-col justify-start items-center gap-5 overflow-y-scroll">
        <div className="w-full h-fit flex justify-between p-6 max-sm:py-2 fontColor">
          <button
            onClick={() => setIsEdit(false)}
            className="w-[19.78px] relative "
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 0.9 0.9"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <title>Go Back</title>
              <g
                id="\u9875\u9762-1"
                stroke="none"
                strokeWidth={1}
                fill="none"
                fillRule="evenodd"
              >
                <g id="Arrow" transform="translate(-240)">
                  <g id="back_line" transform="translate(240)">
                    <path
                      d="M0.9 0v0.9H0V0h0.9ZM0.472 0.872l0 0 -0.003 0.001 -0.001 0 -0.001 0 -0.003 -0.001c0 0 -0.001 0 -0.001 0l0 0 -0.001 0.016 0 0.001 0 0 0.004 0.003 0.001 0 0 0 0.004 -0.003 0 -0.001 0 -0.001 -0.001 -0.016c0 0 0 -0.001 -0.001 -0.001Zm0.01 -0.004 0 0 -0.007 0.003 0 0 0 0 0.001 0.016 0 0 0 0 0.008 0.003c0 0 0.001 0 0.001 0l0 -0.001 -0.001 -0.023c0 0 0 -0.001 -0.001 -0.001Zm-0.027 0a0.001 0.001 0 0 0 -0.001 0l0 0.001 -0.001 0.023c0 0 0 0.001 0.001 0.001l0.001 0 0.008 -0.003 0 0 0 0 0.001 -0.016 0 0 0 0 -0.007 -0.003Z"
                      id="MingCute"
                      fillRule="nonzero"
                    />
                    <path
                      d="M0.115 0.211A0.037 0.037 0 0 1 0.15 0.188h0.375a0.263 0.263 0 1 1 0 0.525H0.188a0.037 0.037 0 1 1 0 -0.075h0.337a0.188 0.188 0 1 0 0 -0.375H0.241l0.067 0.067a0.037 0.037 0 0 1 -0.053 0.053l-0.131 -0.131a0.037 0.037 0 0 1 -0.008 -0.041Z"
                      id="\u8DEF\u5F84"
                      fill="currentColor"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </button>
          {isSaving ? (
            <SVGLoading/>
          ) : (
            <button disabled={isSaving} onClick={handleSubmitProfileEdits}>
              <SVGCheck/>
            </button>
          )}
        </div>
        <div className="flexCenter h-full flex-col w-full lg:min-h-[200px] relative rounded-full ">
          {!updatedUserDetails.profileImageUrl && (
            <label
              htmlFor="poster"
              className="flexCenter form_image-label fontColor absolute"
            >
              Choose a Profile Image
            </label>
          )}
          <div className="flexCenter bg-gray-500 rounded-full overflow-hidden p-4 w-[140px] h-[140px] ">
            <input
              id="image"
              type="file"
              accept="image/*"
              // required={type === "create" ? true : false}
              className="form_image-input "
              onChange={(e) => handleChangeImage(e)}
            />
            {updatedUserDetails.profileImageUrl && (
              <div className="relative rounded-full aspect-square w-[140px] h-[140px]">
                <Image
                  src={updatedUserDetails?.profileImageUrl}
                  className=" object-cover z-20 rounded-full w-[140px] h-[140px] aspect-square md:inline-block"
                  alt="image"
                  fill
                />
              </div>
            )}
          </div>
        </div>
        <div className="fontColor text-sm font-bold text-center ">
          <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md flex flex-col gap-2 colorScheme ">
            <div className="flex gap-2">
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={updatedUserDetails.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={updatedUserDetails.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={updatedUserDetails.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#4bc0d9]"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          {/* {location ? (
            <h2>{location}</h2>
          ) : ( */}
            <LocationInput
              location={user.location}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
            
          {/* // )} */}
          {/* {selectedLocation && (
            <p className="mt-4">
              Selected Location: {selectedLocation}
            </p>
          )} */}
          <div className="h-[75px] w-full "></div>
        </div>
        {/* <div className="w-full h-full border-solid border-t-2 border-[#8f8f8f] fontColor overflow-y-scroll ">
          <h1 className="p-2 text-xl font-semibold ">Orders</h1>
          {orders?.map((order) => (
            <Order order={order.node} key={order.node.id} />
          ))}
        </div> */}
      </div>
    );
  
  return (
    <div className="bgColor fontColor h-screen flex flex-col justify-start items-center gap-5 max-sm:gap-3 ">
      <div className="w-full h-fit flex justify-between p-6 max-sm:py-2 max-sm:px-4">
        <button onClick={signOut} className="w-[19.78px] max-sm:w-fit relative fontColor ">
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 1.8 1.8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              width="48"
              height="48"
              fill="currentColor"
              fillOpacity="0.01"
              d="M0 0H1.8V1.8H0V0z"
            />
            <path
              d="M0.9 0.225H0.225v1.35h0.675"
              stroke="currentColor"
              strokeWidth="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m1.238 1.238 0.337 -0.337 -0.337 -0.337"
              stroke="currentColor"
              strokeWidth="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.6 0.9h0.975"
              stroke="currentColor"
              strokeWidth="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <DarkMBtn isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <button onClick={() => setIsEdit(!isEdit)}>
          <SVGPencil/>
        </button>
      </div>
      <Image
        src={profileImageUrl || "/Ellipse 32.png"}
        width={167}
        height={167}
        className="w-[167px] h-[167px] max-sm:w-[100px] max-sm:h-[100px] rounded-full"
        alt="profileImg"
      />
      <div className="text-center">
        <h1 className="text-2xl max-sm:text-xl font-semibold mb-2">
          {firstName} {lastName}
        </h1>
        <ul className="list-none p-0 max-sm:text-sm">
          <li className="fontColorGray mb-1">{phoneNumber}</li>
          <li className="fontColorGray mb-1">{email}</li>
          <li className="fontColorGray mb-1">Location: {location}</li>
          <li className="fontColorGray">BirthDate: {birthDate}</li>
        </ul>
      </div>
      <div className="w-full h-full border-solid border-t-2 space-y-1 border-[#8f8f8f] fontColor p-1 overflow-y-scroll ">
        <h1 className="p-2 text-xl font-semibold ">
          Orders <u> {orders.length}</u> - {orders.length === 0 ? <Link href={"/"} className="underline">Start Shopping</Link> : ""} 
        </h1>
        {orders?.map((order) => (
          <Order key={order.node.id} order={order.node} />
        ))}
        <div className="h-[80px] max-sm:h-[100px] w-full "></div>
      </div>
    </div>
  );
};

export default ProfilePage;
