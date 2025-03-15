import React from 'react';
import { motion } from 'framer-motion';

const CollabNestFeatures = () => {
    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.3-4.3a2 2 0 00-2.83-2.83L12 7V9l-4 4-4 2v2l2-1 4-4 4-1v2l5.15 5.15a2 2 0 002.83 0 2 2 0 000-2.83L15 10z" />
                </svg>
            ),
            title: 'Gamified Learning',
            description: 'Earn XP, badges & level up as you progress',
            gridPosition: "md:col-start-2 md:col-span-3"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            title: 'Structured Mentorship',
            description: 'Guidance from senior students and professors',
            gridPosition: "md:col-start-5 md:col-span-3"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.121 2.121L8.05 8.05M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                </svg>
            ),
            title: 'Project Recommendation',
            description: 'AI-powered suggestions based on your skills',
            gridPosition: "md:col-start-8 md:col-span-3"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: 'Real Time Collaboration',
            description: 'Chat, video calls & notifications',
            gridPosition: "md:col-start-3 md:col-span-3"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            title: 'Portfolio And Certification',
            description: 'Showcase your work, get auto-generated certificates',
            gridPosition: "md:col-start-7 md:col-span-3"
        }
    ];

    // Animation variants
    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const iconVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.1,
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="min-h-screen bg-[#0D1231] flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{ backgroundImage: 'url(/collabfeature.png)' }}
        >
            <motion.h1
                variants={titleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center relative"
            >
                Why CollabNest?
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 w-full max-w-5xl relative"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#1a2452"
                        }}
                        className={`bg-[#151C3B] rounded-2xl p-4 md:p-6 flex flex-col items-center text-center border border-white/10 transform transition-all duration-300 ${feature.gridPosition}`}
                    >
                        <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            className="mb-3 md:mb-4 text-blue-400"
                        >
                            {feature.icon}
                        </motion.div>
                        <motion.h2
                            className="text-lg md:text-xl font-semibold text-white mb-2"
                        >
                            {feature.title}
                        </motion.h2>
                        <motion.p
                            className="text-sm md:text-base text-gray-400"
                        >
                            {feature.description}
                        </motion.p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};
const CollabNestLandingPage = () => {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.4,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 0 15px 5px rgba(168, 85, 247, 0.4)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const footerItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: 'url(/landend.png)'
        }}>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-black bg-opacity-50 min-h-screen flex flex-col"
            >
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center flex-grow flex flex-col justify-center items-center px-4 max-w-4xl mx-auto"
                >
                    <motion.h1
                        className="text-2xl md:text-5xl font-semibold mb-6 text-white leading-tight py-2"
                    >
                        Ready to turn your learning into real-world projects?
                    </motion.h1>

                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        className="mt-6 px-8 py-3 text-lg font-semibold rounded-full bg-white text-black relative transition-all duration-300"
                    >
                        Get Started
                        <motion.span
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 0.2, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-30 blur-md"
                        ></motion.span>
                    </motion.button>
                </motion.div>

                <motion.footer
                    variants={footerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-white w-full p-6 md:p-10 rounded-t-2xl shadow-lg flex justify-center items-center h-auto"
                >
                    {/* Improved mobile layout with better spacing */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full max-w-screen-xl">
                        <motion.div
                            variants={footerItemVariants}
                            className="flex flex-col items-center sm:items-start mb-10 sm:mb-0 w-full sm:w-auto"
                        >
                            <h2 className="text-2xl font-bold mb-1">COLLABNEST</h2>
                            <p className="text-gray-600 mb-4">Pegasus</p>
                            <div className="flex gap-4 mt-2">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src="/iitp.png"
                                    alt="Logo 1"
                                    className="w-12 h-12"
                                />
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src="/stc.png"
                                    alt="Logo 2"
                                    className="w-12 h-12"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={footerItemVariants}
                            className="text-center sm:text-left mb-10 sm:mb-0 sm:mx-4 md:mx-12 w-full sm:w-auto"
                        >
                            <h2 className="font-bold mb-4 text-lg">Important Links</h2>
                            <ul className="text-gray-600 space-y-3">
                                <motion.li whileHover={{ x: 5, color: "#4F46E5" }} className="cursor-pointer">Gymkhana</motion.li>
                                <motion.li whileHover={{ x: 5, color: "#4F46E5" }} className="cursor-pointer">STC</motion.li>
                                <motion.li whileHover={{ x: 5, color: "#4F46E5" }} className="cursor-pointer">NJACK</motion.li>
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={footerItemVariants}
                            className="flex flex-col gap-4 w-full sm:w-auto"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto text-center"
                            >
                                Login
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border border-black px-8 py-3 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto text-center"
                            >
                                Contact Us
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.footer>
            </motion.div>
        </div>
    );
};

const CollabNestApp = () => {
    return (
        <div>

            <CollabNestFeatures />
            <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "top" }}
                className="h-16 md:h-24 bg-white"
            />
            <CollabNestLandingPage />
        </div>
    );
};

export default CollabNestApp;