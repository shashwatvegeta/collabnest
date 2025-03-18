"use client";
import { ProjectDisplayCard } from "@/components/ui/project_display_card";
import Link from "next/link";
import { useState, useEffect } from "react";

const find_projects = () => {
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(recommendedProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const filteredData = recommendedProjects.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredProjects(filteredData);
  };
  useEffect(() => {
    setRecommendedProjects([
      {
        id: 1,
        name: "Web Development Portfolio",
        desc: "Create a personal portfolio showcasing your projects",
        level: "Intermediate",
        logo: "PanelTop",
        tags: ["Development"],
      },
      {
        id: 2,
        name: "API Integration Project",
        desc: "Build an Application that integrates external APIs",
        level: "Advanced",
        logo: "PanelTop",
      },
      {
        id: 3,
        name: "API Integration Project",
        desc: "Build an Application that integrates external APIs",
        level: "Advanced",
        logo: "PanelTop",
      },
    ]);
  }, []);
  useEffect(() => {
    setFilteredProjects(recommendedProjects);
  }, [recommendedProjects]);
  return (
    <div className="p-8 my-4">
      <div className="text-4xl text-violet-400 p-4 font-semibold">Projects</div>
      <div className="text-2xl text-white p-4">
        Browse and Find Projects Relevant For You
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-4">
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for Projects"
            className="bg-[#2a2a38] border-violet-300 text-white rounded-full outline-none p-4 focus:border"
            style={{ width: "40vw" }}
          />
        </div>
        {filteredProjects.map((p) => (
          <Link
            href={`/student_dashboard/project_application?id=${p.id}`}
            key={p.id}
          >
            <ProjectDisplayCard {...p} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default find_projects;
