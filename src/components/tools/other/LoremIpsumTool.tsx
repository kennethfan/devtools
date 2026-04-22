"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.",
];

type Format = "words" | "sentences" | "paragraphs";

export function LoremIpsumTool() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<Format>("words");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState<string | boolean>(false);

  const generate = () => {
    let result = "";
    
    switch (format) {
      case "words": {
        const allWords = loremParagraphs.join(" ").split(" ");
        for (let i = 0; i < count; i++) {
          result += allWords[Math.floor(Math.random() * allWords.length)] + " ";
        }
        result = result.trim();
        break;
      }
      case "sentences": {
        for (let i = 0; i < count; i++) {
          result += loremParagraphs[Math.floor(Math.random() * loremParagraphs.length)] + " ";
        }
        result = result.trim();
        break;
      }
      case "paragraphs": {
        for (let i = 0; i < count; i++) {
          result += loremParagraphs[Math.floor(Math.random() * loremParagraphs.length)] + "\n\n";
        }
        result = result.trim();
        break;
      }
    }
    
    setOutput(result);
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate placeholder text for drafts and prototypes
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Format</label>
                <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Count</label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <Button onClick={generate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Generated Text</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{output}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}