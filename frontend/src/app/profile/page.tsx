"use client";
import React from "react";
import { useUserContext } from "../../../state/userProvider";

// Function for validation of date format
function isValidDate(stringDate: string) {
  return !isNaN(Date.parse(stringDate));
}

const Profile = () => {
  const { user } = useUserContext();

  return (
    <div className="p-[56px] bg-[#ffd59b] min-h-[100vh] pt-[100px]">
      {" "}
      <div className="w-full flex items-start justify-between">
        <div className="flex items-start flex-col mb-[40px] justify-between gap-4">
          <h2 className="text-[#37322f] text-[48px] font-[600] leading-[52px]">
            Profile
          </h2>
          {user !== null &&
            user !== undefined &&
            Object.entries(user)
              .filter(([key, value]) => key !== "_id" && key !== "password")
              .map(([key, value], index) => (
                <div className="flex" key={index}>
                  <p className="font-bold">{key.split("_").join(" ")}</p>:{" "}
                  <p className="ml-2">
                    {typeof value === "string"
                      ? isValidDate(value)
                        ? new Date(value).toDateString()
                        : value
                      : value}
                  </p>
                </div>
              ))}
        </div>
        <button
          onClick={() => {}}
          className="bg-[#f3f4f5] text-[#000] px-5 py-2 rounded-lg"
        >
          Sign-out
        </button>
      </div>
    </div>
  );
};

export default Profile;
