'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateProjectModal({ isOpen, onClose }) {
    const [projectTitle, setProjectTitle] = useState('');
    const [description, setDescription] = useState('');
    const [domain, setDomain] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const ADMIN_INFO = {
            id: '67d43bbaa0d1c77b0fb4aed6'
        };

        try {
            // Prepare project data for the API
            const projectData = {
                project_name: projectTitle,
                description: description,
                is_approved: "approved", // Setting default approval status
                is_completed: false,
                project_owner: ADMIN_INFO.id,
                cap: 8, // Default cap value
                start_date: startDate + "T00:00:00.000+00:00",
                end_date: endDate + "T00:00:00.000+00:00",
                tags: [domain], // Using domain as a tag
                discussion_threads: [],
                students_enrolled: []
            };

            // Send POST request to the API
            const response = await axios.post('http://localhost:3001/project', projectData);

            console.log('Project created successfully:', response.data);

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
        setDomain('');
        setMentorName('');
        setImageUrl('');
        setStartDate('');
        setEndDate('');
    };

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

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="domain" className="block text-gray-700 text-sm font-medium mb-2">
                                Domain
                            </label>
                            <div className="relative">
                                <select
                                    id="domain"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="" disabled>Select Domain</option>
                                    <option value="ai">AI</option>
                                    <option value="web">Web Development</option>
                                    <option value="mobile">Mobile Development</option>
                                    <option value="data">Data Science</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
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