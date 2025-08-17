import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const res = await axios.post(
      `${process.env.BACKEND_API_URL}/api/chat/get-full-chat/`,
      { chat_id: id },
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
