"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFile);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => createFile({ name: "test2" })}>Create File</button>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </div>
  );
}
