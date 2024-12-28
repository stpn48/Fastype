import { OAuthButton } from "./_components/oauth-button";

export default function SignInPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <section className="flex h-fit w-[500px] flex-col items-center justify-center gap-8 rounded-lg border border-border p-10 shadow-lg">
        <h1 className="w-full text-center text-3xl font-semibold">
          Continue to{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            FastType
          </span>
        </h1>

        <div className="flex w-full flex-col gap-2">
          <OAuthButton provider="google" />
          <OAuthButton provider="github" />
        </div>
      </section>
    </div>
  );
}
