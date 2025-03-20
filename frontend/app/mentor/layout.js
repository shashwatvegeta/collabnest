import Sidebar from "@/components/mentor_sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="bg-gradient-to-r from-[#171727] via-[#1f1e37] to-[#19182a] min-h-screen">
            <Sidebar />
            <div className="relative ml-64">{children}</div>
        </div>
    );
}

