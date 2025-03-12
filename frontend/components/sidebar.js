import {
  Bell,
  LayoutDashboard,
  LogOut,
  Medal,
  MessageCircle,
  User,
} from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="h-screen p-6 grid grid-cols-1 place-items-center">
      <div className="flex flex-col justify-center items-center relative transition-all duration-[450ms] ease-in-out ">
        <article className="border-4 border-solid border-gray-500 w-full ease-in-out duration-500 left-0 rounded-2xl inline-block shadow-lg shadow-black/15 bg-[#2a2a38] p-8 text-white grid xl:gap-16 gap-8">
          <div>
            {/* <Image */}
            {/*   src="/logo.png" */}
            {/*   alt="Collabnest Logo" */}
            {/*   width={30} */}
            {/*   height={50} */}
            {/* /> */}
          </div>
          <div className="row-span-2"></div>
          <LayoutDashboard size={25} />
          <Medal size={25} />
          <Bell size={25} />
          <MessageCircle size={25} />
          <User size={25} />
          <div className="row-span-2"></div>
          <LogOut size={25} />
        </article>
      </div>
    </div>
  );
};
export default Sidebar;
