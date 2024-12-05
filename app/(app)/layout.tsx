import { PropsWithChildren } from "react";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grid grid-cols-[auto, 1fr] flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
