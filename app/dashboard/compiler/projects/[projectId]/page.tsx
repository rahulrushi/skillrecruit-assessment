// app/dashboard/compiler/projects/[projectId]/page.tsx
import { use } from 'react';  // For handling async data
import { NextPageContext } from 'next';
import { EditorUpdate } from '@/components/EditorUpdate';

interface Params {
  projectId: string;
}

interface ProjectPageProps {
  projectId: string;
}

export default function ProjectPage({ params }: { params: Params }) {
  const projectId = params.projectId;  // Accessing projectId from params

  if (!projectId) {
    return <div>Project not found</div>;  // Handle if the projectId is missing
  }

  return <EditorUpdate projectId={projectId} />;
}
