"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLocaleContext } from "@/components/LocaleProvider";

export function YamlFormatterTool() {
  const { t } = useLocaleContext();
  const [input, setInput] = useState(`name: john
age: 30
active: true
tags:
  - developer
  - designer`);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setError(t("common.error"));
      return;
    }

    try {
      const yaml = require("js-yaml");
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, { indent, lineWidth: -1 });
      setOutput(formatted);
      setError("");
    } catch (e) {
      setError(t("common.error"));
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError(t("common.error"));
      return;
    }

    try {
      const yaml = require("js-yaml");
      const parsed = yaml.load(input);
      const minified = yaml.dump(parsed, { indent: 0, lineWidth: -1, flowLevel: 0 });
      setOutput(minified.trim());
      setError("");
    } catch (e) {
      setError(t("common.error"));
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    try {
      const yaml = require("js-yaml");
      yaml.load(input);
      setError("");
      alert("✓ Valid YAML");
    } catch (e) {
      setError(t("common.error"));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">YAML {t("common.format")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("tool.inputYaml")}
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("tool.configuration")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm mb-2 block">Indent</label>
                <Input
                  type="number"
                  value={indent}
                  onChange={(e) => setIndent(parseInt(e.target.value) || 2)}
                  min={1}
                  max={8}
                  className="w-20"
                />
              </div>
              <Button variant="outline" onClick={handleValidate} className="mt-6">
                Validate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("tool.inputYaml")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter YAML..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  {t("common.format")}
                </Button>
                <Button variant="outline" onClick={handleMinify}>
                  {t("common.minify")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("tool.output")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted YAML will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}