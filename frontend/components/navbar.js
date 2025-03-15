"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { instance, accounts } = useMsal();
  const initializeSignIn = () => {
    instance.loginRedirect();
  };
  const logout = () => {
    instance.logoutRedirect();
  };
  const isAuthenticated = useIsAuthenticated();
  return (
    <nav className="flex justify-between items-center p-3 bg-black text-white w-full lg:w-3/5 m-auto rounded-full mt-4">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Collabnest Logo" width={50} height={50} />
        <span className="ml-2 font-bold">Collabnest</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="/projects">Explore Projects</Link>
        <Link href="/mentors">Mentorship</Link>
        <Link href="/about">About Us</Link>
      </div>

      {/* Login Button for Desktop */}
      {!isAuthenticated && (
        <button
          className="hidden lg:block px-4 py-2 bg-white text-black rounded-full"
          onClick={initializeSignIn}
        >
          Login
        </button>
      )}
      {isAuthenticated && (
        <button
          className="hidden lg:block px-4 py-2 bg-white text-black rounded-full"
          onClick={logout}
        >
          <LogOut></LogOut>
        </button>
      )}

      {/* Mobile Menu Toggle */}
      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 lg:hidden">
          <Link href="#" onClick={() => setMenuOpen(false)}>
            Product
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>
            Solution
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>
            Cart (0)
          </Link>
          {!isAuthenticated && (
            <button
              className="px-4 py-2 bg-white text-black rounded-full"
              onClick={initializeSignIn}
            >
              Login
            </button>
          )}
          {isAuthenticated && (
            <button
              className="px-4 py-2 bg-white text-black rounded-full"
              onClick={logout}
            >
              <LogOut></LogOut>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
