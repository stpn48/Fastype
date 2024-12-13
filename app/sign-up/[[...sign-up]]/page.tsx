import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-fit w-fit shadow-md">
        <SignUp />
      </div>
    </div>
  );
}
