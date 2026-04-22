"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function XmlFormatterTool() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">
    <name>Example</name>
    <value>123</value>
  </item>
</root>`);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setError("Please enter XML");
      return;
    }

    try {
      const xmlJs = require("xml-js");
      const parsed = xmlJs.xml2js(input, { compact: false });
      
      // Recursive function to add indentation
      const indentXml = (xml: string, spaces: number): string => {
        let result = "";
        let indentLevel = 0;
        const lines = xml.split("\n");
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          // Decrease indent for closing tags
          if (trimmed.startsWith("</")) {
            indentLevel = Math.max(0, indentLevel - 1);
          }
          
          // Add indented line
          result += " ".repeat(indentLevel * spaces) + trimmed + "\n";
          
          // Increase indent for opening tags (not self-closing)
          if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.startsWith("<?")) {
            if (!trimmed.endsWith("/>") && !trimmed.includes("</")) {
              indentLevel++;
            }
          }
        }
        
        return result.trim();
      };
      
      const js2xml = xmlJs.js2xml(parsed, { compact: false, spaces: indent });
      setOutput(js2xml);
      setError("");
    } catch (e) {
      setError("Invalid XML. Please check the syntax.");
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Please enter XML");
      return;
    }

    try {
      const xmlJs = require("xml-js");
      const parsed = xmlJs.xml2js(input, { compact: false });
      const minified = xmlJs.js2xml(parsed, { compact: true, spaces: 0 });
      setOutput(minified);
      setError("");
    } catch (e) {
      setError("Invalid XML");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    try {
      const xmlJs = require("xml-js");
      xmlJs.xml2js(input);
      setError("");
      alert("✓ Valid XML");
    } catch (e) {
      setError("Invalid XML: " + (e as Error).message);
    }
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
        <h1 className="text-3xl font-bold mb-2">XML Formatter</h1>
        <p className="text-muted-foreground mb-6">
          Format and validate XML documents
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm mb-2 block">Indent</label>
                <input
                  type="number"
                  value={indent}
                  onChange={(e) => setIndent(parseInt(e.target.value) || 2)}
                  min={1}
                  max={8}
                  className="border rounded px-2 py-1 w-20"
                />
              </div>
              <Button variant="outline" onClick={handleValidate} className="mt-6">
                Validate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input XML</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter XML..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  Format
                </Button>
                <Button variant="outline" onClick={handleMinify}>
                  Minify
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Formatted XML</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted XML will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}