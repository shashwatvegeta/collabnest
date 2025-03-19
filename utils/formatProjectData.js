/**
 * Formats raw project data to be compatible with the ProjectCard component
 * @param {Object} project - Raw project data
 * @returns {Object} - Formatted project data
 */
export const formatProjectForCard = (project) => {
  return {
    id: project._id,
    name: project.project_name,
    description: project.description,
    status: {
      approved: project.is_approved,
      completed: project.is_completed
    },
    timeline: {
      startDate: new Date(project.start_date),
      endDate: new Date(project.end_date)
    },
    participants: {
      owner: project.project_owner,
      enrolled: project.students_enrolled,
      capacity: project.cap,
      openSpots: project.cap - (project.students_enrolled?.length || 0)
    },
    tags: project.tags,
    applications: project.project_application?.length || 0,
    tasks: project.tasks?.length || 0
  };
};
