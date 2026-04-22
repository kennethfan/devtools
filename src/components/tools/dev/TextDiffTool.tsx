"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function TextDiffTool() {
  const [left, setLeft] = useState("Hello World\nThis is the first text.");
  const [right, setRight] = useState("Hello World\nThis is the modified text.");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCompare = async () => {
    const diff = await import("diff");
    const changes = diff.diffChars(left, right);
    
    const result = changes.map((change: any) => {
      const prefix = change.added ? "+ " : change.removed ? "- " : "  ";
      const value = change.value;
      return prefix + value;
    }).join("\n");
    
    setOutput(result || "No differences");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h1 className="text-3xl font-bold mb-2">Text Diff</h1>
        <p className="text-muted-foreground mb-6">
          Compare two text inputs and show character-level differences
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Original Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter original text..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modified Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter modified text..."
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleCompare} className="w-full mb-4">
          Compare Text
        </Button>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Differences</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output.split("\n").map((line, i) => {
                  const color = line.startsWith("+ ") ? "text-green-600" : line.startsWith("- ") ? "text-red-600" : "";
                  return (
                    <span key={i} className={color}>
                      {line}
{"\n"}
                    </span>
                  );
                })}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}