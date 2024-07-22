"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="font-bold text-xl">Not Found</h2>
      <p>
        Could not find requested resource, redirecting automatically in 5
        seconds
      </p>
      <Button className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
