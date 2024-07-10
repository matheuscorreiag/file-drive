"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFile, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  async function handleClick() {
    if (!orgId) {
      return;
    }

    await createFile({
      name: "test",
      orgId: orgId,
    });
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleClick}>Create File</button>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </div>
  );
}
