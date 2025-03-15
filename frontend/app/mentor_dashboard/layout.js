import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gradient-to-r from-[#171727] via-[#1f1e37] to-[#19182a] flex">
                <Sidebar />
                <div>{children}</div>
            </body>
        </html>
    );
}
