"use client";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ui/project_card";
import { getEmail } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { useRouter } from "next/navigation";

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

  // Form state
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    cap: 1,
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    setEmail(getEmail());
  }, []);

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

      // Success
      setSuccessMessage("Project created successfully! It's pending approval.");
      setFormData({
        project_name: "",
        description: "",
        cap: 1,
        start_date: "",
        end_date: ""
      });
      
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {successMessage && (
              <div className="p-4 bg-green-600/20 border-l-4 border-green-600 text-green-100 my-2 mx-4">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-600/20 border-l-4 border-red-600 text-red-100 my-2 mx-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-violet-300 mb-1">Project Name*</label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                    className="w-full p-2 rounded bg-indigo-900/40 border border-violet-400/50 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-violet-300 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={4}
                    className="w-full p-2 rounded bg-indigo-900/40 border border-violet-400/50 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Describe your project (min 10 characters)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-violet-300 mb-1">Student Capacity*</label>
                  <input
                    type="number"
                    name="cap"
                    value={formData.cap}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full p-2 rounded bg-indigo-900/40 border border-violet-400/50 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-violet-300 mb-1">Start Date*</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                      className="w-full p-2 rounded bg-indigo-900/40 border border-violet-400/50 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-violet-300 mb-1">End Date*</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                      className="w-full p-2 rounded bg-indigo-900/40 border border-violet-400/50 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="text-sm text-violet-200 italic">
                  Your project will be created with a "pending" approval status.
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsShowModal(false)}
                    className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2 bg-violet-600 text-white rounded hover:bg-violet-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
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