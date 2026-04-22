"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HtmlEscapeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const htmlEscape = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const htmlUnescape = (str: string): string => {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  };

  const handleConvert = () => {
    if (mode === "encode") {
      setOutput(htmlEscape(input));
    } else {
      setOutput(htmlUnescape(input));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
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
        <h1 className="text-3xl font-bold mb-2">HTML Entity Encoder/Decoder</h1>
        <p className="text-muted-foreground mb-6">
          Encode or decode HTML special characters
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")} className="w-auto">
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleSwap} disabled={!output}>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={mode === "encode" ? "<div>Hello & World</div>" : "&lt;div&gt;Hello&lt;/div&gt;"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              <Button onClick={handleConvert} className="mt-4 w-full">
                {mode === "encode" ? "Encode HTML Entities" : "Decode HTML Entities"}
              </Button>
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
                placeholder="Result will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono">
              <div><code>&amp;</code> → <code>&amp;amp;</code></div>
              <div><code>&lt;</code> → <code>&amp;lt;</code></div>
              <div><code>&gt;</code> → <code>&amp;gt;</code></div>
              <div><code>"</code> → <code>&amp;quot;</code></div>
              <div><code>'</code> → <code>&amp;#x27;</code></div>
              <div><code> </code> → <code>&amp;nbsp;</code></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
