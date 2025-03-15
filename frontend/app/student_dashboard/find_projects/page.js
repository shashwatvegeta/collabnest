"use client";
import { ProjectDisplayCard } from "@/components/ui/project_display_card";
import { useState, useEffect } from "react";

const find_projects = () => {
  const [recommendedProjects, setRecommendedProjects] = useState([]);
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
  return (
    <div className="p-8 my-4">
      <div className="text-4xl text-violet-400 p-4 font-semibold">Projects</div>
      <div className="text-2xl text-white p-4">
        Browse and Find Projects Relevant For You
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-4">
          <input
            placeholder="Search for Projects"
            className="bg-[#2a2a38] border-violet-300 text-white rounded-full outline-none p-4 focus:border"
            style={{ width: "40vw" }}
          />
        </div>
        {
          recommendedProjects.map((p) => <ProjectDisplayCard {...p} />)
        }
      </div>
    </div>
  );
};
export default find_projects;
