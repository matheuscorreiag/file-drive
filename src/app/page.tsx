import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard/files");
  }
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Take control of your data
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Make sure to have your data safe and secure. {`We're`} here to
              help
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignInButton>
                <Link
                  href="/dashboard/files"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
