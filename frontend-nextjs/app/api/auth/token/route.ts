// import { getAccessToken } from "@auth0/nextjs-auth0";

// export async function GET() {
//   try {
//     const accessToken = await getAccessToken();
//     console.log("token: ", accessToken);

//     if (!accessToken) {
//       return Response.json(
//         { message: "No access token found" },
//         { status: 401 }
//       );
//     }

//     return Response.json({ token: accessToken });
//   } catch (error) {
//     console.error("Error fetching access token:", error);
//     return Response.json(
//       { message: "Failed to retrieve token" },
//       { status: 500 }
//     );
//   }
// }

import { auth0 } from '@/lib/auth0'

export async function GET() {
  try {
    const token = await auth0.getAccessToken();

    if (!token) {
      return Response.json(
        { message: "No access token found" },
        { status: 401 }
      );
    }

    return Response.json({
      token,
    });
  } catch (error) {
    console.error("Error fetching access token:", error);

    return Response.json(
      { message: "Failed to retrieve token" },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from 'next/server'
// import { auth0 } from '@/lib/auth0'

// export async function GET(request: NextRequest) {
//   try {
//     // Get the session first to ensure user is authenticated
//     const session = await auth0.getSession(request)

//     if (!session || !session.user) {
//       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//     }

//     // Get the access token from the session
//     const accessToken = session.accessToken

//     if (!accessToken) {
//       return NextResponse.json({ error: 'No access token available' }, { status: 401 })
//     }

//     return NextResponse.json({
//       accessToken,
//       user: session.user
//     })
//   } catch (error) {
//     console.error('Error getting access token:', error)
//     return NextResponse.json(
//       { error: 'Failed to get access token' },
//       { status: 500 }
//     )
//   }
// }
