"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePdfFill, MicrosoftWord } from "@/lib/icons";
import { Download, Image, Loader, Printer } from "lucide-react";
import { StudentData } from "./types";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  downloadStudentProfileDocx,
  downloadStudentProfilePdf,
  printStudentProfilePdf,
} from "./downloadStudentProfile";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function DownloadDropDown({
  studentData,
}: {
  studentData: StudentData;
}) {
  const [loading, startTransition] = useTransition();

  async function handleDocument(
    fn: (studentData: StudentData) => Promise<void>,
    action: "print" | "download",
  ) {
    startTransition(async () => {
      try {
        await fn(studentData);
        if (action === "download")
          toast.success("Download initiated successfully", {
            duration: 2000,
          });
      } catch {
        toast.error(`Failed to ${action} document. Please try again.`);
      }
    });
  }

  // Intercept Ctrl+P / ⌘+P print command
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handleDocument(printStudentProfilePdf, "print");
      }
    }
    window.addEventListener("keydown", handleKeydown);

    // cleanup function
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow ring-2 ring-primary-300 hover:bg-gray-50 focus-visible:outline-primary-300">
          <Download className="size-4" />
          <span className="hidden xs:inline"> Download / Print</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1 px-3 py-3">
          <DropdownMenuLabel className="font-semibold">
            Download profile as:
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-light-gray-100"
            onClick={() => {
              setTimeout(() => {
                handleDocument(downloadStudentProfilePdf, "download");
              }, 20); // Give time for the dropdown to close
            }}
          >
            <FilePdfFill /> PDF Document
          </DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-light-gray-100"
            onClick={() => {
              setTimeout(() => {
                handleDocument(downloadStudentProfileDocx, "download");
              }, 20);
            }}
          >
            <MicrosoftWord /> Word Document
          </DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-light-gray-100"
            onClick={() => {
              setTimeout(() => {
                handleDocument(printStudentProfilePdf, "print");
              }, 20);
            }}
          >
            <Printer /> Print
          </DropdownMenuItem>

          {studentData.profile_picture_url ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="font-semibold focus:bg-light-gray-100"
              >
                <Link
                  href={studentData.profile_picture_url.replace(
                    "/upload/",
                    `/upload/fl_attachment:${studentData.first_name}${studentData.middle_name ? `_${studentData.middle_name}` : ""}_${studentData.last_name}/`,
                  )}
                  prefetch={false}
                >
                  <Image /> Download Student Image
                </Link>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Loading spinner */}
      <AlertDialog open={loading}>
        <AlertDialogContent className="flex items-center justify-center border-none bg-transparent shadow-none">
          <Loader className="size-20 animate-spin text-white" />
          <AlertDialogTitle className="sr-only">
            Generating PDF...
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Generating PDF...
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
