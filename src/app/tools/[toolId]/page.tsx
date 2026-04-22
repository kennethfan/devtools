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
import { UrlParserTool } from "@/components/tools/web/UrlParserTool";
import { UserAgentParserTool } from "@/components/tools/web/UserAgentParserTool";
import { DeviceInfoTool } from "@/components/tools/web/DeviceInfoTool";
import { HttpStatusCodesTool } from "@/components/tools/web/HttpStatusCodesTool";
import { BasicAuthTool } from "@/components/tools/web/BasicAuthTool";
import { SlugifyTool } from "@/components/tools/web/SlugifyTool";
import { OtpGeneratorTool } from "@/components/tools/web/OtpGeneratorTool";
import { MimeTypesTool } from "@/components/tools/web/MimeTypesTool";
import { SqlFormatterTool } from "@/components/tools/dev/SqlFormatterTool";
import { YamlFormatterTool } from "@/components/tools/dev/YamlFormatterTool";
import { XmlFormatterTool } from "@/components/tools/dev/XmlFormatterTool";
import { JsonDiffTool } from "@/components/tools/dev/JsonDiffTool";
import { TextDiffTool } from "@/components/tools/dev/TextDiffTool";
import { RegexTesterTool } from "@/components/tools/dev/RegexTesterTool";
import { CronGeneratorTool } from "@/components/tools/dev/CronGeneratorTool";
import { GitCheatSheetTool } from "@/components/tools/dev/GitCheatSheetTool";
import { ChmodCalculatorTool } from "@/components/tools/dev/ChmodCalculatorTool";
import { DockerComposeTool } from "@/components/tools/dev/DockerComposeTool";
import { EmailNormalizerTool } from "@/components/tools/dev/EmailNormalizerTool";
import { MathCalculatorTool } from "@/components/tools/math/MathCalculatorTool";
import { PercentageCalculatorTool } from "@/components/tools/math/PercentageCalculatorTool";
import { ETACalculatorTool } from "@/components/tools/math/ETACalculatorTool";

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
    case "url-parser":
      return <UrlParserTool />;
    case "user-agent-parser":
      return <UserAgentParserTool />;
    case "device-info":
      return <DeviceInfoTool />;
    case "http-status-codes":
      return <HttpStatusCodesTool />;
    case "basic-auth":
      return <BasicAuthTool />;
    case "slugify":
      return <SlugifyTool />;
    case "otp-generator":
      return <OtpGeneratorTool />;
    case "mime-types":
      return <MimeTypesTool />;
    case "sql-formatter":
      return <SqlFormatterTool />;
    case "yaml-formatter":
      return <YamlFormatterTool />;
    case "xml-formatter":
      return <XmlFormatterTool />;
    case "json-diff":
      return <JsonDiffTool />;
    case "text-diff":
      return <TextDiffTool />;
    case "regex-tester":
      return <RegexTesterTool />;
    case "cron-generator":
      return <CronGeneratorTool />;
    case "git-cheatsheet":
      return <GitCheatSheetTool />;
    case "chmod-calculator":
      return <ChmodCalculatorTool />;
    case "docker-compose-converter":
      return <DockerComposeTool />;
    case "email-normalizer":
      return <EmailNormalizerTool />;
    case "math-calculator":
      return <MathCalculatorTool />;
    case "percentage-calculator":
      return <PercentageCalculatorTool />;
    case "eta-calculator":
      return <ETACalculatorTool />;
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
