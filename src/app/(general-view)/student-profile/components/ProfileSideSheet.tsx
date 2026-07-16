"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlignLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "./ProfileSidebarLinks";

export function ProfileSideSheet() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden">
      <Sheet>
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-2">
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer hover:bg-primary-300/20"
            >
              <AlignLeft className="size-8 text-gray-700" />
            </Button>
          </SheetTrigger>

          <Breadcrumb>
            <BreadcrumbList>
              {pathname === "/student-profile" ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/student-profile" prefetch={false}>
                        Profile
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Payment History</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Quick Links</SheetTitle>
          </SheetHeader>
          <ul className="grid flex-1 auto-rows-min gap-3 px-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 ${isActive ? "bg-primary-300/10 font-bold text-primary" : "hover:bg-primary-300/10"} `}
                      prefetch={false}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
