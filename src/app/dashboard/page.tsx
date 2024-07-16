"use client";

import { UploadButton } from "@/app/dashboard/components/UploadButton";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFile, orgId ? { orgId } : "skip");

  return (
    <div className="container mx-auto pt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadButton />
      </div>

      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </div>
  );
}
