"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 w-full h-screen">
      <Button className="w-48" onClick={() => router.push("/dashboard")}>
        Go to dashboard
      </Button>
    </div>
  );
}
