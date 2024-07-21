import { SideNav } from "@/components/custom/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto pt-12">
      <div className="flex flex-col md:flex-row gap-8">
        <SideNav />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
