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

interface HeaderProps {
  onOpenMenu?: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  const { auth0User, isLoading } = useAuth();
  const navigate = useNavigate();
  const { unreadCounts } = useChatStore();

  const totalUnreadChat = Object.entries(unreadCounts).reduce((acc, [_, count]) => acc + count, 0);

  return (
    <header
      className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur"
      style={{ borderColor: Colors.Grey[20] }}
    >
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 py-1 sm:py-2">
        {/* LEFT: Menu & Logo */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            className="p-1.5 hover:bg-gray-100 rounded-full transition md:hidden"
            onClick={onOpenMenu}
          >
            <Menu className="h-6 w-6 text-[#1a1a1b]" />
          </button>

          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-white">
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
        </div>

        {/* MIDDLE: Search */}
        <div className="flex-1 max-w-2xl hidden sm:flex mx-4">
          <TextInput
            className="w-full"
            placeholder="Search communities, posts, or tags..."
            leadingIcon={<Search className="h-4 w-4 text-[#7c7c7c]" />}
          />
        </div>

        {/* RIGHT: Actions & Auth */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <IconButton className="sm:hidden" aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>

          <div className="hidden items-center gap-1 md:gap-2 md:flex">
            <IconButton aria-label="Create Post" onClick={() => navigate('/create-post')}>
              <Plus className="h-5 w-5" color={Colors.Grey[70]} />
            </IconButton>
            <IconButton aria-label="Messages" onClick={() => navigate('/chat')}>
              <div className="relative">
                <MessageCircle className="h-5 w-5" color={Colors.Grey[70]} />
                {totalUnreadChat > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white scale-75">
                    {totalUnreadChat > 9 ? "9+" : totalUnreadChat}
                  </span>
                )}
              </div>
            </IconButton>
            <NotificationBadge />
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

          {/* Auth Section */}
          {isLoading ? (
            <div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />
          ) : auth0User ? (
            <UserMenu />
          ) : (
            <Button
              onClick={() => navigate("/login")}
              color="orange"
              size="sm"
              className="px-4 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}