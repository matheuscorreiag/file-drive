"use client";

import { UploadButton } from "@/app/dashboard/components/UploadButton";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { FileCard } from "@/app/dashboard/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/app/dashboard/components/SearchBar";
import { useState } from "react";

function Placeholder() {
  return (
    <div className="flex flex-col gap-4 w-full items-center mt-12">
      <Image
        alt="A image of a picture and a directory of files"
        width={300}
        height={300}
        src="/empty.svg"
      />
      <div className="text-2xl"> You have no files, upload one now!</div>
      <UploadButton />
    </div>
  );
}
export default function Dashboard() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFile, orgId ? { orgId, query } : "skip");
  const isLoading = files === undefined;

  return (
    <div className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-700" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => <FileCard key={file._id} file={file} />)}
          </div>
        </>
      )}
    </div>
  );
}
