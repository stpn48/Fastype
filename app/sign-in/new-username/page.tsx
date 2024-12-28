import UsernameForm from "./_components/username-form";

export default function NewUsernamePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <section className="flex h-fit w-[500px] flex-col items-center justify-center gap-4 rounded-lg border border-border p-10 shadow-lg">
        <h1 className="w-full text-center text-3xl font-semibold">Choose a username</h1>

        <UsernameForm />
      </section>
    </div>
  );
}
