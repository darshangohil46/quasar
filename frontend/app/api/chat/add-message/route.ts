import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { chat_id, message } = await req.json();

    const res = await axios.post(
      `${process.env.BACKEND_API_URL}/api/chat/add-message/`,
      { chat_id: chat_id, message: message },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error(
      "Error sending chat message:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: "Failed to send chat message" },
      { status: error.response?.status || 500 }
    );
  }
}
