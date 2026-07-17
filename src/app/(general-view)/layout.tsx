import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Navbar/Footer detect the assist subdomain themselves (client-side, via
// window.location) rather than this layout reading headers() -- that dynamic
// API would force every static page under this layout (home, about, services,
// contact, etc.) into server-rendering on every request instead of being
// served from the CDN.
export default function GeneralViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
