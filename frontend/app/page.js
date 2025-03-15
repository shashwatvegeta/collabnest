"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import HowItWorks from '@/components/HowItWorks';
import CollabNestApp from '@/components/landing';

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      border: "2px solid white",
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.8
      }
    }
  };

  return (
    <div>
      <motion.div
        className="relative h-screen bg-cover bg-center p-4 flex flex-col items-center"
        style={{ backgroundImage: 'url(/landingpage_bg.png)' }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Navbar />

        <div className="text-center text-white mt-16 px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-bold"
            variants={titleVariants}
          >
            COLLABNEST
          </motion.h1>

          <motion.p
            className="mt-4 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Bridge the Gap Between Learning & Implementation
          </motion.p>

          <motion.div
            className="mt-6 space-x-4"
          >
            <motion.button
              className="px-6 py-3 border border-white rounded-full"
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              Join As Student
            </motion.button>

            <motion.button
              className="px-6 py-3 border border-white rounded-full"
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.7 }}
            >
              Join As Mentor
            </motion.button>
          </motion.div>

          <motion.div
            className="flex justify-center mt-16"
            variants={imageVariants}
          >
            <motion.div
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/laptop_image.png"
                alt="Featured Image"
                width={500}
                height={500}
                className="rounded-lg w-full max-w-md md:max-w-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-20 flex justify-center">
        <HowItWorks />
      </div>

      <div className="mt-20">
        <CollabNestApp />
      </div>
    </div>
  );
}