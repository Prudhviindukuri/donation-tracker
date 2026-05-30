import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }

  return <AdminDashboardClient />;
}
