"use client";
import { useEffect, useState } from "react";
import { getEmail } from "@/lib/auth_utility";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProjectDetails({ params }) {
  const id = React.use(params).id;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const router = useRouter();
  
  // Add Task modal state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "Pending"
  });
  const [taskError, setTaskError] = useState("");

  // Function to toggle task completion status
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
      const isCompleting = newStatus === "Completed";
      
      if (isCompleting && students.length > 0) {
        // Show loading indicator or disable the checkbox during the update
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, isUpdating: true } : task
          )
        );
      }
      
      const response = await fetch(`http://localhost:3001/projects/${id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task status: ${response.statusText}`);
      }

      const updatedTask = await response.json();
      
      // Update the tasks state with the updated task
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...updatedTask, isUpdating: false } : task
      ));
      
      // Show a notification if completing a task
      if (isCompleting && students.length > 0) {
        alert(`Task completed successfully! ${students.length} student(s) were awarded 200 XP each.`);
      }
      
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Reset the updating state in case of error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, isUpdating: false } : task
        )
      );
      
      alert(`Failed to update task: ${error.message}`);
    }
  };

  // Handle task input changes
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    
    try {
      // Validate inputs
      if (!newTask.title.trim()) {
        setTaskError("Title is required");
        return;
      }
      
      if (!newTask.description.trim()) {
        setTaskError("Description is required");
        return;
      }
      
      if (!newTask.deadline) {
        setTaskError("Deadline is required");
        return;
      }
      
      const response = await fetch(`http://localhost:3001/projects/${id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create task: ${response.statusText} - ${errorText}`);
      }

      const createdTask = await response.json();
      
      // Add the new task to the tasks state
      setTasks([...tasks, createdTask]);
      
      // Reset form and close modal
      setNewTask({
        title: "",
        description: "",
        deadline: "",
        status: "Pending"
      });
      setIsAddTaskModalOpen(false);
      
    } catch (error) {
      console.error('Error creating task:', error);
      setTaskError(`Failed to create task: ${error.message}`);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      // Prepare the request body based on the status
      const updateData = {
        review_date: new Date()
      };
      
      if (status === 'approved') {
        updateData.approval_notes = 'Application approved by mentor';
      } else if (status === 'rejected') {
        updateData.rejection_reason = 'Application rejected by mentor';
      }
      
      console.log("Sending update request:", {
        url: `http://localhost:3001/projects/${id}/applications/${applicationId}`,
        data: updateData
      });

      const response = await fetch(`http://localhost:3001/projects/${id}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      // Try to parse response as text first
      const responseText = await response.text();
      console.log("Server response:", {
        status: response.status,
        ok: response.ok,
        text: responseText
      });

      if (!response.ok) {
        throw new Error(`Failed to update application status: ${response.statusText} - ${responseText}`);
      }

      // Parse the response if it's JSON
      let updatedApplication;
      try {
        updatedApplication = JSON.parse(responseText);
        console.log("Updated application:", updatedApplication);
        
        // Update the applications in the UI with the server response data
        setApplications(applications.map(app => 
          app._id === applicationId ? updatedApplication : app
        ));

        // If application is approved, update the students list
        if (status === 'approved') {
          try {
            const studentsResponse = await fetch(`http://localhost:3001/project/${id}/students`);
            if (studentsResponse.ok) {
              const studentsData = await studentsResponse.json();
              console.log("Fetched students:", studentsData);
              setStudents(studentsData);
            } else {
              console.error("Failed to fetch students:", await studentsResponse.text());
            }
          } catch (err) {
            console.error("Error fetching students:", err);
          }
        }
      } catch (e) {
        console.warn("Response is not valid JSON:", responseText);
        // Fallback to local update if we can't parse the response
        setApplications(applications.map(app => 
          app._id === applicationId ? { ...app, status } : app
        ));
      }
      
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(`Failed to update application status: ${error.message}`);
    }
  };

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
            console.log("Fetched students:", studentsData);
            setStudents(studentsData);
          } else {
            console.error("Failed to fetch students:", await studentsResponse.text());
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
            console.log("Fetched applications:", applicationsData);
            setApplications(applicationsData);
          } else {
            console.error("Failed to fetch applications:", await applicationsResponse.text());
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
                <div className="bg-slate-900/30 rounded-lg p-4 mb-6 border border-slate-700/50">
                  <p className="text-slate-300 whitespace-pre-line">{project.description}</p>
                </div>
                
                {/* Project Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="bg-slate-900/30 rounded-lg p-4 mb-6 border border-slate-700/50">
                    <h3 className="text-violet-400 font-semibold mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full border border-indigo-600/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
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
                        <div className="flex items-center justify-center h-full text-violet-300">
                          {student.username ? student.username.charAt(0).toUpperCase() : "S"}
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium">{student.username || "Student"}</div>
                        <div className="text-gray-400 text-sm">{student.email || ""}</div>
                        {student.roll_number && <div className="text-gray-500 text-xs">Roll: {student.roll_number}</div>}
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
              <button 
                className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                onClick={() => setIsAddTaskModalOpen(true)}
              >
                Add Task
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-indigo-900/40 border border-indigo-500/30 rounded-md">
              <p className="text-sm text-indigo-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
                Completing a task awards 200 XP to each student enrolled in the project
              </p>
            </div>
            
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-indigo-900/40 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleToggleTaskStatus(task._id, task.status)}
                          disabled={task.isUpdating}
                          className={`mr-3 h-5 w-5 rounded border-gray-600 bg-gray-700 text-violet-500 focus:ring-violet-500 ${
                            task.isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'
                          }`}
                        />
                        <h4 className={`text-white font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                          {task.isUpdating && (
                            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-violet-400 border-r-transparent align-[-0.125em]"></span>
                          )}
                        </h4>
                        {/* Add XP indicator */}
                        {task.status !== 'Completed' && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                            +200 XP
                          </span>
                        )}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'Completed' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm mt-2 ml-8">{task.description}</p>
                    <div className="flex justify-between mt-3 text-xs text-gray-400 ml-8">
                      <div>Assigned to: {task.assigned_to?.length > 0 ? task.assigned_to.join(", ") : 'Unassigned'}</div>
                      <div>Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No due date'}</div>
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
                {applications.map((application, index) => {
                  console.log("Application data:", application);
                  return (
                    <div key={index} className="bg-indigo-900/40 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-medium">
                            {application.user_id?.username || 'Unknown Student'}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {application.user_id?.email || ''}
                            {application.user_id?.roll_number ? ` (${application.user_id.roll_number})` : ''}
                          </div>
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
                      
                      {application.motivation_statement && (
                        <div className="mt-3">
                          <div className="text-violet-400 text-xs">Motivation Statement:</div>
                          <p className="text-purple-200 text-sm mt-1">{application.motivation_statement}</p>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <div className="text-violet-400 text-xs">Resume Link:</div>
                        <a 
                          href={application.resume_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 text-sm mt-1 underline"
                        >
                          View Resume
                        </a>
                      </div>
                      
                      <div className="mt-4 flex space-x-2 justify-end">
                        {application.status === 'pending' && (
                          <>
                            <button 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              onClick={() => {
                                console.log("Application ID:", application._id);
                                handleUpdateApplicationStatus(application._id, 'approved');
                              }}
                            >
                              Approve
                            </button>
                            <button 
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              onClick={() => {
                                console.log("Application ID:", application._id);
                                handleUpdateApplicationStatus(application._id, 'rejected');
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {application.status !== 'pending' && (
                          <span className="text-gray-400 text-xs">
                            {application.status === 'approved' ? 'Application approved' : 'Application rejected'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No applications received for this project yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 p-6 w-full max-w-md">
            <h3 className="text-violet-400 text-lg font-semibold mb-4">Add New Task</h3>
            
            {taskError && (
              <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-2 rounded-lg mb-4">
                {taskError}
              </div>
            )}
            
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-violet-300 mb-1 text-sm" htmlFor="title">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskInputChange}
                  className="w-full bg-indigo-900/40 border border-violet-300/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-violet-300 mb-1 text-sm" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskInputChange}
                  className="w-full bg-indigo-900/40 border border-violet-300/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px]"
                  placeholder="Enter task description"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-violet-300 mb-1 text-sm" htmlFor="deadline">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleTaskInputChange}
                  className="w-full bg-indigo-900/40 border border-violet-300/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-violet-300 mb-1 text-sm" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleTaskInputChange}
                  className="w-full bg-indigo-900/40 border border-violet-300/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 