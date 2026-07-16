import React from "react";
import ProfilePicture from "./components/ProfilePicture";
import ProfileSidebarLinks from "./components/ProfileSidebarLinks";
import { ProfileSideSheet } from "./components/ProfileSideSheet";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <ProfileSideSheet />
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-10 px-6 py-10 md:px-12 lg:grid-cols-[auto_1fr] xl:px-20">
        {/* Sidebar with profile picture and links */}
        <aside className="flex flex-col gap-4">
          {/* Profile picture */}
          <ProfilePicture />

          {/* Sidebar links */}
          <ProfileSidebarLinks />
        </aside>

        {children}
      </div>
    </main>
  );
}
