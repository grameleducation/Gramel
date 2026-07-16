"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const links = [
  {
    href: "/student-profile",
    label: "Profile",
    icon: <User2 className="size-4 text-primary" />,
  },
  {
    href: "/student-profile/payment-history",
    label: "Payment History",
    icon: <CreditCard className="size-4 text-primary" />,
  },
];

export default function ProfileSidebarLinks() {
  const pathname = usePathname();
  return (
    <Card
      className={`max-lg:hidden ${pathname !== "/student-profile" ? "h-full" : ""}`}
    >
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 ${isActive ? "bg-primary-300/10 font-bold text-primary" : "hover:bg-primary-300/10"} `}
                  prefetch={false}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
