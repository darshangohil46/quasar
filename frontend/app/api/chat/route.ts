import { NextResponse } from "next/server";
import axios from "axios";

// Example body structure you send from frontend
// {
//   user: 1,
//   title: "My first chat",
//   history: [
//     {
//       id: "uuid",
//       content: "Hello! I'm your AI assistant. How can I help you today?",
//       role: "user",
//       timestamp: new Date()
//     }
//   ]
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const res = await axios.post(
      `${process.env.BACKEND_API_URL}/api/chat/create/`,
      body
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error(
      "Error creating chat:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error: "Failed to create chat",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
