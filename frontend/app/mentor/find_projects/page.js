"use client";
import { ProjectDisplayCard } from "@/components/ui/project_display_card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from "lucide-react";

const find_projects = () => {
    const [recommendedProjects, setRecommendedProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setRecommendedProjects([
            {
                name: "Web Development Portfolio",
                desc: "Create a personal portfolio showcasing your projects",
                level: "Intermediate",
                logo: "PanelTop",
                tags: ["Development"],
            },
            {
                name: "API Integration Project",
                desc: "Build an Application that integrates external APIs",
                level: "Advanced",
                logo: "PanelTop",
            },
            {
                name: "API Integration Project",
                desc: "Build an Application that integrates external APIs",
                level: "Advanced",
                logo: "PanelTop",
            },
        ]);
    }, []);

    const handleCreateProject = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 my-4 min-h-screen bg-[#1a1a24]">
            <div className="flex justify-between items-center mb-4">
                <div className="text-4xl text-violet-400 p-4 font-semibold">Projects</div>
                <div className="bg-gray-300 rounded-full h-10 w-10"></div>
            </div>
            <div className="text-2xl text-white p-4">
                Browse and Find Projects Relevant For You
            </div>
            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-4 flex justify-between items-center">
                    <input
                        placeholder="Search for Projects"
                        className="bg-[#2a2a38] border-violet-300 text-white rounded-full outline-none p-4 focus:border"
                        style={{ width: "40vw" }}
                    />
                    <Button
                        className="bg-violet-600 hover:bg-violet-700 rounded-full flex items-center gap-2 px-4 py-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <CirclePlus size={18} />
                        Create New
                    </Button>
                </div>
                {
                    recommendedProjects.map((p, index) => <ProjectDisplayCard {...p} key={index} />)
                }
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create New Project</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="mt-4">
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Project Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Domain</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select Domain</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Available Spots</label>
                                    <input
                                        type="number"
                                        defaultValue={1}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Mentor Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium">Image URL (optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default find_projects;