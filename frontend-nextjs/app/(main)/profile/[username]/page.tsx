"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { auth0User } = useAuth();
  const params = useParams();
  const nickname = params.nickname as string;

  // For now, only show current user's profile
  // const isOwnProfile = auth0User?.nickname === nickname;

  // if (!isOwnProfile) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 max-w-4xl">
  //       <Card className="p-6">
  //         <p className="text-gray-600">User not found</p>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {auth0User?.picture ? (
              <Image
                src={auth0User.picture}
                alt={auth0User.nickname}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                {auth0User?.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {auth0User?.nickname}
            </h1>
            <p className="text-gray-600 mb-4">{auth0User?.email}</p>

            {auth0User?.bio && (
              <p className="text-gray-700 mb-4">{auth0User.bio}</p>
            )}

            {auth0User?.interests && auth0User.interests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Interests
                </h3>
                {/* <div className="flex flex-wrap gap-2">
                  {auth0User.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div> */}
              </div>
            )}

            <Button color="blue" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
        <p className="text-gray-500 text-center py-8">No posts yet</p>
      </Card>
    </div>
  );
}
