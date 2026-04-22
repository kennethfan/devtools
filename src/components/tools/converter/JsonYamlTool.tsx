"use client";

import { useState } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import yaml from "js-yaml";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function JsonYamlTool() {
  const { t } = useLocaleContext();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "json-to-yaml") {
        const jsonObj = JSON.parse(input);
        setOutput(yaml.dump(jsonObj, { indent: 2, lineWidth: -1 }));
      } else {
        const yamlObj = yaml.load(input);
        setOutput(JSON.stringify(yamlObj, null, 2));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input");
      setOutput("");
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
    try {
      if (mode === "json-to-yaml") {
        JSON.parse(value); // 验证 JSON
      } else {
        yaml.load(value); // 验证 YAML
      }
    } catch (e) {
      // 还在输入中，不显示错误
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const newMode = mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    setMode(newMode);
    setInput(output);
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
            <span>{t("common.back")} to tools</span>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">JSON ↔ YAML Converter</h1>
          <p className="text-muted-foreground">
            Convert between JSON and YAML formats
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList className="mb-4">
            <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
            <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
          </TabsList>

          <TabsContent value={mode}>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleSwap}>
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={
                      mode === "json-to-yaml"
                        ? '{\n  "key": "value"\n}'
                        : "key: value"
                    }
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
                  <CardTitle className="text-sm font-medium">
                    {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleConvert}>
                      Convert
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
