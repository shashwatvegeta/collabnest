"use client";
import { useEffect, useState } from "react";
import { getEmail } from "@/lib/auth_utility";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProjectDetails({ params }) {
  const { id } = params;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const router = useRouter();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch project details
        const response = await fetch(`http://localhost:3001/project/${id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        
        const projectData = await response.json();
        setProject(projectData);
        
        // Fetch students
        try {
          const studentsResponse = await fetch(`http://localhost:3001/project/${id}/students`);
          if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            setStudents(studentsData);
          }
        } catch (err) {
          console.error("Error fetching students:", err);
        }
        
        // Fetch tasks
        try {
          const tasksResponse = await fetch(`http://localhost:3001/projects/${id}/tasks`);
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
          }
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
        
        // Fetch applications
        try {
          const applicationsResponse = await fetch(`http://localhost:3001/projects/${id}/applications`);
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            setApplications(applicationsData);
          }
        } catch (err) {
          console.error("Error fetching applications:", err);
        }
        
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleBack = () => {
    router.push("/mentor/projects");
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs">Approved</span>;
    } else if (status === 'rejected') {
      return <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs">Rejected</span>;
    } else {
      return <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs">Pending</span>;
    }
  };

  const getCompletionBadge = (isCompleted) => {
    if (isCompleted) {
      return <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs">Completed</span>;
    } else {
      return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs">In Progress</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 pl-24 md:pl-28">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-violet-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-4 text-violet-300 text-lg">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 pl-24 md:pl-28">
        <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={handleBack} 
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all duration-300"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 pl-24 md:pl-28">
        <div className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p>The project you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={handleBack} 
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all duration-300"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 pl-24 md:pl-28">
      {/* Header with back button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button 
            onClick={handleBack}
            className="flex items-center text-violet-400 hover:text-violet-300 transition-colors mb-2 sm:mb-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-3">{project.project_name}</h1>
        </div>
        <div className="flex space-x-2 mt-3 sm:mt-0">
          {getStatusBadge(project.is_approved)}
          {getCompletionBadge(project.is_completed)}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-violet-500/30 mb-6">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "details"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-gray-400 hover:text-violet-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "students"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-gray-400 hover:text-violet-300"
            }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "tasks"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-gray-400 hover:text-violet-300"
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "applications"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-gray-400 hover:text-violet-300"
            }`}
          >
            Applications ({applications.length})
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="animate-fadeIn">
        {activeTab === "details" && (
          <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-violet-400 text-lg font-semibold mb-3">Project Description</h3>
                <p className="text-purple-200 whitespace-pre-line">{project.description}</p>
                
                <h3 className="text-violet-400 text-lg font-semibold mt-6 mb-3">Timeline</h3>
                <div className="flex justify-between bg-indigo-900/40 p-3 rounded-lg">
                  <div>
                    <div className="text-gray-400 text-sm">Start Date</div>
                    <div className="text-white">{new Date(project.start_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm text-right">End Date</div>
                    <div className="text-white">{new Date(project.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-violet-400 text-lg font-semibold mb-3">Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between bg-indigo-900/40 p-3 rounded-lg">
                    <div className="text-gray-400">Student Capacity</div>
                    <div className="text-white">{project.cap}</div>
                  </div>
                  <div className="flex justify-between bg-indigo-900/40 p-3 rounded-lg">
                    <div className="text-gray-400">Students Enrolled</div>
                    <div className="text-white">{students.length} / {project.cap}</div>
                  </div>
                  <div className="flex justify-between bg-indigo-900/40 p-3 rounded-lg">
                    <div className="text-gray-400">Completion Status</div>
                    <div>{getCompletionBadge(project.is_completed)}</div>
                  </div>
                  <div className="flex justify-between bg-indigo-900/40 p-3 rounded-lg">
                    <div className="text-gray-400">Approval Status</div>
                    <div>{getStatusBadge(project.is_approved)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden p-6">
            <h3 className="text-violet-400 text-lg font-semibold mb-4">Enrolled Students</h3>
            
            {students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student, index) => (
                  <div key={index} className="bg-indigo-900/40 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-violet-800">
                        {student.profilePicture ? (
                          <Image
                            src={student.profilePicture}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-violet-300">
                            {student.name?.charAt(0) || "S"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{student.name}</div>
                        <div className="text-gray-400 text-sm">{student.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No students enrolled in this project yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-violet-400 text-lg font-semibold">Project Tasks</h3>
              <button className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                Add Task
              </button>
            </div>
            
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-indigo-900/40 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="text-white font-medium">{task.title}</h4>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : task.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm mt-2">{task.description}</p>
                    <div className="flex justify-between mt-3 text-xs text-gray-400">
                      <div>Assigned to: {task.assignedTo || 'Unassigned'}</div>
                      <div>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No tasks created for this project yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden p-6">
            <h3 className="text-violet-400 text-lg font-semibold mb-4">Project Applications</h3>
            
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application, index) => (
                  <div key={index} className="bg-indigo-900/40 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">{application.applicantName}</div>
                        <div className="text-gray-400 text-sm">{application.applicantEmail}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        application.status === 'approved' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : application.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {application.status || 'Pending'}
                      </div>
                    </div>
                    
                    {application.message && (
                      <div className="mt-3">
                        <div className="text-violet-400 text-xs">Application Message:</div>
                        <p className="text-purple-200 text-sm mt-1">{application.message}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex space-x-2 justify-end">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors">
                        Approve
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No applications received for this project yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 