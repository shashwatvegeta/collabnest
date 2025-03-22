"use client";
import { useEffect, useState, useRef } from "react";
import { ProjectCard } from "@/components/ui/project_card";
import { getEmail } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import tagsData from "@/components/tags.json";
import { createInitialDiscussionThread } from "@/lib/api";

export default function MentorProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const tagsDropdownRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    cap: 1,
    start_date: "",
    end_date: "",
    tags: []
  });

  useEffect(() => {
    setEmail(getEmail());
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

  useEffect(() => {
    if (email) {
      fetchProjects();
      
      // Set up polling to refresh projects data every 30 seconds
      const intervalId = setInterval(() => {
        fetchProjects(false); // Pass false to not show loading state during refresh
      }, 30000);
      
      return () => clearInterval(intervalId); // Clean up interval on component unmount
    }
  }, [email]);

  const fetchProjects = async (showLoading = true) => {
    if (!email) return;
    
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch("http://localhost:3001/project", {
        // Add cache: 'no-store' to prevent caching
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      
      const allProjects = await response.json();
      
      console.log("All projects:", allProjects);
      
      // Filter projects where the current mentor is the project_owner
      const mentorProjects = allProjects.filter(project => 
        project.project_owner === email || project.mentor_email === email
      );
      
      console.log("Mentor projects:", mentorProjects);
      
      setProjects(mentorProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      // Add a small delay to simulate loading and then trigger animations
      setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, showLoading ? 300 : 0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFormData(prev => ({ ...prev, tags: newSelectedTags }));
    }
    setSearchTerm("");
    setIsTagsDropdownOpen(false);
  };

  const handleRemoveTag = (tag) => {
    const newSelectedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, tags: newSelectedTags }));
  };

  const filteredTags = tagsData.tags
    .filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(tag => !selectedTags.includes(tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create the project data
      const projectData = {
        ...formData,
        is_approved: "pending", // Automatically set to pending
        project_owner: email,
      };

      // Send to backend
      const response = await fetch("http://localhost:3001/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create project");
      }

      // Get the newly created project data
      const createdProject = await response.json();
      console.log("Project created successfully:", createdProject);
      
      // Create initial discussion thread for the project
      try {
        const projectId = createdProject._id;
        // Get mentor display name (or use email as fallback)
        const mentorName = email.split('@')[0] || "Mentor";
        
        // Use the utility function to create the discussion thread
        await createInitialDiscussionThread(
          projectId, 
          formData.project_name, 
          email, 
          mentorName
        );
      } catch (threadError) {
        console.error("Error creating initial thread:", threadError);
        // Continue with success - don't fail project creation if thread creation fails
      }

      // Success
      setSuccessMessage("Project created successfully! It's pending approval.");
      setFormData({
        project_name: "",
        description: "",
        cap: 1,
        start_date: "",
        end_date: "",
        tags: []
      });
      setSelectedTags([]);
      
      // Fetch updated projects
      fetchProjects();
      
      // Close modal after short delay
      setTimeout(() => {
        setIsShowModal(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrorMessage(error.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pl-24 md:pl-28 min-h-screen">
      <div className="flex justify-between items-center p-2 sm:p-4">
        <div className={`text-xl sm:text-2xl text-violet-400 font-semibold transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
          My Projects
        </div>
        <div className={`flex space-x-3 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-200`}>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={() => setIsShowModal(true)}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg shadow-md hover:bg-violet-600 transition-all duration-300 transform hover:scale-105"
          >
            Create Project
          </button>
        </div>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6`}>
        {isLoading && projects.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <div className="mt-4 text-violet-300">Loading projects...</div>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={project._id}
              className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{project.project_name}</h3>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      project.is_approved === 'approved' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : project.is_approved === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {project.is_approved === 'approved' 
                        ? 'Approved' 
                        : project.is_approved === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-purple-300 mb-3">
                    <div>
                      <span className="block text-violet-400">Capacity</span>
                      {project.cap} Students
                    </div>
                    <div>
                      <span className="block text-violet-400">Timeline</span>
                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Display project tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mb-3">
                      <span className="block text-xs text-violet-400 mb-1">Technologies</span>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => router.push(`/mentor/projects/${project._id}`)}
                    className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-[#2a2a38] rounded-lg border-2 border-violet-300/30">
            <div className="text-gray-400 text-lg">No projects found</div>
            <div className="text-purple-300 text-sm mt-2">You haven't created or been assigned to any projects yet.</div>
            <button 
              onClick={() => setIsShowModal(true)}
              className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg shadow-md hover:bg-violet-600 transition-all duration-300"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isShowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#2a2a38] rounded-lg w-full max-w-2xl border-2 border-violet-400 shadow-lg shadow-violet-500/20 transform transition-all animate-fadeIn">
            <div className="font-semibold text-xl text-white p-4 border-b border-violet-400 flex justify-between items-center">
              <h3>Create New Project</h3>
              <button 
                onClick={() => setIsShowModal(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg">
                  {errorMessage}
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg">
                  {successMessage}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="project_name" className="block text-violet-300 mb-1">Project Name</label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-violet-300 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-h-[100px]"
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="block text-violet-300 mb-1">Project Tags</label>
                <div className="relative" ref={tagsDropdownRef}>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsTagsDropdownOpen(true);
                    }}
                    onFocus={() => setIsTagsDropdownOpen(true)}
                    placeholder="Search for technologies..."
                    className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  
                  {isTagsDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-[#2a2a38] border-2 border-violet-500/30 rounded-lg shadow-lg">
                      {filteredTags.length > 0 ? (
                        filteredTags.slice(0, 10).map((tag, index) => (
                          <div 
                            key={index} 
                            className="p-2 hover:bg-violet-500/20 cursor-pointer text-white transition-colors"
                            onClick={() => handleTagSelect(tag)}
                          >
                            {tag}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-400">
                          {searchTerm ? "No matching technologies found" : "Start typing to search technologies"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag, index) => (
                      <div key={index} className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full text-sm flex items-center border border-violet-500/30">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => handleRemoveTag(tag)} 
                          className="ml-2 text-violet-300 hover:text-white transition-colors"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cap" className="block text-violet-300 mb-1">Max Students</label>
                  <input
                    type="number"
                    id="cap"
                    name="cap"
                    min="1"
                    max="10"
                    value={formData.cap}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="start_date" className="block text-violet-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="end_date" className="block text-violet-300 mb-1">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-[#1e1e2d] border-2 border-violet-500/30 rounded-lg text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsShowModal(false)}
                  className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add global CSS for custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}