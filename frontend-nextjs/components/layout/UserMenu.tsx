"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";

export function UserMenu() {
  const { auth0User, logout } = useAuth();
  const router = useRouter();
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
    router.push("/");
  };

  const handleProfile = () => {
    router.push(`/profile/${auth0User?.nickname}`);
    setIsOpen(false);
  };

  const handleSettings = () => {
    router.push("/settings");
    setIsOpen(false);
  };

  if (!auth0User) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded border px-3 py-2 text-left transition hover:border-gray-300"
        style={{
          borderColor: isOpen ? Colors.Grey[30] : "transparent",
          color: Colors.Grey[70],
        }}
      >
        <span className="flex h-9 w-9 items-center justify-center text-white rounded-full overflow-hidden bg-orange-500">
          {auth0User.picture ? (
            <Image
              src={auth0User.picture}
              alt={auth0User.username}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">
              {auth0User.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </span>
        <div className="hidden text-xs md:block">
          <p className="font-semibold text-[#1a1a1b]">{auth0User.nickname}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg"
          style={{ borderColor: Colors.Grey[20] }}
        >
          <div
            className="p-3 border-b"
            style={{ borderColor: Colors.Grey[20] }}
          >
            <p className="font-semibold text-sm text-[#1a1a1b]">
              {auth0User.username}
            </p>
            <p className="text-xs text-[#7c7c7c]">{auth0User.nickname}</p>
          </div>

          <div className="py-2">
            <button
              onClick={handleProfile}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#1a1a1b] hover:bg-gray-50 transition"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleSettings}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#1a1a1b] hover:bg-gray-50 transition"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
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
