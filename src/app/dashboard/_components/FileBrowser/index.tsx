"use client";

import { UploadButton } from "@/app/dashboard/files/components/UploadButton";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { FileCard } from "@/app/dashboard/files/components/FileCard";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/app/dashboard/files/components/SearchBar";
import { useState } from "react";
import { Placeholder } from "@/app/dashboard/_components/Placeholder";

export function FileBrowser({
  title,
  favorites,
}: {
  title: string;
  favorites?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFile,
    orgId ? { orgId, query, favorites } : "skip",
  );

  const allFavorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip",
  );

  const isLoading = files === undefined;

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-700" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl whitespace-nowrap md:text-4xl font-bold">
              {title}
            </h1>
            <div className="hidden md:block mx-4">
              <SearchBar setQuery={setQuery} />
            </div>

            <UploadButton />
          </div>
          <div className="block md:hidden mb-8 w-full">
            <SearchBar setQuery={setQuery} />
          </div>

          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files?.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                favorites={allFavorites ?? []}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
