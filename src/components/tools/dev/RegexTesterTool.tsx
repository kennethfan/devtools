"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: string[];
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("The quick brown fox jumps over the lazy dog");
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleTest = () => {
    if (!pattern) {
      setError("Please enter a regex pattern");
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);
      setError("");

      const results: RegexMatch[] = [];
      
      if (flags.includes("g")) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testString);
        if (match) results.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
      
      setMatches(results);
    } catch (e) {
      setIsValid(false);
      setError((e as Error).message);
      setMatches([]);
    }
  };

  useEffect(() => {
    handleTest();
  }, []);

  const handleCopy = () => {
    const text = matches.map(m => m.fullMatch).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonPatterns = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { label: "URL", pattern: "https?:\\/\\/[^\\s]+" },
    { label: "Phone", pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
    { label: "IP Address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
    { label: "Date", pattern: "\\d{4}[-/]\\d{2}[-/]\\d{2}" },
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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
        <p className="text-muted-foreground mb-6">
          Test regular expressions against text
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Regex Pattern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTest()}
                  placeholder="Enter regex pattern..."
                  className="font-mono"
                />
              </div>
              <div className="w-24">
                <Input
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g"
                  className="font-mono"
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <div className="flex gap-2 flex-wrap">
              {commonPatterns.map(({ label, pattern }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPattern(pattern);
                    handleTest();
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Test String</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTest()}
              className="min-h-[100px] font-mono"
              placeholder="Enter text to test against..."
            />
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <Card className={isValid ? "border-green-500" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Matches ({matches.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-2 bg-muted rounded"
                  >
                    <span className="text-sm text-muted-foreground w-8">
                      #{i + 1}
                    </span>
                    <code className="flex-1 font-mono">{match.fullMatch}</code>
                    <span className="text-sm text-muted-foreground">
                      at {match.index}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}