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
import { JsonCsvTool } from "@/components/tools/converter/JsonCsvTool";
import { JsonTomlTool } from "@/components/tools/converter/JsonTomlTool";
import { JsonXmlTool } from "@/components/tools/converter/JsonXmlTool";
import { HtmlEscapeTool } from "@/components/tools/converter/HtmlEscapeTool";
import { ColorFormatTool } from "@/components/tools/converter/ColorFormatTool";
import { CaseConverterTool } from "@/components/tools/converter/CaseConverterTool";
import { BaseConverterTool } from "@/components/tools/converter/BaseConverterTool";
import { ListConverterTool } from "@/components/tools/converter/ListConverterTool";
import { TokenGeneratorTool } from "@/components/tools/crypto/TokenGeneratorTool";
import { BcryptTool } from "@/components/tools/crypto/BcryptTool";
import { AesCryptoTool } from "@/components/tools/crypto/AesCryptoTool";
import { HmacTool } from "@/components/tools/crypto/HmacTool";
import { RsaKeyTool } from "@/components/tools/crypto/RsaKeyTool";
import { PasswordStrengthTool } from "@/components/tools/crypto/PasswordStrengthTool";

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
    case "json-csv":
      return <JsonCsvTool />;
    case "json-toml":
    case "toml-json":
      return <JsonTomlTool />;
    case "json-xml":
    case "xml-json":
      return <JsonXmlTool />;
    case "html-escape":
      return <HtmlEscapeTool />;
    case "color-format":
      return <ColorFormatTool />;
    case "case-converter":
      return <CaseConverterTool />;
    case "base-converter":
      return <BaseConverterTool />;
    case "list-converter":
      return <ListConverterTool />;
    case "token-generator":
      return <TokenGeneratorTool />;
    case "bcrypt":
      return <BcryptTool />;
    case "aes-crypto":
      return <AesCryptoTool />;
    case "hmac-generator":
      return <HmacTool />;
    case "rsa-key":
      return <RsaKeyTool />;
    case "password-strength":
      return <PasswordStrengthTool />;
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
