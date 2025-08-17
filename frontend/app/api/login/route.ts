import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BACKEND_API_URL}/api/accounts/login/`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set the access token in cookies
    if (response.status === 201 || response.status === 200) {
      await cookies().set("access_token", response.data.token);
      return NextResponse.json("User Logged in successfully", {
        status: 200,
      });
    }
    return NextResponse.json("Login Fail. Please Try Again Later...", {
      status: 400,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Login failed." },
      { status: error.response?.status || 500 }
    );
  }
}
