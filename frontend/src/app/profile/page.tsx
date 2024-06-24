"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "../../../state/userProvider";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingScreen from "@/components/loading/loading-screen";

// Function for validation of date format
function isValidDate(stringDate: string) {
  return !isNaN(Date.parse(stringDate));
}

const Profile = () => {
  const searchParams = useSearchParams();

  const [userData, setuserData] = useState<{ user: User | null }>({
    user: null,
  });
  const search = searchParams.get("username");
  const [loader, setloader] = useState(true);

  const fetchData = useCallback(async (username: string) => {
    setloader(true);

    try {
      const response = await axios.post("/api/getUserFromName", {
        username: username,
      });

      if (response.status === 200) {
        const res = response.data;

        setuserData({ user: res.message });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setloader(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (search !== undefined && search !== null) {
      fetchData(search?.toString());
    }
  }, [fetchData, search]);

  if (loader) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-[56px] bg-[#ffd59b] min-h-[100vh] pt-[100px]">
      {" "}
      <div className="w-full flex items-start justify-between">
        <div className="flex items-start flex-col mb-[40px] justify-between gap-4">
          <h2 className="text-[#37322f] text-[48px] font-[600] leading-[52px]">
            Profile
          </h2>
          {userData.user !== null &&
            Object.entries(userData.user)
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
