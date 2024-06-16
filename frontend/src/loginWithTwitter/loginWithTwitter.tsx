"use client";
import React from "react";

const LoginWithTwitter = () => {
  const api = async () => {
    const res = await fetch("http://localhost:3001/auth/twitter", {
      method: "GET",
    });
    console.log(res);
  };

  return (
    <button
      onClick={api}
      className="rounded-md px-12 py-2 flex items-center justify-center gap-2 text-white bg-[#000000] "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        width={30}
        height={30}
        viewBox="0 0 512 512"
      >
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
      Login with Twitter (X)
    </button>
  );
};

export default LoginWithTwitter;
