"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
  const user = useQuery(api.user.getActualUser);

  console.log("user: ", user);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>User: {user?.name}</p>
    </div>
  );
}
