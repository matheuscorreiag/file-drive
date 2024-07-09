import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = getKindeServerSession();
  const isUserAuthenticated = await session.isAuthenticated();

  if (!isUserAuthenticated) {
    return redirect("/api/auth/login");
  }

  return <div>Dashboard</div>;
}
