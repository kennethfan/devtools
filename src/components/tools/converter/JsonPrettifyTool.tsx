"use client";

import { useState } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";
import { ArrowLeft, Copy, Check, Eraser, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const { t } = useLocaleContext();

export function JsonPrettifyTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const handlePrettify = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
    try {
      JSON.parse(value);
    } catch {
      // 还在输入中
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">JSON Prettify & Minify</h1>
          <p className="text-muted-foreground">
            Format JSON with indentation or minify to remove whitespace
          </p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
              <option value={0}>Tab</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Eraser className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Input JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={'{\n  "name": "example",\n  "value": 123\n}'}
                className="min-h-[300px] font-mono text-sm"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Output</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrettify}>
                  <Wand2 className="h-4 w-4 mr-1" />
                  Prettify
                </Button>
                <Button variant="ghost" size="sm" onClick={handleMinify}>
                  Minify
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Output will appear here..."
                className="min-h-[300px] font-mono text-sm"
                value={output}
                readOnly
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div><kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Enter</kbd> Prettify</div>
            <div><kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">M</kbd> Minify</div>
          </div>
        </div>
      </main>
    </div>
  );
}
