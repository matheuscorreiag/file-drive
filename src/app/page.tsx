import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 w-full h-screen">
      <h1 className="text-4xl font-bold text-white">Welcome to FileDrive</h1>
      <SignInButton>
        <button className="bg-zinc-500 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded mt-4">
          Sign In
        </button>
      </SignInButton>
    </div>
  );
}
