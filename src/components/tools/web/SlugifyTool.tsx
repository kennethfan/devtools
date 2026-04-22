"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SlugifyTool() {
  const [input, setInput] = useState("Hello World Example Text");
  const [output, setOutput] = useState("");
  const [customSeparator, setCustomSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slugify = (text: string, separator: string, toLower: boolean): string => {
    if (!text) return "";

    let result = text
      // Replace non-alphanumeric chars with separator
      .replace(/[^a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]/g, separator)
      // Replace multiple spaces/separators with single
      .replace(new RegExp(`[\\s${separator}]+`, "g"), separator)
      // Trim separator from edges
      .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");

    if (toLower) {
      result = result.toLowerCase();
    }

    return result;
  };

  const handleSlugify = () => {
    setOutput(slugify(input, customSeparator, lowercase));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    "Hello World",
    "The Quick Brown Fox",
    "Some *Special@ Characters!",
    "Multiple   Spaces",
    "UPPERCASE TEXT",
  ];

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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Slugify</h1>
        <p className="text-muted-foreground mb-6">
          Convert text to URL-friendly slug format
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Convert to lowercase</label>
              <Button
                variant={lowercase ? "default" : "outline"}
                size="sm"
                onClick={() => setLowercase(!lowercase)}
              >
                {lowercase ? "Yes" : "No"}
              </Button>
            </div>
            <div>
              <label className="text-sm mb-2 block">Custom separator</label>
              <div className="flex gap-2">
                {["-", "_", "."].map((sep) => (
                  <Button
                    key={sep}
                    variant={customSeparator === sep ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCustomSeparator(sep)}
                  >
                    {sep}
                  </Button>
                ))}
                <Input
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  className="w-16 text-center"
                  maxLength={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to slugify..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleSlugify} className="w-full">
                Generate Slug
              </Button>
            </CardContent>
          </Card>

          {output && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Slug Output</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <code className="block bg-muted p-3 rounded text-sm break-all">
                  {output}
                </code>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {examples.map((example, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setInput(example);
                    setOutput(slugify(example, customSeparator, lowercase));
                  }}
                >
                  <span className="flex-1 text-sm">{example}</span>
                  <span className="text-muted-foreground">→</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {slugify(example, customSeparator, lowercase)}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
