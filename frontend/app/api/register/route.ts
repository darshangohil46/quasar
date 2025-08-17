import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

function validateValue(value: string) {
  return value.length > 0;
}

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, password, username } =
      await request.json();

    if (
      !validateValue(email) &&
      !validateValue(firstName) &&
      !validateValue(lastName) &&
      !validateValue(password) &&
      !validateValue(username)
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BACKEND_API_URL}/api/accounts/register/`,
      {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      await cookies().set("access_token", response.data.token);
      return NextResponse.json("User successfully registered", {
        status: 200,
      });
    }
    return NextResponse.json("Registration Fail. Please Try Again Later...", {
      status: 400,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error." },
      { status: error.response?.status || 500 }
    );
  }
}
