"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocaleContext } from "@/components/LocaleProvider";

export function JsonDiffTool() {
  const { t } = useLocaleContext();
  const [left, setLeft] = useState(`{"name": "John", "age": 30}`);
  const [right, setRight] = useState(`{"name": "John", "age": 31, "city": "NYC"}`);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCompare = () => {
    try {
      const diff = require("diff");
      const changes = diff.diffJson(JSON.parse(left), JSON.parse(right));
      
      const result = changes.map((change: any) => {
        const prefix = change.added ? "+ " : change.removed ? "- " : "  ";
        const lines = change.value.split("\n").filter(Boolean);
        return lines.map((line: string) => prefix + line).join("\n");
      }).join("\n");
      
      setOutput(result || t("tool.noDifferences"));
    } catch (e) {
      setOutput(t("tool.invalidJson"));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setLeft(output);
    setRight(right);
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
        <h1 className="text-3xl font-bold mb-2">JSON Diff</h1>
        <p className="text-muted-foreground mb-6">
          {t("tool.inputJson")}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("tool.leftOriginal")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter first JSON..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("tool.rightModified")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter second JSON..."
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleCompare} className="w-full mb-4">
          {t("common.compare")}
        </Button>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("tool.result")}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSwap}>
                  <ArrowRightLeft className="h-4 w-4 mr-1" />
                  {t("tool.useResult")}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap">{output}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}