import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="bg-background h-full w-full min-h-[75vh] flex flex-col items-center justify-center">
      <section className="grid gap-10 w-full max-w-4xl">
        {/* Top Section */}
        <section className="h-48 p-6 flex flex-col justify-between gap-4 border border-border rounded-lg">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Find Race</h1>
            <p className="text-muted-foreground">Race against other players</p>
          </div>
          <Button className="w-full h-10 text-base">Find Race</Button>
        </section>

        {/* Bottom Section */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2">
          <section className="h-48 rounded-lg p-6 border flex flex-col justify-between border-border">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Practice</h1>
              <p className="text-muted-foreground">Practice in peace by yourself</p>
            </div>
            <Button className="w-full h-10 text-base">Practice</Button>
          </section>

          <section className="h-48 p-6 border rounded-lg flex flex-col justify-between border-border">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Race Against Friends</h1>
              <p className="text-muted-foreground">Play against your friends</p>
            </div>
            <Button className="w-full h-10 text-base">Create Lobby</Button>
          </section>
        </div>
      </section>
    </div>
  );
}
