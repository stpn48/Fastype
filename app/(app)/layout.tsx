import { PropsWithChildren } from "react";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex-1">
      <Navbar />
      <main className="flex-1 overflow-auto">
        {children}
        <Footer />
      </main>
    </div>
  );
}
