'use client';

import { useState, useEffect, useRef } from 'react';
import { createInitialDiscussionThread } from '@/lib/api';
import tagsData from '@/components/tags.json';

export default function CreateProjectModal({ isOpen, onClose }) {
    const [projectTitle, setProjectTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
    const [mentorName, setMentorName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const tagsDropdownRef = useRef(null);

    useEffect(() => {
        // Set available tags from the imported JSON
        setAvailableTags(tagsData.tags);
    }, []);

    useEffect(() => {
        // Handle click outside to close tags dropdown
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsDropdownOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tagsDropdownRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Get the ADMIN_INFO from parent page
        const ADMIN_INFO = {
            name: 'Shashwat Kumar Singh',
            role: 'PROFESSOR',
            email: 'jyotishikha2007@gmail.com',
            id: '67d43bbaa0d1c77b0fb4aed6'
        };

        try {
            // Prepare project data for the API
            const projectData = {
                project_name: projectTitle,
                description: description,
                is_approved: "approved", // Setting approval status to approved by default for professors
                is_completed: false,
                project_owner: {
                    _id: ADMIN_INFO.id,
                    name: ADMIN_INFO.name,
                    email: ADMIN_INFO.email,
                    user_type: 'professor' // Changed from role to user_type to match backend
                },
                cap: 8, // Default cap value
                start_date: startDate + "T00:00:00.000+00:00",
                end_date: endDate + "T00:00:00.000+00:00",
                tags: selectedTags, // Using selected tags array
                discussion_threads: [],
                students_enrolled: []
            };

            // Send POST request to the API using fetch instead of axios
            const response = await fetch('http://localhost:3001/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error(`Failed to create project: ${response.statusText}`);
            }

            const createdProject = await response.json();
            console.log('Project created successfully:', createdProject);

            // Create initial discussion thread for the project
            try {
                const projectId = createdProject._id;
                
                // Use the utility function to create the discussion thread
                await createInitialDiscussionThread(
                    projectId,
                    projectTitle,
                    ADMIN_INFO.id,
                    ADMIN_INFO.name
                );
            } catch (threadError) {
                console.error("Error creating initial discussion thread:", threadError);
                // Continue even if thread creation fails
            }

            // Clear form and close modal on success
            clearForm();
            onClose();
        } catch (err) {
            console.error('Error creating project:', err);
            setError('Failed to create project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setProjectTitle('');
        setDescription('');
        setSelectedTags([]);
        setMentorName('');
        setImageUrl('');
        setStartDate('');
        setEndDate('');
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags(prev => [...prev, tag]);
        }
        setSearchTerm("");
        setIsTagsDropdownOpen(false);
    };

    const handleRemoveTag = (tag) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    const filteredTags = availableTags
        .filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(tag => !selectedTags.includes(tag));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                    aria-label="Close modal"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Project</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="projectTitle" className="block text-gray-700 text-sm font-medium mb-2">
                            Project Title
                        </label>
                        <input
                            id="projectTitle"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="tags" className="block text-gray-700 text-sm font-medium mb-2">
                            Domain/Tags
                        </label>
                        <div className="relative" ref={tagsDropdownRef}>
                            <input
                                id="tags"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsTagsDropdownOpen(true);
                                }}
                                onFocus={() => setIsTagsDropdownOpen(true)}
                                placeholder="Search for technologies..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            
                            {isTagsDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                                    {filteredTags.length > 0 ? (
                                        filteredTags.slice(0, 10).map((tag, index) => (
                                            <div 
                                                key={index} 
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                onClick={() => handleTagSelect(tag)}
                                            >
                                                {tag}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-sm text-gray-500">
                                            {searchTerm ? "No matching technologies found" : "Start typing to search technologies"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTags.map((tag, index) => (
                                    <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                                        {tag}
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)} 
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                            disabled={isLoading}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-2">
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium mb-2">
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="mentorName" className="block text-gray-700 text-sm font-medium mb-2">
                            Mentor Name
                        </label>
                        <input
                            id="mentorName"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mentorName}
                            onChange={(e) => setMentorName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-medium mb-2">
                            Image URL (optional)
                        </label>
                        <input
                            id="imageUrl"
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}