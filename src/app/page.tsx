import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 w-full h-screen">
      Home
    </div>
  );
}
