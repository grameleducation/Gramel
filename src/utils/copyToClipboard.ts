import { toast } from "sonner";

export default async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard", {
    duration: 2000,
    position: "bottom-center",
  });
}
