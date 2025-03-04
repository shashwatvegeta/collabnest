import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-3 bg-black text-white w-4/5 m-auto rounded-full ">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Collabnest Logo" width={50} height={50} />
        <span className="ml-2 font-bold">Collabnest</span>
      </div>
      <div className="space-x-6">
        <Link href="#">Product</Link>
        <Link href="#">Solution</Link>
        <Link href="#">Pricing</Link>
        <Link href="#">About Us</Link>
        <Link href="#">Blogs</Link>
        <Link href="#">Cart (0)</Link>
      </div>
      <button className="px-4 py-2 bg-white text-black rounded-full">Login</button>
    </nav>
  );
};

export default Navbar;