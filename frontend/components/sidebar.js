"use client";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Medal,
  MessageCircle,
  Search,
  SquareChartGantt,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMsal } from "@azure/msal-react";
import { redirect } from "next/dist/server/api-utils";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { instance, accounts } = useMsal();
  const pathname = usePathname();
  const logout = () => {
    instance.logoutRedirect();
  };
  return (
    <div className="h-screen p-6 grid grid-cols-1 place-items-center">
      <div className="flex flex-col justify-center items-center relative transition-all duration-[450ms] ease-in-out ">
        <article className="border-4 border-solid border-gray-500 w-full ease-in-out duration-500 left-0 rounded-2xl inline-block shadow-lg shadow-black/15 bg-[#2a2a38] p-8 text-white grid xl:gap-16 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="Collabnest Logo"
              width={30}
              height={50}
            />
          </div>
          <div className="row-span-2"></div>
          <Link href="/student_dashboard">
            <LayoutDashboard
              className={`${pathname == "/student_dashboard" ? "text-teal-400" : ""}`}
              size={25}
            />
          </Link>
          <Link href="/student_dashboard/badges">
            <Medal
              className={`${pathname == "/student_dashboard/badges" ? "text-teal-400" : ""}`}
              size={25}
            />
          </Link>
          <Link href="/student_dashboard/notifications">
            <Bell
              className={`${pathname == "/student_dashboard/notifications" ? "text-teal-400" : ""}`}
              size={25}
            />
          </Link>
          <Link href="/student_dashboard/ongoing_projects">
            <SquareChartGantt
              className={`${pathname == "/student_dashboard/ongoing_projects" ? "text-teal-400" : ""}`}
              size={25}
            />
          </Link>
          <Link href="/student_dashboard/find_projects">
            <Search
              className={`${pathname == "/student_dashboard/find_projects" ? "text-teal-400" : ""}`}
              size={25}
            />
          </Link>
          <div className="row-span-2"></div>
          <button
            onClick={() => {
              logout();
            }}
          >
            <LogOut size={25} />
          </button>
        </article>
      </div>
    </div>
  );
};
export default Sidebar;
