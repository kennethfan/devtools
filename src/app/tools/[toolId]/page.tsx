"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolById, Tool } from "@/config/tools";
import { JsonYamlTool } from "@/components/tools/converter/JsonYamlTool";
import { JsonPrettifyTool } from "@/components/tools/converter/JsonPrettifyTool";
import { Base64Tool } from "@/components/tools/converter/Base64Tool";
import { UrlEncodeTool } from "@/components/tools/converter/UrlEncodeTool";
import { UuidTool } from "@/components/tools/crypto/UuidTool";
import { HashTool } from "@/components/tools/crypto/HashTool";
import { JwtParserTool } from "@/components/tools/web/JwtParserTool";
import { QrcodeTool } from "@/components/tools/images/QrcodeTool";

function ToolPageContent({ tool }: { tool: Tool }) {
  // 根据工具 ID 渲染对应的组件
  switch (tool.id) {
    case "json-yaml":
    case "yaml-json":
      return <JsonYamlTool />;
    case "json-prettify":
    case "json-minify":
      return <JsonPrettifyTool />;
    case "base64":
      return <Base64Tool />;
    case "url-encode":
      return <UrlEncodeTool />;
    case "uuid-generator":
    case "ulid-generator":
      return <UuidTool />;
    case "hash-text":
      return <HashTool />;
    case "jwt-parser":
      return <JwtParserTool />;
    case "qrcode-generator":
      return <QrcodeTool />;
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
