'use client';

import { useState, useEffect } from 'react';
import ProfessorLayout from '../components/ProfessorLayout';
import Image from 'next/image';
import CreateProjectModal from '../components/CreateProjectModal';
import axios from 'axios';

const ADMIN_INFO = {
    name: 'Shashwat Kumar Singh',
    role: 'PROFESSOR',
    email: 'jyotishikha2007@gmail.com',
    id: '67d43bbaa0d1c77b0fb4aed6'
};

interface Project {
    _id: string;
    project_name: string;
    description: string;
    is_approved: boolean;
    is_completed: boolean;
    project_owner: any;
    cap: number;
    start_date: string;
    end_date: string;
    tags: any[];
}

export default function ProjectsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/project');
            console.log('All projects:', response.data);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    // Filter projects where the owner ID matches ADMIN_INFO.id
    const ongoingProjects = projects.filter((project) => {
        console.log(`Comparing: ${project.project_owner} with ${ADMIN_INFO.id}`);
        return project.project_owner === ADMIN_INFO.id;
    });

    console.log('Filtered projects:', ongoingProjects);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Refresh projects after closing the modal
        fetchProjects();
    };

    return (
        <ProfessorLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Projects</h1>
                        <p className="text-gray-400 mt-1">Browse And Find Projects Relevant For You</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-sm">?</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search For Projects"
                            className="w-full bg-[#1c2235] rounded-md py-2 px-4 pl-10 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            className="absolute left-3 top-3 text-gray-400"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <button className="absolute right-3 top-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        </button>
                    </div>
                    <button
                        className="bg-[#7c68ee] text-white rounded-md py-2 px-4 flex items-center gap-2 ml-4"
                        onClick={openModal}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create New
                    </button>
                </div>

                {/* The key change: Using ongoingProjects instead of projects */}
                {projects.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        <p>Loading projects...</p>
                    </div>
                ) : ongoingProjects.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        <p>No projects found for your account. Create a new project to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ongoingProjects.map((project) => (
                            <div key={project._id} className="bg-[#1c2235] rounded-lg overflow-hidden">
                                <div className="relative h-36">
                                    <Image
                                        src="/project-placeholder.png"
                                        alt={project.project_name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="opacity-50"
                                    />
                                    <div className="absolute top-0 right-0 bg-[#151929] bg-opacity-50 px-2 py-1 m-2 rounded">
                                        <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-white text-lg font-bold">{project.project_name}</h3>
                                                <p className="text-white text-sm">Assistant</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                    <div className="w-full bg-[#151929] rounded-full h-1.5 mb-4">
                                        <div className="bg-[#7c68ee] h-1.5 rounded-full" style={{ width: `75%` }}></div>
                                    </div>
                                    <button className="w-full bg-[#7c68ee33] text-[#7c68ee] rounded-md py-2 hover:bg-[#7c68ee] hover:text-white transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                <CreateProjectModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
        </ProfessorLayout>
    );
}