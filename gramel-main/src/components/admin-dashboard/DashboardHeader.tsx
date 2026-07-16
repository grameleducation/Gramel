"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { NotificationsDialog } from "./NotificationsDialog";
import { getUnreadNotificationsCountAction } from "@/server-actions/notifications";

const headingsMap = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "My Profile",
  "/dashboard/students-management": "Students Management",
  "/dashboard/staff-management": "Staff Management",
  "/dashboard/service-management": "Services Price Management",
};

function pathnameInHeadingsMap(
  pathname: string,
): pathname is keyof typeof headingsMap {
  return pathname in headingsMap;
}

export function DashboardHeader() {
  const { user, isUserLoading } = useAuthContext();
  const pathname = usePathname();
  const heading = pathnameInHeadingsMap(pathname)
    ? headingsMap[pathname]
    : "Dashboard";
  const avatarUrl = user?.profile_picture_url;
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: ncount } = useQuery({
    queryKey: ["notificationsCount", user?.id],
    queryFn: () => getUnreadNotificationsCountAction(),
    refetchInterval: 1000 * 60 * 10, // refetch every 10 minutes
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    enabled: !!user,
  });
  const notificationsCount = ncount || 0;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 print:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-medium text-gray-700 xs:text-xl">{heading}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications container */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative cursor-pointer text-sm text-gray-500"
        >
          <span className="sr-only">Notifications</span>
          {/* notification count container */}
          {notificationsCount > 0 && (
            <div
              className={cn(
                "absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 font-bold text-white",
                notificationsCount < 10
                  ? "size-4.5"
                  : notificationsCount < 100
                    ? "-top-2.5 -right-2.5 size-5"
                    : "-top-3.5 -right-3 size-6.5",
              )}
            >
              {notificationsCount < 100 ? (
                notificationsCount
              ) : (
                // If more than 99 notifications, show 99+
                <span className="relative">
                  99&nbsp;
                  <span className="absolute -top-1 -right-0.5 text-xs">+</span>
                </span>
              )}
            </div>
          )}
          <Bell className="stroke-1" />
        </button>

        <NotificationsDialog
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />

        {/* vertical divider */}
        <div className="hidden w-px border border-gray-200 sm:block">
          &nbsp;
        </div>

        {/* User Details */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* avatar container */}
          {isUserLoading ? (
            <Skeleton className="size-10 rounded-full bg-gray-200" />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 uppercase">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User profile picture"
                  className="size-full rounded-full object-cover object-center"
                  width={40}
                  height={40}
                />
              ) : (
                <>
                  {/* initials as image placeholder */}
                  {user?.first_name?.charAt(0).toUpperCase()}
                  {user?.last_name?.charAt(0).toUpperCase()}
                </>
              )}
            </div>
          )}
          <div className="">
            {isUserLoading ? (
              <Skeleton className="h-4 w-20 rounded-sm bg-gray-200" />
            ) : (
              <p className="min-w-20 text-sm font-semibold text-gray-600 capitalize">
                {user?.first_name}
              </p>
            )}
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
