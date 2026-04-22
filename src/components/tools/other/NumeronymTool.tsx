"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NumeronymTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ original: string; numeronym: string }[]>([]);
  const [copied, setCopied] = useState("");

  const generate = () => {
    if (!input.trim()) return;
    
    const words = input.split(/\s+/).filter(Boolean);
    const results = words.map(word => {
      if (word.length <= 3) {
        return { original: word, numeronym: word };
      }
      
      const first = word[0];
      const middle = word.length - 2;
      const last = word[word.length - 1];
      
      return { original: word, numeronym: `${first}${middle}${last}` };
    });
    
    setOutput(results);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
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
        <h1 className="text-3xl font-bold mb-2">Numeronym Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate numeronyms like "a11y" for "accessibility"
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Enter words (e.g., accessibility, internationalization)"
            />
            <Button onClick={generate} className="w-full">
              Generate
            </Button>
          </CardContent>
        </Card>

        {output.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {output.map(({ original, numeronym }, i) => (
                <div
                  key={i}
                  onClick={() => handleCopy(numeronym)}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                >
                  <span className="font-mono">{original}</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-lg">{numeronym}</code>
                    {copied === numeronym && <Check className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}