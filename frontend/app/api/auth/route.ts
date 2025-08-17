import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const tokenCookie = cookies().get("access_token");
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/api/accounts/auth/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(
      {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        username: response.data.username,
        token: response.data.token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error." },
      { status: error.response?.status || 500 }
    );
  }
}
