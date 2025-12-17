import { NextResponse } from "next/server";
import { useUser } from "@auth0/nextjs-auth0";
import { console } from "inspector";

export async function POST(request: Request) {
  try {
    const session = useUser();
    console.log("User: ", session);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { auth0Id, email, username, avatar } = body;

    // Call your backend API to sync/create user
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const response = await fetch(`${backendUrl}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user}`,
      },
      body: JSON.stringify({
        auth0Id,
        email,
        username,
        avatar,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync user with backend");
    }

    const userData = await response.json();

    return NextResponse.json({ user: userData.data });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
