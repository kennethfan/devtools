"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab" | "constant";

const transformations: { label: string; value: CaseType; example: string }[] = [
  { label: "UPPERCASE", value: "upper", example: "HELLO WORLD" },
  { label: "lowercase", value: "lower", example: "hello world" },
  { label: "Title Case", value: "title", example: "Hello World" },
  { label: "Sentence case", value: "sentence", example: "Hello world" },
  { label: "camelCase", value: "camel", example: "helloWorld" },
  { label: "snake_case", value: "snake", example: "hello_world" },
  { label: "kebab-case", value: "kebab", example: "hello-world" },
  { label: "CONSTANT_CASE", value: "constant", example: "HELLO_WORLD" },
];

const applyTransformation = (text: string, type: CaseType): string => {
  // Split into words (handle spaces, hyphens, underscores)
  const words = text.split(/[\s-_]+/).filter(Boolean);

  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "camel":
      return words
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
    case "constant":
      return words.map((w) => w.toUpperCase()).join("_");
    default:
      return text;
  }
};

export function CaseConverterTool() {
  const [input, setInput] = useState("hello world example text");
  const [results, setResults] = useState<Record<CaseType, string>>({
    upper: "",
    lower: "",
    title: "",
    sentence: "",
    camel: "",
    snake: "",
    kebab: "",
    constant: "",
  });
  const [copied, setCopied] = useState<CaseType | "all" | null>(null);

  const handleConvert = () => {
    const newResults: Record<CaseType, string> = {} as Record<CaseType, string>;
    transformations.forEach(({ value }) => {
      newResults[value] = applyTransformation(input, value);
    });
    setResults(newResults);
  };

  const handleCopy = (text: string, type: CaseType) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const all = transformations
      .map(({ label, value }) => `${label}: ${results[value]}`)
      .join("\n");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Case Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert text between different case formats
        </p>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Input</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setInput("")}>
              Clear
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to convert..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] font-mono"
            />
            <Button onClick={handleConvert} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Convert All
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={copyAll}>
            {copied === "all" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            Copy All
          </Button>
        </div>

        <div className="grid gap-3">
          {transformations.map(({ label, value, example }) => (
            <Card key={value}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-28">
                      {label}
                    </span>
                    <code
                      className={`text-sm px-2 py-1 rounded ${
                        results[value]
                          ? "bg-muted"
                          : "text-muted-foreground"
                      }`}
                    >
                      {results[value] || example}
                    </code>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(results[value] || example, value)}
                  disabled={!results[value]}
                >
                  {copied === value ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
