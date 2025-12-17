"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, MessageCircle, Plus, Search, Send, Menu } from "lucide-react";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { TextInput } from "@/components/ui/TextInput";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Header() {
  const { auth0User, isLoading } = useAuth();
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur"
      style={{ borderColor: Colors.Grey[20] }}
    >
      <div className="flex max-w-[100%] w-full items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-white rounded-full overflow-hidden">
            <Image
              src="/logo/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </span>
          <div className="hidden flex-col text-sm font-semibold leading-tight sm:flex">
            <span className="text-[#1a1a1b]">Otaku Community</span>
            <span className="text-xs font-normal text-[#7c7c7c]">
              Inspired by Reddit UI
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/create-post">
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

        <div className="hidden items-center gap-2 md:flex">
          <IconButton aria-label="Messages">
            <MessageCircle className="h-5 w-5" />
          </IconButton>
          <IconButton aria-label="Chat">
            <Send className="h-5 w-5" />
          </IconButton>
          <IconButton aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </IconButton>
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
            onClick={() => router.push("/login")}
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
