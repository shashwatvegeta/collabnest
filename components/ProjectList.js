import { formatProjectForCard } from '../utils/formatProjectData';
import { ProjectCard } from '../frontend/components/ui/project_card';

const ProjectList = ({ projects }) => {
    console.log(projects);
  return (
    <div className="project-list">
      {projects.map(project => {
        const formattedProject = formatProjectForCard(project);
        return (
          <ProjectCard 
            key={formattedProject.id}
            project={formattedProject}
          />
        );
      })}
    </div>
  );
};

export default ProjectList;
