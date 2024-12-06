import { PropsWithChildren } from "react";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="mt-[48px] flex-1 flex flex-col">
        <div className="p-4 flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
