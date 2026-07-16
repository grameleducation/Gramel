"use client";

import logo from "../../../public/gramel-education-logo.png";
import gramel_icon from "../../../public/gramel-icon.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  LogoutButton,
  DashboardSidebarMenuItem,
} from "./DashboardSidebarClientComponents";
import { PanelsTopLeft, UserCheck, UserRoundPen, Users } from "lucide-react";
import { RequirePermission } from "../auth/RequirePermission";
import { UserActions } from "@/lib/permissions/role";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { BadgeDollarSign } from "lucide-react";

export default function DashboardSidebar() {
  const { user, isUserLoading } = useAuthContext();
  const avatarUrl = user?.profile_picture_url;

  return (
    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="h-16 border-b bg-white py-4 pl-4 group-data-[collapsible=icon]:pl-2">
        {/* Logo */}
        <Link href="/" className="" prefetch={false}>
          {/* Show icon when collapsed */}
          <Image
            src={gramel_icon}
            alt="Gramel Education Icon"
            className="hidden h-6 group-data-[collapsible=icon]:inline-block"
          />
          {/* Show logo when not collapsed */}
          <Image
            src={logo}
            alt="Gramel Logo"
            className="h-8 w-auto group-data-[collapsible=icon]:hidden"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            <DashboardSidebarMenuItem
              href="/dashboard"
              icon={
                <PanelsTopLeft className="fill-primary text-white group-data-[collapsible=icon]:size-6" />
              }
              label="Dashboard"
            />

            <DashboardSidebarMenuItem
              href="/dashboard/students-management"
              icon={
                <Users className="fill-primary group-data-[collapsible=icon]:size-6" />
              }
              label="Students Management"
            />

            <RequirePermission
              role={user?.role}
              action={UserActions.view_admin_staff_management}
            >
              <DashboardSidebarMenuItem
                href="/dashboard/staff-management"
                icon={
                  <UserCheck className="fill-primary group-data-[collapsible=icon]:size-6" />
                }
                label="Staff Management"
              />
            </RequirePermission>

            <RequirePermission
              role={user?.role}
              action={UserActions.update_services_price}
            >
              <DashboardSidebarMenuItem
                href="/dashboard/service-management"
                icon={
                  <BadgeDollarSign className="group-data-[collapsible=icon]:size-6" />
                }
                label="Service Management"
              />
            </RequirePermission>

            <DashboardSidebarMenuItem
              href="/dashboard/profile"
              icon={
                <UserRoundPen className="group-data-[collapsible=icon]:size-6" />
              }
              label="My Profile"
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4">
        {/* User Details */}
        <div className="flex items-center gap-2 sm:hidden">
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
          <div className="flex flex-col justify-center gap-0.5">
            {isUserLoading ? (
              <Skeleton className="h-4 w-36 rounded-sm bg-gray-200" />
            ) : (
              <p className="text-sm leading-none font-semibold text-gray-600 capitalize">
                {user?.first_name}
              </p>
            )}
            <span className="text-xs leading-none text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </span>
          </div>
        </div>

        <LogoutButton />

        <p className="text-center text-sm whitespace-nowrap text-gray-500 group-data-[collapsible=icon]:hidden">
          &copy; {new Date().getFullYear()} Gramel Education.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
