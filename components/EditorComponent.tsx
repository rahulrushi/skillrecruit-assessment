"use client";
import React, { useRef, useState } from "react";
import SelectLanguages, {
  selectedLanguageOptionProps,
} from "./SelectLanguages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { Loader, Play, TriangleAlert } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";
import axios from "axios";

export interface CodeSnippetsProps {
  [key: string]: string;
}

export default function EditorComponent() {
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const [codeExecuted, setCodeExecuted] = useState(false);

  const editorRef = useRef(null);

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
      setCodeExecuted(true); // Mark as executed
      console.log(result);
      setLoading(false);
      setErr(false);
      toast.success("Compiled Successfully");
    } catch (error) {
      setErr(true);
      setLoading(false);
      toast.error("Failed to compile the Code");
      console.log(error);
    }
  }

  async function saveCode() {
    if (!codeExecuted || output.length === 0) {
      alert("Please execute the code first before saving!");
      return;
    }

    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      source: sourceCode,
      output: output,
    };

    try {
      const response = await axios.post("/api/codeProjects", requestData);
      toast.success("Project saved successfully!");
      console.log("Saved project:", response.data);
    } catch (error) {
      toast.error("Failed to save the project");
      console.error("Save error:", error);
    }
  }

  return (
    <div className="h-screen w-screen">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Code Compiler
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-[230px]">
            <SelectLanguages
              onSelect={onSelect}
              selectedLanguageOption={languageOption}
            />
          </div>
        </div>
      </div>
      {/* EDITOR */}
      <div className="bg-slate-400 p-3 rounded-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border"
        >
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
                  <Button
                    disabled
                    size={"sm"}
                    className="text-slate-100 bg-slate-800"
                  >
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span>Running please wait...</span>
                  </Button>
                ) : (
                  <div className="flex gap-4 items-center">
                    {/* Show Save button only after Run button is clicked */}
                    {codeExecuted && (
                      <Button
                        onClick={saveCode}
                        size="sm"
                        className="text-slate-100 bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
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
                    <p className="text-xs">
                      Failed to Compile the Code. Please try again!
                    </p>
                  </div>
                ) : (
                  <>
                    {output.map((item) => (
                      <p className="text-sm" key={item}>
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
