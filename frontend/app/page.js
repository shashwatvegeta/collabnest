import Image from 'next/image';
import Navbar from '@/components/navbar';
export default function Home() {
  return (
    <div className="relative h-screen bg-cover bg-center p-4" style={{ backgroundImage: 'url(/landingpage_bg.png)',  }}>
      <Navbar />
      <div className="text-center text-white mt-16">
        <h1 className="text-6xl font-bold">COLLABNEST</h1>
        <p className="mt-4 text-lg">Bridge the Gap Between Learning & Implementation</p>
        <div className="mt-6 space-x-4">
          <button className="px-6 py-3 border border-white rounded-full">Join As Student</button>
          <button className="px-6 py-3 border border-white rounded-full">Join As Mentor</button>
        </div>
        <div className="flex justify-center mt-16">
          <Image src="/laptop_image.png" alt="Featured Image" width={545} height={400} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

