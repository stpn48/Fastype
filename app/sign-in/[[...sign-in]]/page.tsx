import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-fit h-fit shadow-md">
        <SignIn />
      </div>
    </div>
  );
}
