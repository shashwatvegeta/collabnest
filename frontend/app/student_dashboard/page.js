"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";

const sdashboard = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        setUser({
            name: "John Doe",
            type: "Student",
            email: "johndoe@example.com",
            tel: "987654321",
            pfp_src: "/user_placeholder.png",
            level: 5,
            level_progression: 0.72,
        });
    }, []);
    return (
        <div className="p-8 my-16 ">
            <div className="text-2xl text-purple-500 p-4 font-semibold">
                Dashboard
            </div>
            <div className="text-2xl text-white font-bold p-4">
                Welcome Back, {user.name}!
            </div>
            <div
                className="grid grid-rows-5 grid-cols-2 gap-8"
                style={{ width: "85vw" }}
            >
                <div className="flex col-span-2">
                    {user.pfp_src ? (
                        <Image
                            className="mx-8 object-contain"
                            src={user.pfp_src}
                            alt="User Profile"
                            width={75}
                            height={75}
                        />
                    ) : (
                        <Image
                            className="mx-8 object-contain"
                            src="/logo.png"
                            alt="User Profile"
                            width={75}
                            height={75}
                        />
                    )}
                    <div className="grid gap-4">
                        <div className="font-semibold text-xl text-white">
                            {user.name} ·{" "}
                            <p className="inline uppercase text-teal-400">{user.type}</p>
                        </div>
                        <div className="text-sm text-purple-200">
                            {user.email} - {user.tel}
                        </div>
                    </div>
                </div>
                <div className="row-span-4 col-span-1 ">
                    <div className="border-2 p-4 rounded-lg border-violet-300 text-white bg-[#2a2a38]">
                        <div className="text-2xl font-semibold">Your Progress</div>
                        <div className="text-xs text-violet-300 py-2">
                            Track your Achievements and Level
                        </div>
                        <div>
                            <div className="flex py-2 gap-4">
                                <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl p-2 bg-indigo-500">
                                    {user.level}
                                </div>
                                <div className="font-bold text-lg flex-1">
                                    Level {user.level}
                                </div>
                                <div className="text-xs translate-y-[8px]">
                                    {user.level_progression * 100}%
                                </div>
                            </div>
                            <div>
                                <span
                                    role="progressbar"
                                    aria-labelledby="ProgressLabel"
                                    aria-valuenow="75"
                                    className="relative block rounded-full bg-gray-400"
                                >
                                    <span
                                        className="block h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-center"
                                        style={{ width: user.level_progression * 100 + "%" }}
                                    ></span>
                                </span>
                            </div>
                        </div>

                        <div className="text-lg font-semibold py-2">Badges Earned</div>
                        <div className="justify-around">
                            <div className="bg-violet-400 p-4 rounded-lg content-center text-center w-24">
                                <Trophy />
                                <div className="font-semibold text-xs">First badge</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38]">
                    <div className="text-2xl font-semibold bg-violet-400 p-4">
                        Recommended Projects
                    </div>
                    <div className="p-4">hi</div>
                </div>
            </div>
        </div>
    );
};

export default sdashboard;
