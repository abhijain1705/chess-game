import { CHESS_APIS } from "./../../../../utils/api_urls";
// pages/api/signup.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const data = await req.json();
    const { newPassword, token } = JSON.parse(data.body);

    try {
      const response = await fetch(
        CHESS_APIS.AUTH_APIS.RESET_PASSWORD + `/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      if (response.status !== 201) {
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
