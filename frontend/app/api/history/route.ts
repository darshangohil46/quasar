import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { username } = await request.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  try {
    const { data } = await axios.post(
      `${process.env.BACKEND_API_URL}/api/chat/get-history/`,
      { username }
    );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching history data from backend:", error);
    return NextResponse.json(
      { error: "Failed to fetch history data" },
      { status: 500 }
    );
  }
}
