import { CHESS_APIS } from "./../../../../utils/api_urls";
// pages/api/signup.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const data = await req.json();
    const { email } = data;

    try {
      const response = await fetch(CHESS_APIS.AUTH_APIS.GET_USER_FROM_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        return NextResponse.json(
          { message: errorData.error },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({ message: data.message }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
