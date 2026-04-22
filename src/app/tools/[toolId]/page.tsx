"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolById, Tool } from "@/config/tools";
import { JsonYamlTool } from "@/components/tools/converter/JsonYamlTool";

function ToolPageContent({ tool }: { tool: Tool }) {
  // 根据工具 ID 渲染对应的组件
  switch (tool.id) {
    case "json-yaml":
    case "yaml-json":
      return <JsonYamlTool />;
    default:
      return (
        <div className="min-h-screen">
          <header className="border-b">
            <div className="container py-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to tools</span>
              </Link>
            </div>
          </header>
          <main className="container py-8">
            <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
            <p className="mt-4 text-muted-foreground">
              This tool is coming soon...
            </p>
          </main>
        </div>
      );
  }
}

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  return <ToolPageContent tool={tool} />;
}
