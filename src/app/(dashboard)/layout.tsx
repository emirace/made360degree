import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <div className="hidden md:flex md:w-auto md:flex-col md:fixed md:inset-y-0 z-80 bg-zinc-900">
        <Sidebar />
      </div>
      <main className="md:pl-64 flex-1 h-full overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
