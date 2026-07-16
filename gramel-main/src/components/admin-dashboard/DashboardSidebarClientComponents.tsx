"use client";

import { useAuthContext } from "@/context/AuthContext";
import { LoaderCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import React from "react";
import { usePathname } from "next/navigation";

export function LogoutButton() {
  const { isLoggingOut, handleLogout } = useAuthContext();

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-transparent bg-red-500 px-1 py-1 font-semibold whitespace-nowrap text-white transition-colors duration-300 hover:bg-red-400"
    >
      <LoaderCircle className="hidden animate-spin group-disabled:block" />
      <LogOut className="hidden group-data-[collapsible=icon]:inline-block" />
      <span className="group-data-[collapsible=icon]:hidden">
        {isLoggingOut ? "Logging Out..." : "Log Out"}
      </span>
    </button>
  );
}

export function DashboardSidebarMenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactElement;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={`text-base group-data-[collapsible=icon]:p-1! hover:bg-light-gray data-[active=true]:bg-light-gray-100`}
        isActive={
          pathname === href ||
          (href === "/dashboard/profile" &&
            pathname.startsWith("/dashboard/profile")) ||
          (href === "/dashboard/students-management" &&
            pathname.startsWith("/dashboard/students-management")) ||
          (href === "/dashboard/staff-management" &&
            pathname.startsWith("/dashboard/staff-management"))
        }
        asChild
      >
        <Link href={href} prefetch={false}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
