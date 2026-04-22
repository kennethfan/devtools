"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Dialect = "sql" | "plsql" | "mysql" | "postgresql" | "sqlite";

export function SqlFormatterTool() {
  const [input, setInput] = useState("SELECT id, name, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [tabWidth, setTabWidth] = useState(2);
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) {
      setError("Please enter SQL query");
      return;
    }

    try {
      const { format } = await import("sql-formatter");
      const formatted = format(input, {
        language: dialect,
        tabWidth,
        keywordCase,
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
      setError("");
    } catch (e) {
      setError("Failed to format SQL. Please check the query syntax.");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMinify = async () => {
    if (!input.trim()) {
      setError("Please enter SQL query");
      return;
    }

    try {
      const { format } = await import("sql-formatter");
      const formatted = format(input, {
        language: dialect,
        tabWidth: 0,
        keywordCase,
        linesBetweenQueries: 0,
      });
      setOutput(formatted.replace(/\s+/g, " ").trim());
      setError("");
    } catch (e) {
      setError("Failed to minify SQL");
      setOutput("");
    }
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
        <h1 className="text-3xl font-bold mb-2">SQL Formatter</h1>
        <p className="text-muted-foreground mb-6">
          Format and beautify SQL queries
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-2 block">Dialect</label>
                <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sql">Standard SQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="plsql">PL/SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Tab Width</label>
                <Select value={tabWidth.toString()} onValueChange={(v) => setTabWidth(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Keyword Case</label>
                <Select value={keywordCase} onValueChange={(v) => setKeywordCase(v as "upper" | "lower" | "preserve")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upper">UPPER</SelectItem>
                    <SelectItem value="lower">lower</SelectItem>
                    <SelectItem value="preserve">Preserve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input SQL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter SQL query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  Format
                </Button>
                <Button variant="outline" onClick={handleMinify}>
                  Minify
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Formatted SQL</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted SQL will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}