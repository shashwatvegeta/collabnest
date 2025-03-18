"use client";
import { ProjectCard } from "@/components/ui/project_card";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function OngoingProjects() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setName(getName());
  }, []);
  useEffect(() => {
    setEmail(getEmail());
  }, []);
  useEffect(() => {
    setUser({
      name: name,
      type: "Student",
      email: email,
      tel: "987654321",
      pfp_src: "/user_placeholder.png",
      level: 5,
      level_progression: 0.72,
      badges: ["First Badge", "Quick Learner", "Team Player"],
    });
  }, [email, name]);

  useEffect(() => {
    setOngoingProjects([
      {
        name: "Web Development Portfolio",
        desc: "Create a personal portfolio showcasing your projects",
        level: "Intermediate",
        logo: "PanelTop",
      },
      {
        name: "API Integration Project",
        desc: "Build an Application that integrates external APIs",
        level: "Advanced",
        logo: "PanelTop",
      },
    ]);
  }, [user]);
  return (
    <div className="p-4 my-8">
      <div className="text-4xl text-violet-400 p-4 font-semibold">
        Ongoing Projects
      </div>
      <div className="text-xl text-white font-semibold px-4">
        Track Your Current Projects
      </div>
      <div className="grid grid-cols-3 gap-8 text-white p-8">
        {ongoingProjects
          ? ongoingProjects.map((p, index) => (
            <ProjectCard key={index} {...p} />
          ))
          : ""}
      </div>
    </div>
  );
}
