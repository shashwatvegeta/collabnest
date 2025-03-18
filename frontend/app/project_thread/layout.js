import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gradient-to-r from-[#171727] via-[#1f1e37] to-[#19182a] flex">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
