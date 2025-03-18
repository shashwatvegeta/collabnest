import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-[100px] bg-[#1F1D38] flex flex-col items-center pt-10 pb-4">
      <div className="p-4 mb-8">
        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#18172E] flex items-center justify-center">
            <div className="w-6 h-6 bg-[#49E9C1] rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-6 flex-grow">
        <Link href="/admin" className="p-3 bg-[#18172E] rounded-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2"/>
          </svg>
        </Link>
        <Link href="/admin/notifications" className="p-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#8A8A8A"/>
          </svg>
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">2</span>
        </Link>
        <Link href="/admin/messages" className="p-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#8A8A8A"/>
          </svg>
        </Link>
        <Link href="/admin/profile" className="p-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#8A8A8A"/>
          </svg>
        </Link>
      </div>
      
      <div className="mt-auto">
        <Link href="/logout" className="p-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#FF5C5C"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}