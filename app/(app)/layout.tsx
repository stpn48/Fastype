import { PropsWithChildren } from "react";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="mt-[56px] flex flex-1 flex-col">
        <div className="flex-1 p-10">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
