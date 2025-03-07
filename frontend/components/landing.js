import React from 'react';

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

    return (
        <div className="min-h-screen bg-[#0D1231] flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: 'url(/collabfeature.png)' }}>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center relative">
                Why CollabNest?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 w-full max-w-5xl relative">
                {features.map((feature, index) => (
                    <div key={index} className={`bg-[#151C3B] rounded-2xl p-4 md:p-6 flex flex-col items-center text-center border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${feature.gridPosition}`}>
                        <div className="mb-3 md:mb-4 text-blue-400">{feature.icon}</div>
                        <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h2>
                        <p className="text-sm md:text-base text-gray-400">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};



const CollabNestLandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: 'url(/landend.png)'
        }}>
            <div className="bg-black bg-opacity-50 min-h-screen flex flex-col">
                <div className="text-center flex-grow flex flex-col justify-center items-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-white">
                        Ready to turn your learning into real-world projects?
                    </h1>
                    <button className="mt-6 px-6 py-3 text-lg font-semibold rounded-full bg-white text-black relative transition-all duration-300 hover:scale-105 shadow-lg">
                        Get Started
                        <span className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-0.3 blur-md"></span>
                    </button>
                </div>

                <footer className="bg-white w-full p-6 md:p-10 rounded-t-2xl shadow-lg flex justify-center items-center h-auto md:h-60">
                    <div className="flex items-center justify-between w-full max-w-screen-xl px-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">COLLABNEST</h2>
                            <p className="text-gray-600">Pegasus</p>
                            <div className="flex gap-4 mt-4">
                                <img src="/iitp.png" alt="Logo 1" className="w-12 h-12" />
                                <img src="/stc.png" alt="Logo 2" className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="text-left mx-12">
                            <h2 className="font-bold mb-3 text-lg">Important Links</h2>
                            <ul className="text-gray-600 space-y-2">
                                <li>Gymkhana</li>
                                <li>STC</li>
                                <li>NJACK</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                                Login
                            </button>
                            <button className="border border-black px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const CollabNestApp = () => {
    return (
        <div>

            <CollabNestFeatures />
            <div className="h-16 md:h-24 bg-white"></div>
            <CollabNestLandingPage />
        </div>
    );
};

export default CollabNestApp;