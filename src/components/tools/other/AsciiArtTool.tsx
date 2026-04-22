"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const figletFonts = [
  "standard", "small", "slant", "block", "bubble", "digital", "doom", "lean", "mini", "script", "shadow", "speed", "tiny"
];

export function AsciiArtTool() {
  const [text, setText] = useState("Hello");
  const [font, setFont] = useState("standard");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState<string | boolean>(false);

  const generate = async () => {
    try {
      const figlet = require("figlet");
      figlet(text, { font }, (err: Error | null, data: string) => {
        if (err) {
          setOutput("Error generating ASCII art");
          return;
        }
        setOutput(data);
      });
    } catch (e) {
      setOutput("FIGlet not available. Install figlet package.");
    }
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">ASCII Art Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate ASCII art text
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div>
              <label className="text-sm mb-2 block">Font</label>
              <Select value={font} onValueChange={(v) => setFont(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {figletFonts.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} className="w-full">
              Generate
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">{output}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}