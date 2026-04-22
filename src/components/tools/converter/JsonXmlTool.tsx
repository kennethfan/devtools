"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function JsonXmlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-xml" | "xml-to-json">("json-to-xml");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const jsonToXml = (obj: unknown, rootName = "root"): string => {
    const escapeXml = (str: string): string => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    const format = (value: unknown, name: string, spaces: number): string => {
      const indentStr = " ".repeat(spaces);

      if (value === null || value === undefined) {
        return `${indentStr}<${name}></${name}>`;
      }

      if (typeof value === "boolean" || typeof value === "number") {
        return `${indentStr}<${name}>${value}</${name}>`;
      }

      if (typeof value === "string") {
        return `${indentStr}<${name}>${escapeXml(value)}</${name}>`;
      }

      if (Array.isArray(value)) {
        return value
          .map((item) => format(item, name, spaces))
          .join("\n");
      }

      if (typeof value === "object") {
        const children = Object.entries(value as Record<string, unknown>)
          .map(([key, val]) => format(val, key, spaces + indent))
          .join("\n");
        return `${indentStr}<${name}>\n${children}\n${indentStr}</${name}>`;
      }

      return "";
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${format(obj, "item", indent)}\n</${rootName}>`;
  };

  const xmlToJson = (xml: string): string => {
    // Simple XML parser
    const parseXml = (xmlStr: string): unknown => {
      const removeXmlDeclaration = xmlStr.replace(
        /<\?xml[^?]*\?>/,
        ""
      ).trim();
      
      const parseNode = (xml: string): unknown => {
        const tagMatch = xml.match(/<([a-zA-Z_][\w.-]*)[^>]*>([\s\S]*?)<\/\1>/);
        if (!tagMatch) {
          // Check for self-closing or empty tag
          const selfClosing = xml.match(/^<([a-zA-Z_][\w.-]*)[^>]*\/>/);
          if (selfClosing) return null;
          // Text content
          return xml.trim() || null;
        }

        const [, tagName, content] = tagMatch;
        const attributes: Record<string, string> = {};
        const attrMatch = tagName.match(/(\w+)(.*)/);
        
        let textContent = content;
        const children: Record<string, unknown>[] = [];

        // Check for child elements
        const childTagRegex = /<([a-zA-Z_][\w.-]*)[^>]*>/g;
        let childMatch;
        let lastIndex = 0;
        let currentPos = 0;

        while ((childMatch = childTagRegex.exec(content)) !== null) {
          const childStart = childMatch.index;
          const beforeChild = content.slice(lastIndex, childStart).trim();
          
          if (beforeChild) {
            textContent = beforeChild;
          }
          
          // Find matching closing tag
          const childTagName = childMatch[1];
          const childStartIndex = childStart + childMatch[0].length;
          let depth = 1;
          let searchPos = childStartIndex;
          
          while (depth > 0 && searchPos < content.length) {
            const nextOpen = content.indexOf(`<${childTagName}`, searchPos);
            const nextClose = content.indexOf(`</${childTagName}>`, searchPos);
            
            if (nextOpen !== -1 && nextOpen < nextClose) {
              depth++;
              searchPos = nextOpen + childTagName.length + 1;
            } else if (nextClose !== -1) {
              depth--;
              if (depth === 0) {
                const childXml = content.slice(childStart, nextClose + childTagName.length + 3);
                children.push({ name: childTagName, xml: childXml });
                lastIndex = nextClose + childTagName.length + 3;
              }
              searchPos = nextClose + childTagName.length + 3;
            } else {
              break;
            }
          }
        }

        // Check for text-only content
        const textOnly = content.replace(/<[^>]+>/g, "").trim();
        if (children.length === 0 && textOnly) {
          return textOnly;
        }

        // Build result object
        const result: Record<string, unknown> = {};
        for (const child of children) {
          const childValue = parseNode(child.xml as string);
          const name = child.name as string;
          if (result[name]) {
            if (!Array.isArray(result[name])) {
              result[name] = [result[name]];
            }
            (result[name] as unknown[]).push(childValue);
          } else {
            result[name] = childValue;
          }
        }

        return Object.keys(result).length === 1 && result[Object.keys(result)[0]] === null
          ? textOnly || null
          : result;
      };

      return parseNode(removeXmlDeclaration);
    };

    const parsed = parseXml(xml);
    return JSON.stringify(parsed, null, indent);
  };

  const handleConvert = () => {
    try {
      if (mode === "json-to-xml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToXml(parsed));
      } else {
        setOutput(xmlToJson(input));
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    setMode((m) => (m === "json-to-xml" ? "xml-to-json" : "json-to-xml"));
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">JSON ↔ XML Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between JSON and XML formats
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={mode === "json-to-xml" ? "default" : "outline"}
              onClick={() => setMode("json-to-xml")}
            >
              JSON → XML
            </Button>
            <Button
              variant={mode === "xml-to-json" ? "default" : "outline"}
              onClick={() => setMode("xml-to-json")}
            >
              XML → JSON
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={swapMode}>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Swap
            </Button>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-background border rounded px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {mode === "json-to-xml" ? "JSON Input" : "XML Input"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={
                  mode === "json-to-xml"
                    ? '{"name": "John", "age": 30}'
                    : `<root>\n  <item>\n    <name>John</name>\n    <age>30</age>\n  </item>\n</root>`
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
              <Button onClick={handleConvert} className="mt-4 w-full">
                Convert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {mode === "json-to-xml" ? "XML Output" : "JSON Output"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
