"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Project {
  id: string;
  title: string;
  language: string;
  createdAt: string;
}

const languageImages: { [key: string]: string } = {
  javascript: "/js.png",
  python: "/python.png",
  typescript: "/typescript.png",
};

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[] | null>(null); // Start with null to represent "loading"
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch projects from the API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get("/api/codeProjects");
        console.log(response.data)
        setProjects(response.data || []); // Fallback to an empty array if data is missing
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]); // Set to an empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No projects found. Create a new one!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/dashboard/compiler/projects/${project.id}`)}
          >
            <div className="flex items-center mb-4">
              {/* Language Icon */}
              <img
                src={languageImages[project.language.toLowerCase()] || "/images/languages/default.png"}
                alt={project.language}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-gray-600">{project.language}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
