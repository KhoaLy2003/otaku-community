import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Plus, Search, Send, Menu } from "lucide-react";
import { Colors } from "../../constants/colors";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { TextInput } from "../ui/TextInput";
import { UserMenu } from "./UserMenu";
import { useAuth } from "../../hooks/useAuth";
import { useChatStore } from "../../store/useChatStore";

import { NotificationBadge } from '../notification/NotificationBadge';

export function Header() {
  const { auth0User, isLoading } = useAuth();
  const navigate = useNavigate();
  const { unreadCounts } = useChatStore();

  const totalUnreadChat = Object.entries(unreadCounts).reduce((acc, [_, count]) => acc + count, 0);

  return (
    <header
      className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur"
      style={{ borderColor: Colors.Grey[20] }}
    >
      <div className="flex max-w-[100%] w-full items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-white">
            <img
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </span>
          <div className="hidden flex-col text-sm font-semibold leading-tight sm:flex">
            <span className="text-[#1a1a1b]">Otaku Community</span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/create-post">
            <Button
              variant="outline"
              color="grey"
              className="gap-2 px-7 py-3"
              icon={<Plus className="h-4 w-4" color={Colors.Orange[30]} />}
            >
              Create Post
            </Button>
          </Link>
        </div>

        <TextInput
          className="flex-1 px-4 max-w-md"
          placeholder="Search communities"
          leadingIcon={<Search className="h-5 w-5 text-[#7c7c7c]" />}
        />

        <div className="hidden items-center gap-5 md:flex">
          <IconButton aria-label="Messages" onClick={() => navigate('/chat')}>
            <div className="relative">
              <MessageCircle className="h-5 w-5" />
              {totalUnreadChat > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalUnreadChat > 9 ? "9+" : totalUnreadChat}
                </span>
              )}
            </div>
          </IconButton>
          <IconButton aria-label="Chat">
            <Send className="h-5 w-5" />
          </IconButton>
          <NotificationBadge />
          <Button variant="outline" color="orange">
            Get App
          </Button>
        </div>

        <button className="md:hidden">
          <Menu className="h-6 w-6 text-[#1a1a1b]" />
        </button>

        {/* Auth Section */}
        {isLoading ? (
          <div className="h-10 w-24 animate-pulse bg-gray-200 rounded" />
        ) : auth0User ? (
          <UserMenu />
        ) : (
          <Button
            onClick={() => navigate("/login")}
            color="orange"
            size="md"
          >
            Log In
          </Button>
        )}
      </div>
    </header>
  );
}