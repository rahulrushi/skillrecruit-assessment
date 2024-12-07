import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle GET requests (Fetch a single project by ID)
export async function GET(request: Request) {
  try {
    // Extract the ID from the request URL (assuming the ID is part of the URL)
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Extract the last part of the URL

    // Ensure id is available
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Fetch project by ID from Prisma
    const project = await prisma.codeProject.findUnique({
      where: { id },
    });

    // If project not found, return 404
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return the found project with a success status
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    // Log error and return 500
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      const body = await request.json();
      console.log(body); // Log the body to see what you're sending
  
      const { id, language, version, source, output } = body; // Destructure expected fields
  
      // Ensure the required fields (id, language, version) are provided
      if (!id || !language || !version || !source || !output) {
        return NextResponse.json(
          { error: "Missing required fields: id, language, version, source, or output." },
          { status: 400 }
        );
      }
  
      // Update the project in the database
      const updatedProject = await prisma.codeProject.update({
        where: { id },
        data: {
          language,
          version,
          source,
          output,  // If the 'output' is an array, you may want to validate it before sending to Prisma
        },
      });
  
      // Return the updated project
      return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
  }
  
// Handle DELETE requests (Delete a project by ID)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      if (!id) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
      }
  
      // Delete the project from the database
      await prisma.codeProject.delete({
        where: { id },
      });
  
      // Return a response indicating successful deletion (even if no content is returned)
      return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
  }
  