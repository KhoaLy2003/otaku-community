import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut, BookOpen, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/colors";
import { ROUTES } from "../../constants/routes";

export function UserMenu() {
  const { user, auth0User, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    navigate(`/profile/${user?.username || auth0User?.nickname}`);
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setIsOpen(false);
  };

  const handleMangaDashboard = () => {
    navigate(ROUTES.MANGA_DASHBOARD);
    setIsOpen(false);
  };

  const handleAdminPanel = () => {
    navigate(ROUTES.ADMIN_DASHBOARD);
    setIsOpen(false);
  };

  if (!auth0User) return null;

  const displayName = user?.displayName || user?.username || auth0User.name || auth0User.nickname;
  const username = user?.username || auth0User.nickname;
  const avatarUrl = user?.avatarUrl || auth0User.picture;
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded border px-1 sm:px-3 py-1 sm:py-2 text-left transition hover:border-gray-300 border-transparent sm:border-gray-100"
        style={{
          borderColor: isOpen ? Colors.Grey[30] : undefined,
          color: Colors.Grey[70],
        }}
      >
        <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center text-white rounded-full overflow-hidden bg-orange-500 shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">
              {username?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </span>
        <div className="hidden text-sm md:block">
          <p className="font-semibold text-[#1a1a1b] leading-tight">{displayName}</p>
          <p className="text-[10px] text-[#7c7c7c]">u/{username}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 hidden sm:block transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg z-50"
          style={{ borderColor: Colors.Grey[20] }}
        >
          <div
            className="p-3 border-b"
            style={{ borderColor: Colors.Grey[20] }}
          >
            <p className="font-semibold text-sm text-[#1a1a1b]">
              {displayName}
            </p>
            <p className="text-sm text-[#7c7c7c]">{username}</p>
            {isAdmin && (
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Administrator</p>
            )}
          </div>

          <div className="py-2">
            <button
              onClick={handleProfile}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#1a1a1b] hover:bg-gray-50 transition"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            {isAdmin && (
              <button
                onClick={handleAdminPanel}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition"
              >
                <Shield className="h-4 w-4" />
                <span className="font-bold">Admin Panel</span>
              </button>
            )}

            <button
              onClick={handleSettings}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#1a1a1b] hover:bg-gray-50 transition"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleMangaDashboard}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#1a1a1b] hover:bg-gray-50 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Manga Dashboard</span>
            </button>
          </div>

          <div
            className="border-t py-2"
            style={{ borderColor: Colors.Grey[20] }}
          >
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
