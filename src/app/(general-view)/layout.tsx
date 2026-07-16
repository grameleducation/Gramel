import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
