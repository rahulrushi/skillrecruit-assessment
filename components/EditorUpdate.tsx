"use client";
import React, { useRef, useState, useEffect } from "react";
import SelectLanguages, { selectedLanguageOptionProps } from "./SelectLanguages";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { Loader, Play, Trash, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import { useRouter } from 'next/navigation';


interface EditorUpdateProps {
    projectId: string;
  }

  export const EditorUpdate: React.FC<EditorUpdateProps> = ({ projectId }) =>  {
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const [codeExecuted, setCodeExecuted] = useState(false); 
  const editorRef = useRef(null);
  const router = useRouter(); 


  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleOnchange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }

  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
  }

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: sourceCode,
        },
      ],
    };

    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      setLoading(false);
      setErr(false);
      setCodeExecuted(true); // Mark code as executed
      toast.success("Compiled Successfully");
    } catch (error) {
      setErr(true);
      setLoading(false);
      setCodeExecuted(false); // Reset the code executed flag on error
      toast.error("Failed to compile the code");
      console.log(error);
    }
  }

  async function saveCode() {
    const requestData = {
      id: projectId,
      language: languageOption.language,
      version: languageOption.version,
      source: sourceCode,
      output: output,
    };

    try {
      const response = await axios.patch(`/api/codeProjects/${projectId}`, requestData);
      toast.success("Project saved successfully!");
      console.log("Saved project:", response.data);
    } catch (error) {
      toast.error("Failed to save the project");
      console.error("Save error:", error);
    }
  }

  
  async function deleteProject() {
    try {
      setLoading(true);
  
      // Sending DELETE request
      const response = await axios.delete(`/api/codeProjects/${projectId}`);
  
      // If the response status is OK (200), show success message
      if (response.status === 200) {
        
        toast.success("Project deleted successfully!");
        router.push('/dashboard/compiler/projects');  // Adjust the path to your projects list page

        // Optionally handle the UI change, like redirecting to a list of projects or removing the project from the UI
      } else {
        toast.error("Failed to delete the project");
      }
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Catch and handle any errors
      toast.error("Failed to delete the project");
      console.error("Delete error:", error);
    }
  }
  

  useEffect(() => {
    // Fetch project details from the server when the component loads
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/codeProjects/${projectId}`);
        const projectData = response.data;
        setSourceCode(projectData.source);
        setLanguageOption({
          language: projectData.language,
          version: projectData.version,
          aliases: [], // You may need to handle aliases depending on your data structure
        });
      } catch (error) {
        toast.error("Failed to load project");
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <div className="h-screen w-screen">
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Code Compiler - {projectId}
        </h2>
        <div className="flex items-center space-x-2 ">
          <div className="w-[230px]">
            <SelectLanguages onSelect={onSelect} selectedLanguageOption={languageOption} />
          </div>
        </div>
      </div>
      <div className="bg-slate-400 p-3 rounded-2xl">
        <ResizablePanelGroup direction="horizontal" className="w-full rounded-lg border">
          <ResizablePanel defaultSize={150} minSize={35}>
            <Editor
              theme={"vs-light"}
              height="100vh"
              defaultLanguage={languageOption.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              value={sourceCode}
              onChange={handleOnchange}
              language={languageOption.language}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-300 min-h-screen">
              <div className="flex items-center justify-between bg-slate-400 px-6 py-2">
                <h2>Output</h2>
                {loading ? (
                  <Button disabled size={"sm"} className="text-slate-100 bg-slate-800">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span>Running please wait...</span>
                  </Button>
                ) : (
                  <div className="flex gap-4 items-center">
                    {/* Show Save button only after Run button is clicked */}
                    {codeExecuted && (
                        <div  className="flex gap-4 items-center">

                      <Button
                        onClick={saveCode}
                        size="sm"
                        className="text-slate-100 bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                       <Button
                       onClick={deleteProject}
                       size="sm"
                       className="text-slate-100 bg-red-600 hover:bg-red-700"
                     >
                       <Trash className="w-4 h-4 mr-2" />
                       Delete
                     </Button>
                        </div>
                    )}
                    <Button
                      onClick={executeCode}
                      size={"sm"}
                      className="text-slate-100 bg-slate-800 hover:bg-slate-900"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      <span>Run</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="px-6 space-y-2">
                {err ? (
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-xs">Failed to compile the code. Please try again!</p>
                  </div>
                ) : (
                  <>
                    {output.map((item, index) => (
                      <p className="text-sm" key={index}>
                        {item}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
