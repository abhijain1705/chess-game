"use client";
import React, { useCallback, useEffect, useState, ReactNode } from "react";
import toast from "react-hot-toast";
import LoadingScreen from "@/components/loading/loading-screen";
import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface IProp {
  children: ReactNode;
}

// Define the TypeScript interface based on the Zod schema
export interface User {
  profile_picture?: string; // Optional URL string
  name: string; // Required string with a minimum length of 1
  username: string; // Required string with a minimum length of 1
  email: string; // Required string that must be a valid email
  score: number; // Required integer, default is 0
  password: string; // Required string
  lastLogInDate: Date; // Required date, default is the current date
  lastLogInDevice: string; // Required string
  match_played: number; // Required integer, default is 0
  match_failed: number; // Required integer, default is 0
  match_win: number; // Required integer, default is 0
  createdAt: Date; // Required date, default is the current date
  updatedAt: Date; // Required date, default is the current date
}

export const ContextUserProvider = createContext<{ user: User | null }>({
  user: {
    profile_picture: "", // Empty string for optional URL string
    name: "", // Empty string for required string
    username: "", // Empty string for required string
    email: "", // Empty string for required string
    score: 0, // Default integer value
    password: "", // Empty string for required string
    lastLogInDate: new Date(), // Current date for required date
    lastLogInDevice: "", // Empty string for required string
    match_played: 0, // Default integer value
    match_failed: 0, // Default integer value
    match_win: 0, // Default integer value
    createdAt: new Date(), // Current date for required date
    updatedAt: new Date(), // Current date for required date
  },
});

export const useUserContext = () => useContext(ContextUserProvider);

const notAccessibleRoutesAfterLogin = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const notAccessibleRoutesBeforeLogin = [""];

const UserContextProvider = ({ children }: IProp) => {
  const [userData, setuserData] = useState<{ user: User | null }>({
    user: null,
  });

  const [loader, setloader] = useState(true);

  const pathname = usePathname();

  const route = useRouter();

  function handleProperRouting() {
    if (notAccessibleRoutesBeforeLogin.includes(pathname)) {
      route.replace("/");
    }
  }

  const fetchData = useCallback(async () => {
    setloader(true);

    const email = window.localStorage.getItem("useremail");

    if (email === undefined || email === null) {
      handleProperRouting();
      setloader(false);
    } else {
      try {
        const response = await axios.post("/api/getUserFromEmail", {
          email: email,
        });

        if (response.status === 200) {
          const res = response.data;
          if (notAccessibleRoutesAfterLogin.includes(pathname)) {
            route.replace("/");
          }
          setuserData({ user: res.message });
        } else {
          handleProperRouting();
          toast.error(response.data.message);
        }
      } catch (error: any) {
        handleProperRouting();
        toast.error(error.message);
      } finally {
        setloader(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loader) {
    return <LoadingScreen />;
  }

  return (
    <ContextUserProvider.Provider value={userData}>
      {children}
    </ContextUserProvider.Provider>
  );
};

export default UserContextProvider;
