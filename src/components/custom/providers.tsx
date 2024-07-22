"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function Providers({ children }: Props) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInFallbackRedirectUrl={"/dashboard/files"}
      signInForceRedirectUrl={"/dashboard/files"}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
