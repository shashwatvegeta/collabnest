"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-3 bg-black text-white w-full lg:w-3/5 m-auto rounded-full">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Collabnest Logo" width={50} height={50} />
        <span className="ml-2 font-bold">Collabnest</span>
      </div>

      
      <div className="hidden lg:flex space-x-6">
        <Link href="#">Product</Link>
        <Link href="#">Solution</Link>
        <Link href="#">Pricing</Link>
        <Link href="#">About Us</Link>
        <Link href="#">Blogs</Link>
        <Link href="#">Cart (0)</Link>
      </div>

      
      <button className="hidden lg:block px-4 py-2 bg-white text-black rounded-full">Login</button>

      
      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 lg:hidden">
          <Link href="#" onClick={() => setMenuOpen(false)}>Product</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Solution</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Blogs</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Cart (0)</Link>
          <a href="/signup" className="px-4 py-2 bg-white text-black rounded-full">Login</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
