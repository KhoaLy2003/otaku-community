import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

interface UserProfileCardProps {
  username: string;
  isOwnProfile?: boolean;
}

export function UserProfileCard({ username, isOwnProfile = false }: UserProfileCardProps) {
  const { auth0User } = useAuth();

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {auth0User?.picture ? (
            <img
              src={auth0User.picture}
              alt={auth0User.nickname}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
              {auth0User?.nickname?.charAt(0).toUpperCase() || username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {auth0User?.nickname || username}
          </h1>
          <p className="text-gray-600 mb-4">{auth0User?.username || `@${username}`}</p>

          {isOwnProfile && (
            <Button color="blue" size="sm">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function UserPostsCard() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
      <p className="text-gray-500 text-center py-8">No posts yet</p>
    </Card>
  );
}