// pages/api/signup.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { CHESS_APIS } from "../../../utils/api_urls";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const response = await fetch(CHESS_APIS.AUTH_APIS.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        res.status(response.status).json({ message: errorData.error });
        return;
      }

      const data = await response.json();
      res.status(201).json({ message: data.message });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
