import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle GET requests (Fetch all code projects)
export async function GET() {
  try {
    const projects = await prisma.codeProject.findMany();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// Handle POST requests (Create a new code project)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await prisma.codeProject.create({
      data: body,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
