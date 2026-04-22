"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stringify, parse } from "@iarna/toml";

export function JsonTomlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-toml" | "toml-to-json">("json-to-toml");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const jsonToToml = (jsonStr: string): string => {
    try {
      const obj = JSON.parse(jsonStr);
      return stringify(obj);
    } catch (e) {
      throw new Error("Invalid JSON");
    }
  };

  const tomlToJson = (tomlStr: string): string => {
    try {
      const obj = parse(tomlStr);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      throw new Error("Invalid TOML");
    }
  };

  const handleConvert = () => {
    try {
      if (mode === "json-to-toml") {
        setOutput(jsonToToml(input));
      } else {
        setOutput(tomlToJson(input));
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    setMode((m) => (m === "json-to-toml" ? "toml-to-json" : "json-to-toml"));
    setInput(output);
    setOutput("");
    setError("");
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
        <h1 className="text-3xl font-bold mb-2">JSON ↔ TOML Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between JSON and TOML formats
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "json-to-toml" | "toml-to-json")} className="w-auto">
            <TabsList>
              <TabsTrigger value="json-to-toml">JSON → TOML</TabsTrigger>
              <TabsTrigger value="toml-to-json">TOML → JSON</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={swapMode} disabled={!output}>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {mode === "json-to-toml" ? "JSON Input" : "TOML Input"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={
                  mode === "json-to-toml"
                    ? '{\n  "name": "example",\n  "version": "1.0.0"\n}'
                    : `name = "example"\nversion = "1.0.0"`
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button onClick={handleConvert} className="w-full">
                Convert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {mode === "json-to-toml" ? "TOML Output" : "JSON Output"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
