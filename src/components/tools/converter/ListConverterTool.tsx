"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SeparatorType = "comma" | "semicolon" | "newline" | "space" | "tab";
type OutputFormat = "array" | "list" | "lines";

const separators: { label: string; value: SeparatorType }[] = [
  { label: "Comma (,)", value: "comma" },
  { label: "Semicolon (;)", value: "semicolon" },
  { label: "Newline", value: "newline" },
  { label: "Space", value: "space" },
  { label: "Tab", value: "tab" },
];

const formats: { label: string; value: OutputFormat }[] = [
  { label: "Array", value: "array" },
  { label: "List", value: "list" },
  { label: "Separate Lines", value: "lines" },
];

export function ListConverterTool() {
  const [input, setInput] = useState("apple\nbanana\ncherry");
  const [inputSeparator, setInputSeparator] = useState<SeparatorType>("newline");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("array");
  const [outputSeparator, setOutputSeparator] = useState<SeparatorType>("comma");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const getSeparator = (type: SeparatorType): string => {
    switch (type) {
      case "comma": return ",";
      case "semicolon": return ";";
      case "newline": return "\n";
      case "space": return " ";
      case "tab": return "\t";
      default: return ",";
    }
  };

  const parseItems = (text: string): string[] => {
    const sep = getSeparator(inputSeparator);
    return text.split(sep).map((item) => item.trim()).filter(Boolean);
  };

  const formatOutput = (items: string[]): string => {
    const sep = getSeparator(outputSeparator);

    switch (outputFormat) {
      case "array":
        return `[${items.map((item) => `"${item}"`).join(", ")}]`;
      case "list":
        return items.join(sep);
      case "lines":
        return items.join("\n");
      default:
        return items.join(sep);
    }
  };

  const handleConvert = () => {
    const items = parseItems(input);
    setOutput(formatOutput(items));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearDuplicates = () => {
    const items = parseItems(input);
    const unique = [...new Set(items)];
    setInput(unique.join(getSeparator(inputSeparator)));
  };

  const handleTrim = () => {
    const items = parseItems(input);
    setInput(items.map((item) => item.trim()).join(getSeparator(inputSeparator)));
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
        <h1 className="text-3xl font-bold mb-2">List Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between different list formats and separators
        </p>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm">Input separator:</label>
            <Select
              value={inputSeparator}
              onValueChange={(v) => setInputSeparator(v as SeparatorType)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {separators.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Output format:</label>
            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as OutputFormat)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Output separator:</label>
            <Select
              value={outputSeparator}
              onValueChange={(v) => setOutputSeparator(v as SeparatorType)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {separators.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Input List</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleTrim}>
                  Trim
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearDuplicates}>
                  Dedup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter items separated by the input separator..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Items count: {parseItems(input).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Converted output will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleConvert} className="w-full mt-4">
          Convert
        </Button>
      </div>
    </div>
  );
}
