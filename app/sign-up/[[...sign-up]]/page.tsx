import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-fit h-fit shadow-md">
        <SignUp />
      </div>
    </div>
  );
}

// TODO: Create the user in the db with the stats after sign up in clerk
