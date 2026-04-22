"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ObfuscationType = "base64" | "hex" | "rot13" | "reverse" | "unicode";

export function StringObfuscatorTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ type: ObfuscationType; value: string }[]>([]);
  const [copied, setCopied] = useState("");

  const obfuscate = () => {
    if (!input.trim()) return;
    
    const results: { type: ObfuscationType; value: string }[] = [];
    
    // Base64
    try {
      results.push({ type: "base64", value: btoa(input) });
    } catch (e) {
      results.push({ type: "base64", value: "Error encoding" });
    }
    
    // Hex
    const hex = Array.from(input)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
    results.push({ type: "hex", value: hex });
    
    // ROT13
    const rot13 = input.replace(/[a-zA-Z]/g, c => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
    });
    results.push({ type: "rot13", value: rot13 });
    
    // Reverse
    results.push({ type: "reverse", value: input.split("").reverse().join("") });
    
    // Unicode
    const unicode = Array.from(input)
      .map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"))
      .join("");
    results.push({ type: "unicode", value: unicode });
    
    setOutput(results);
  };

  const decode = () => {
    // Try to decode base64
    try {
      setInput(atob(output.find(o => o.type === "base64")?.value || ""));
    } catch (e) {
      // Ignore
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
  };

  const typeLabels: Record<ObfuscationType, string> = {
    base64: "Base64",
    hex: "Hexadecimal",
    rot13: "ROT13",
    reverse: "Reverse",
    unicode: "Unicode",
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
        <h1 className="text-3xl font-bold mb-2">String Obfuscator</h1>
        <p className="text-muted-foreground mb-6">
          Obfuscate strings for security testing
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to obfuscate..."
              className="min-h-[100px] font-mono"
            />
            <Button onClick={obfuscate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Obfuscate
            </Button>
          </CardContent>
        </Card>

        {output.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {output.map(({ type, value }) => (
                <div
                  key={type}
                  onClick={() => handleCopy(value)}
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                >
                  <div className="text-sm text-muted-foreground mb-1">{typeLabels[type]}</div>
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-sm truncate flex-1">{value}</code>
                    {copied === value && <Check className="h-4 w-4 text-green-500" />}
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